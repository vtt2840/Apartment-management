from ..serializers.residentserializers import ResidentSerializer
from ..models import Resident
from rest_framework import generics
from rest_framework.request import Request
from rest_framework.response import Response

#get all residents
class ResidentListAPIView(generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer

