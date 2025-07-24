from rest_framework import serializers
from ..models import Apartment, Member

class ApartmentSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()

    class Meta:
        model = Apartment
        fields = ['apartmentCode', 'floor', 'area', 'status', 'owner']

    def get_owner(self, obj):
        member = Member.objects.filter(apartment=obj, isOwner=True).select_related('resident').first()
        if member and member.resident:
            return {
                'fullName': member.resident.fullName,
                'email': member.resident.email
            }
        return None
