from ..serializers.vehicleserializers import VehicleSerializer
from ..models import Vehicle
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from uuid import UUID

#vehicle view set
class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        show_deleted = self.request.query_params.get('showDeletedVehicles')
        apartment_code = self.request.query_params.get('apartmentCode')
        ADMIN_ID = UUID("f2de1633-8252-4f2e-9806-ecdf50f6c6d4")

        #role == admin
        if user.id == ADMIN_ID:
            queryset = Vehicle.objects.all()
            if show_deleted not in ['true', '1']:
                queryset = queryset.filter(status='inuse')
            return queryset
        #role = resident
        else:
            queryset = Vehicle.objects.filter(apartment__apartmentCode=apartment_code, status='inuse')
            return queryset

    
