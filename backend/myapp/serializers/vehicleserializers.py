from rest_framework import serializers
from ..models import Vehicle, Apartment, Resident
from datetime import date

class VehicleSerializer(serializers.ModelSerializer):
    apartment = serializers.SlugRelatedField(
        slug_field='apartmentCode',
        queryset=Apartment.objects.all()
    )
    resident = serializers.PrimaryKeyRelatedField(queryset=Resident.objects.all())

    apartmentCode = serializers.CharField(source='apartment.apartmentCode', read_only=True)
    fullName = serializers.CharField(source='resident.fullName', read_only=True)
    phoneNumber = serializers.CharField(source='resident.phoneNumber', read_only=True)
    class Meta:
        model = Vehicle
        fields = ["vehicleId", "apartment", "resident", "licensePlate", "vehicleType", "brand", "color", "timeregister", "status", "apartmentCode", "fullName", "phoneNumber"]
        extra_kwargs = {
            'status': {'read_only': True},
            'timeregister': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data['status'] = 'inuse' 
        validated_data['timeregister'] = date.today()
        return super().create(validated_data)
