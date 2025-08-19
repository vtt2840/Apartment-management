from rest_framework import serializers
from ..models import FeeCollection, FeeType, ApartmentFee, PaymentTransaction, Apartment
from datetime import date

class ApartmentFeeSerializer(serializers.ModelSerializer):
    apartmentCode = serializers.CharField(source='apartment.apartmentCode', read_only=True)
    feeName = serializers.CharField(source='feeCollection.feeType.feeName', read_only=True)
    month = serializers.SerializerMethodField(read_only=True)
    isRequired = serializers.BooleanField(source='feeCollection.feeType.isRequired', read_only=True)
    dueDate = serializers.DateField(source='feeCollection.dueDate')
    class Meta:
        model = ApartmentFee
        fields = ['apartmentFeeId', 'apartmentCode', 'feeName', 'month', 'amount', 'isRequired', 'dueDate', 'status', 'feeCollection'] 

    def get_month(self, obj):
        return f"{obj.feeCollection.month}/{obj.feeCollection.year}"
    
    def update(self, instance, validated_data):
        if 'feeCollection' in validated_data:
            fc_data = validated_data.pop('feeCollection')
            if 'dueDate' in fc_data:
                instance.feeCollection.dueDate = fc_data['dueDate']
                instance.feeCollection.save()
        return super().update(instance, validated_data)
    
class FeeTypeSerializer(serializers.ModelSerializer):
    applicableApartments = serializers.PrimaryKeyRelatedField(
        queryset=Apartment.objects.all(),
        many=True,
        required=False
    )
    class Meta:
        model = FeeType
        fields = ['typeId', 'feeName', 'typeDescription', 'isRequired', 'appliedScope', 'amountDefault', 'applicableApartments', 'status']

    def validate(self, attrs):
        if not attrs.get("feeName"):
            raise serializers.ValidationError({"feeName": "Tên khoản phí không được để trống!"})
        if not attrs.get("appliedScope"):
            raise serializers.ValidationError({"appliedScope": "Phạm vi áp dụng không được để trống!"})
        return attrs

    def create(self, validated_data):
        validated_data['status'] = 'active' 
        return super().create(validated_data)
    
class FeeCollectionSerializer(serializers.ModelSerializer):
    feeType = serializers.CharField(source='feeType.feeName')
    class Meta:
        model = FeeCollection
        fields = ['collectionId', 'month', 'year', 'createdDate', 'dueDate', 'status', 'feeType']

class CheckFeeNameSerializer(serializers.Serializer):
    feeName = serializers.CharField()

    def validate_feeName(self, value):
        try:
            feeType = FeeType.objects.get(feeName=value, status='active')
        except FeeType.DoesNotExist:
            raise serializers.ValidationError("FeeType not found")
        self.feeType = feeType 
        return value
    
class PaymentTransactionSerializer(serializers.ModelSerializer):
    feeName = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = PaymentTransaction
        fields = ['transactionId', 'apartmentFee', 'amount', 'paymentDate', 'status', 'feeName']
        extra_kwargs = {
            'status': {'read_only': True},
            'transactionId': {'read_only': True},
            'amount': {'read_only': True},
            'paymentDate': {'read_only': True},
        }

    def get_feeName(self, obj):
        apartment_code = obj.apartmentFee.apartment.apartmentCode
        fee_type_name = obj.apartmentFee.feeCollection.feeType.feeName
        month = obj.apartmentFee.feeCollection.month
        year = obj.apartmentFee.feeCollection.year
        return f"{apartment_code} {fee_type_name} {month}/{year}"

