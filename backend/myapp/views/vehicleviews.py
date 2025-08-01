from rest_framework import generics
from ..serializers.vehicleserializers import VehicleSerializer
from ..models import Vehicle
from rest_framework.permissions import IsAuthenticated

class VehicleListAPIView(generics.ListAPIView):
    queryset = Vehicle.objects.all()
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated,]