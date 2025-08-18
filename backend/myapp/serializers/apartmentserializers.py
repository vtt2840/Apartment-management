from rest_framework import serializers
from ..models import Apartment, Member, Account, Resident

class ApartmentSerializer(serializers.ModelSerializer):
    #add owner to show with apartment info
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = ['apartmentCode', 'floor', 'area', 'status', 'owner']

    def get_owner(self, obj):
        member = Member.objects.filter(apartment=obj, isOwner=True, isMember=True).select_related('resident').first()
        if member and member.resident:
            return {
                'fullName': member.resident.fullName,
                'email': member.resident.email
            }
        return None

#assign account exist to apartment
class AssignAccountToApartmentSerializer(serializers.Serializer):
    apartmentCode = serializers.CharField()
    account_id = serializers.IntegerField()
    email = serializers.EmailField()

    def save(self):
        apartmentCode = self.validated_data['apartmentCode']
        account_id = self.validated_data['account_id']
        email = self.validated_data['email']

        apartment = Apartment.objects.get(pk=apartmentCode)
        account = Account.objects.get(pkid=account_id)
        resident = Resident.objects.get(email=email)

        #check to create new member
        if not Member.objects.filter(resident=resident, apartment=apartment).exists():
            Member.objects.create(
                resident=resident,
                apartment=apartment,
                isOwner=True,
                isMember=True
            )

        apartment.status = Apartment.Status.active
        apartment.account = account
        apartment.save()
        
        #if account is inactive before
        if account.is_active == False:
            account.is_active = True
            account.save()
            resident.status = Resident.Status.living
            resident.save()
            member = Member.objects.filter(resident=resident, apartment=apartment)
            for mem in member:
                mem.isMember = True
                mem.isOwner = True
                mem.save()
        return apartment

 
class UpdateApartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Apartment
        fields = ("apartmentCode", "floor", "area")

    def validate_floor(self, value):
        if value is None or value == "":
            raise serializers.ValidationError("Tầng không được để trống.")
        return value

    def validate_area(self, value):
        if value is None or value == "":
            raise serializers.ValidationError("Diện tích không được để trống.")
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    