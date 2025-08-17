from rest_framework import serializers
from ..models import Vehicle, Apartment, Resident
from datetime import date

class VehicleSerializer(serializers.ModelSerializer):
    apartmentCode = serializers.CharField(source='member.apartment.apartmentCode', read_only=True)
    fullName = serializers.CharField(source='member.resident.fullName', read_only=True)
    phoneNumber = serializers.CharField(source='member.resident.phoneNumber', read_only=True)

    class Meta:
        model = Vehicle
        fields = [
            "vehicleId", "member", "licensePlate", "vehicleType", "brand", "color", "timeregister", "status", "apartmentCode", "fullName", "phoneNumber"]
        extra_kwargs = {
            'status': {'read_only': True},
            'timeregister': {'read_only': True},
        }

    def create(self, validated_data):
        validated_data['status'] = 'inuse' 
        validated_data['timeregister'] = date.today()
        return super().create(validated_data)