from ..serializers.vehicleserializers import VehicleSerializer
from ..models import Vehicle, FeeType
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import viewsets, status
from uuid import UUID
from rest_framework.decorators import action
from django.contrib.postgres.search import TrigramSimilarity
from django.db.models.functions import Greatest
from rest_framework.pagination import PageNumberPagination
import os
from dotenv import load_dotenv
load_dotenv() 

#custom page number pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size' 
    max_page_size = 1000


#vehicle viewset
class VehicleViewSet(viewsets.ModelViewSet):
    serializer_class = VehicleSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    lookup_field = 'vehicleId'

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status')
        apartment_code = self.request.query_params.get('apartmentCode')
        showDecreaseApartmentCode = self.request.query_params.get('showDecreaseApartmentCode')
        showType = self.request.query_params.get('showType')
        dateRegister = self.request.query_params.get('dateRegister')
        
        ADMIN_ID = UUID(os.getenv("ADMIN_ID"))

        #role == admin
        if user.id == ADMIN_ID or not apartment_code:
            queryset = Vehicle.objects.all()
            if status not in ['true', '1']:
                queryset = queryset.filter(status='inuse')
            if status in ['true', '1']:
                queryset = queryset.filter(status='deleted')
            if showDecreaseApartmentCode in ['true', '1']:
                queryset = queryset.order_by('-apartment__apartmentCode')
            if showType in ['car', 'bike', 'motorbike', 'other']:
                queryset = queryset.filter(vehicleType=showType)
            if dateRegister == 'increase':
                queryset = queryset.order_by('timeregister')
            if dateRegister == 'decrease':
                queryset = queryset.order_by('-timeregister')
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
        
    #create new vehicle
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        apartment_code = request.data.get('apartment')
        if serializer.is_valid():
            serializer.save()

            #add apartment to phi gui xe
            feeVehicle = FeeType.objects.filter(typeId='23')
            for fee in feeVehicle:
                fee.applicableApartments.add(apartment_code)
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
            return Response({"count": 0, "results": []})

        queryset = Vehicle.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('licensePlate', keyword),
                TrigramSimilarity('brand', keyword),
                TrigramSimilarity('color', keyword)
            )
        ).filter(similarity__gt=0.5).order_by('-similarity')

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

