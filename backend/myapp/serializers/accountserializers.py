from rest_framework import serializers
from django.contrib.auth import authenticate
from django.contrib.auth import get_user_model
from djoser.serializers import UserCreateSerializer, UserSerializer
from ..models import Role, Account, Apartment, Resident, Member
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .apartmentserializers import ApartmentSerializer

class RoleSerializer(serializers.ModelSerializer):
    class Meta:
        models = Role
        fields = ["role_id", "name"]

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