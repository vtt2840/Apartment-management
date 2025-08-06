from ..serializers.vehicleserializers import VehicleSerializer
from ..models import Vehicle
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from uuid import UUID
from rest_framework.decorators import action
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest

#vehicle view set
class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'vehicleId'

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
        #get vehicle list for apartment
        if apartment_code:
            queryset = Vehicle.objects.filter(apartment__apartmentCode=apartment_code, status='inuse')
            return queryset
        #find vehicle by vehicleId
        else: 
            vehicle_id = self.kwargs.get('vehicleId')
            queryset = Vehicle.objects.filter(vehicleId=vehicle_id)
            return queryset
        
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_201_CREATED)
        else:
            return Response({ "errors": serializer.errors }, status=status.HTTP_400_BAD_REQUEST)
        
    def update(self, request, *args, **kwargs):
        instance = self.get_object() 
        serializer = self.get_serializer(instance, data=request.data, partial=False) 
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response({ "errors": serializer.errors }, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'deleted' 
        instance.save()
        return Response(status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['get'], url_path='search')
    def search_vehicle(self, request):
        keyword = request.query_params.get('q', '')
        if not keyword:
            return Response([])

        queryset = Vehicle.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('licensePlate', keyword),
                TrigramSimilarity('brand', keyword),
                TrigramSimilarity('color', keyword)
            )
        ).filter(similarity__gt=0.5).order_by('-similarity')

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

