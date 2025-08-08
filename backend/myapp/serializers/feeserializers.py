from rest_framework import serializers
from ..models import FeeCollection, FeeType, ApartmentFee, PaymentTransaction, Apartment
from datetime import date

class ApartmentFeeSerializer(serializers.ModelSerializer):
    apartmentCode = serializers.CharField(source='apartment.apartmentCode')
    feeName = serializers.CharField(source='feeCollection.feeType.feeName')
    month = serializers.SerializerMethodField()
    isRequired = serializers.BooleanField(source='feeCollection.feeType.isRequired')
    dueDate = serializers.DateField(source='feeCollection.dueDate')
    class Meta:
        model = ApartmentFee
        fields = ['apartmentFeeId', 'apartmentCode', 'feeName', 'month', 'amount', 'isRequired', 'dueDate', 'status'] 

    def get_month(self, obj):
        return f"{obj.feeCollection.month}/{obj.feeCollection.year}"
