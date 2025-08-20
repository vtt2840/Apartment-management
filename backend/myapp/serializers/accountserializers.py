from rest_framework import serializers
from django.contrib.auth import get_user_model
from djoser.serializers import UserSerializer
from ..models import Role, Account, Apartment, Resident, Member, FeeType, Vehicle, ApartmentFee
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .apartmentserializers import ApartmentSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings
import re

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Role
        fields = ["role_id", "name"]


class AccountSerializer(serializers.ModelSerializer):
    apartment_codes = serializers.SerializerMethodField()

    class Meta:
        model = Account
        fields = ['pkid', 'username', 'email', 'apartment_codes']

    def get_apartment_codes(self, obj):
        return [apt.apartmentCode for apt in obj.apartment_set.all()]

#get the user model
Account = get_user_model()

#create account serializer
class CreateAccountSerializer(serializers.ModelSerializer):
    apartment_code = serializers.CharField(write_only=True)

    class Meta:
        model = Account
        fields = ("id", "email", "username", "password", "apartment_code")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def validate_email(self, value):
        if not value:
            raise serializers.ValidationError("Email không được để trống.")
        regex = r"\S+@\S+\.\S+"
        if not re.match(regex, value):
            raise serializers.ValidationError("Email không đúng định dạng.")
        if Account.objects.filter(email=value).exists():
            raise serializers.ValidationError("Email đã tồn tại.")
        return value

    def validate_username(self, value):
        if not value:
            raise serializers.ValidationError("Tên chủ hộ không được để trống.")
        return value

    def validate_password(self, value):
        if not value:
            raise serializers.ValidationError("Mật khẩu không được để trống.")
        if len(value) < 8:
            raise serializers.ValidationError("Mật khẩu phải chứa ít nhất 8 ký tự.")
        return value

    def validate(self, data):
        apartment_code = data.get("apartment_code")
        if not apartment_code:
            raise serializers.ValidationError({"apartment_code": "Thiếu mã căn hộ."})

        try:
            apartment = Apartment.objects.get(apartmentCode=apartment_code)
        except Apartment.DoesNotExist:
            raise serializers.ValidationError({"apartment_code": "Mã căn hộ không tồn tại."})

        if apartment.account:
            raise serializers.ValidationError({"apartment_code": "Căn hộ đã có tài khoản."})

        return data

    def create(self, validated_data):
        role = Role.objects.get(pk=2)  # role resident
        apartment_code = validated_data.pop("apartment_code", None)

        if not apartment_code:
            raise serializers.ValidationError("Thiếu mã căn hộ.")

        apartment = Apartment.objects.get(apartmentCode=apartment_code)
        if apartment.account:
            raise serializers.ValidationError("Căn hộ đã có tài khoản!")
        
        #create new resident
        resident, created = Resident.objects.get_or_create(
            email=validated_data["email"],
            defaults={
                "fullName": validated_data["username"],
                "status": "living"
            }
        )

        if not created and resident.status == 'left':
            resident.status = 'living'
            resident.save()

        # check to create new member
        if not Member.objects.filter(resident=resident, apartment=apartment).exists():
            Member.objects.create(
                resident=resident,
                apartment=apartment,
                isOwner=True,
                isMember=True
            )

        account = Account.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            role=role,
        )

        #add apartment to feetypelist
        feeTypeList = FeeType.objects.filter(appliedScope='all')
        for fee in feeTypeList:
            fee.applicableApartments.add(apartment_code)
        
        apartment.account = account
        apartment.status = "active" #update status active
        apartment.save()
        return account
    
#custom account serializer
class CustomAccountSerializer(UserSerializer):
    role = RoleSerializer()
    apartments = ApartmentSerializer(source='apartment_set', many=True)

    class Meta(UserSerializer.Meta):
        model = Account
        fields = [
            "id",
            "email",
            "username",
            "role",
            "apartments",
        ]

#custom token obtain pair seriazlizer
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        user = self.user
        data["user"] = {
            "id": str(user.id),
            "email": user.email,
            "username": user.username,
            "role": user.role.name,
            "apartments": [
                {"apartmentCode": apt.apartmentCode}
                for apt in user.apartment_set.all()
            ]
        }
        return data
    
#deactive account serializer
class DeactiveAccountSerializer(serializers.Serializer):
    account_id = serializers.IntegerField()
    apartment_code = serializers.CharField()

    def validate_account_id(self, value):
        try:
            self.account = Account.objects.get(pkid=value)
        except Account.DoesNotExist:
            raise serializers.ValidationError("Account does not exist.")
        return value

    def save(self, **kwargs):
        account = self.account     
        apartments = Apartment.objects.filter(account=account)  
        apartmentCode = self.validated_data['apartment_code']
        apartment = Apartment.objects.get(pk=apartmentCode) 
        
        if len(apartments) > 1: #account assigned to >1 apartment
            # update resident.status = 'left' except owner
            Resident.objects.filter(member__apartment=apartment, member__isOwner=0).update(status='left')
        else: 
            # update resident.status = 'left' 
            Resident.objects.filter(member__apartment=apartment).update(status='left')
            #lock account 
            account.is_active = False
            account.save()

        # delete all members belong to apartment
        Member.objects.filter(apartment=apartment).update(isOwner=0, isMember=0)

        #delete all vehicles belong to apartment
        vehicleList = Vehicle.objects.filter(member__apartment=apartment)
        
        for vehicle in vehicleList:
            vehicle.status = 'deleted'
            vehicle.save()

        #add apartment to feetypelist
        feeTypeList = FeeType.objects.all()
        for fee in feeTypeList:
            fee.applicableApartments.remove(apartmentCode)

        #delete all apartmentfee
        apartmentFeeList = ApartmentFee.objects.filter(apartment=apartment)
        for fee in apartmentFeeList:
            fee.status = ApartmentFee.Status.deleted
            fee.save()

        # update apartment.status='inactive'
        apartment.status = Apartment.Status.inactive
        apartment.account = None
        apartment.save()

        return account
   
#password reset serializer
class PasswordResetSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate_email(self, value):
        if not Account.objects.filter(email=value, is_active=True).exists():
            raise serializers.ValidationError("Email không tồn tại.")
        return value

    def save(self):
        email = self.validated_data['email']
        user = Account.objects.get(email=email)
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)

        reset_link = f"{settings.FRONTEND_RESET_URL}?uid={uid}&token={token}"

        send_mail(
            'Đặt lại mật khẩu',
            f'Nhấn vào link để đặt lại mật khẩu: {reset_link}',
            settings.DEFAULT_FROM_EMAIL,
            [email],
            fail_silently=False,
        )

#password confirm
class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=8)

    def validate_new_password(self, value):
        if not value:
            raise serializers.ValidationError("Mật khẩu không được để trống.")
        if len(value) < 8:
            raise serializers.ValidationError("Mật khẩu phải chứa ít nhất 8 ký tự.")
        return value

    def validate(self, attrs):
        try:
            uid = urlsafe_base64_decode(attrs['uid']).decode()
            user = Account.objects.get(pk=uid)
        except (Account.DoesNotExist, ValueError, TypeError, UnicodeDecodeError):
            raise serializers.ValidationError({'uid': 'Invalid UID'})

        if not default_token_generator.check_token(user, attrs['token']):
            raise serializers.ValidationError({'token': 'Invalid or expired token'})

        attrs['user'] = user
        return attrs

    def save(self):
        user = self.validated_data['user']
        new_password = self.validated_data['new_password']
        user.set_password(new_password)
        user.save()
        return user
    
#find account by apartment
class AccountByApartmentSerializer(serializers.Serializer):
    apartment_code = serializers.CharField()

    def validate_apartment_code(self, value):
        try:
            apartment = Apartment.objects.get(apartmentCode=value)
        except Apartment.DoesNotExist:
            raise serializers.ValidationError("Apartment not found")

        if not apartment.account or not apartment.account.is_active:
            raise serializers.ValidationError("Account not found or inactive")

        self.account = apartment.account 
        return value

    def get_account(self):
        return self.account
    
#check account exist
class CheckAccountSerializer(serializers.Serializer):
    email = serializers.EmailField()
    username = serializers.CharField()
    password = serializers.CharField()

    
    def validate(self, attrs):
        email = attrs.get('email')
        username = attrs.get('username')
        password = attrs.get('password')

        try:
            account = Account.objects.get(email=email, username=username)
        except Account.DoesNotExist:
            if Account.objects.filter(email=email).exists():
                raise serializers.ValidationError("Email taken", code="email_taken")
            raise serializers.ValidationError("Account not found", code="not_found")

        if not account.check_password(password):
            raise serializers.ValidationError("Wrong password", code="invalid_password")

        self.account = account 
        return attrs

    def get_account(self):
        return self.account