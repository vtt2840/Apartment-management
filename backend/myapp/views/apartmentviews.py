from ..serializers.apartmentserializers import ApartmentSerializer
from ..models import Apartment
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.response import Response

#get all apartments
class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer