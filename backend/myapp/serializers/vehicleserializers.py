from rest_framework import serializers
from ..models import Vehicle
from datetime import date

class VehicleSerializer(serializers.ModelSerializer):
    apartmentCode = serializers.CharField(source='apartment.apartmentCode')
    fullName = serializers.CharField(source='resident.fullName')
    phoneNumber = serializers.CharField(source='resident.phoneNumber')
    class Meta:
        model = Vehicle
        fields = ["vehicleId", "licensePlate", "vehicleType", "brand", "color", "timeregister", "status", "apartmentCode", "fullName", "phoneNumber"]

    def create(self, validated_data):
        validated_data['status'] = 'inuse' 
        validated_data['timeregister'] = date.today()
        return super().create(validated_data)
