from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from ..models import Role, Account, Apartment, Resident, Member
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .apartmentserializers import ApartmentSerializer
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_decode
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.core.mail import send_mail
from django.conf import settings

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        models = Role
        fields = ["role_id", "name"]


class AccountSerializer(serializers.ModelSerializer):
    apartment_code = serializers.CharField(source='apartment.apartmentCode', read_only=True)

    class Meta:
        model = Account
        fields = ['pkid', 'username', 'email', 'apartment_code']

#get the user model
Account = get_user_model()

#create account serializer
class CreateAccountSerializer(UserCreateSerializer):

    class Meta(UserCreateSerializer.Meta):
        model = Account
        fields = ("id", "email", "username", "password", "apartment")
        extra_kwargs = {
            "password": {"write_only": True},
        }

    def create(self, validated_data):
        role = Role.objects.get(pk=2)  # role resident
        
        apartmentcode = validated_data.pop("apartment")

        apartment = Apartment.objects.get(apartmentCode=apartmentcode)
        if apartment.status == "active":
            raise serializers.ValidationError("Căn hộ đã có tài khoản!")
        
        
        #create new resident
        resident = Resident.objects.create(
            fullName=validated_data["username"],
            email=validated_data["email"],
            status="living"
        )

        #create new member
        Member.objects.create(
            resident=resident,
            apartment=apartment,
            isOwner=True
        )

        user = Account.objects.create_user(
            email=validated_data["email"],
            username=validated_data["username"],
            password=validated_data["password"],
            apartment=apartment,
            role=role,
        )
        
        apartment.status = "active" #update status active
        apartment.save()
        return user
    
#custom account serializer
class CustomAccountSerializer(UserSerializer):
    role = RoleSerializer()
    apartmentCode = ApartmentSerializer()

    class Meta(UserSerializer.Meta):
        model = Account
        fields = [
            "id",
            "email",
            "username",
            "role",
            "apartmentCode",
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
            "apartment": user.apartment.apartmentCode if user.apartment else None
        }
        return data
    
#deactive account serializer
class DeactiveAccountSerializer(serializers.Serializer):
    account_id = serializers.IntegerField()

    def validate_account_id(self, value):
        try:
            self.account = Account.objects.get(pkid=value)
        except Account.DoesNotExist:
            raise serializers.ValidationError("User does not exist.")
        return value

    def save(self, **kwargs):
        account = self.account
        apartment = account.apartment

        #lock account
        account.is_active = False
        account.save()

        # update resident.status = 'moved'
        residents = Resident.objects.filter(member__apartment=apartment)
        residents.update(status='moved')

        # delete all members belong to apartment
        Member.objects.filter(apartment=apartment).delete()


        # update apartment.status='inactive'
        apartment.status = Apartment.Status.inactive
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