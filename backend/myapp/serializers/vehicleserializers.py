from rest_framework import serializers
from ..models import Vehicle

class VehicleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vehicle
        fields = ["licensePlate", "vehicleType","brand", "color", "apartment", "resident"]
