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

    def validate(self, attrs):
        if not attrs.get("member"):
            raise serializers.ValidationError({"member": "Chủ xe không được để trống."})
        if not attrs.get("vehicleType"):
            raise serializers.ValidationError({"vehicleType": "Loại xe không được để trống."})
        if not attrs.get("brand"):
            raise serializers.ValidationError({"brand": "Hãng xe không được để trống."})
        if not attrs.get("color"):
            raise serializers.ValidationError({"color": "Màu sắc xe không được để trống."})
        return attrs

    def create(self, validated_data):
        validated_data['status'] = 'inuse' 
        validated_data['timeregister'] = date.today()
        return super().create(validated_data)