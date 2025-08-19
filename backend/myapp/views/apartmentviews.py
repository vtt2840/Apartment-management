from ..serializers.apartmentserializers import ApartmentSerializer, AssignAccountToApartmentSerializer, UpdateApartmentSerializer
from ..models import Apartment
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.db.models.functions import Greatest
from django.contrib.postgres.search import TrigramSimilarity
from uuid import UUID
from rest_framework.pagination import PageNumberPagination
import os
from dotenv import load_dotenv
load_dotenv() 

#custom page number pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size' 
    max_page_size = 1000

#get apartment list
class ApartmentListAPIView(generics.ListAPIView):
    serializer_class = ApartmentSerializer
    permission_classes = [IsAuthenticated,]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        apartment_code = self.request.query_params.get('apartmentCode')
        floor = self.request.query_params.get('floor')
        status = self.request.query_params.get('status')
        query = self.request.query_params.get('query')
        
        ADMIN_ID = UUID(os.getenv("ADMIN_ID"))

        #role == admin
        if user.id == ADMIN_ID or not apartment_code:
            queryset = Apartment.objects.all()
            if floor in ["true", "1"]:
                queryset = queryset.order_by("-apartmentCode") 
            if status == 'sold':
                queryset = queryset.filter(status='active')
            if status == 'unsold':
                queryset = queryset.filter(status='inactive')
            if query not in ['null', None, '']:
                queryset = Apartment.objects.annotate(
                    similarity=Greatest(
                        TrigramSimilarity('apartmentCode', query),
                        TrigramSimilarity('account__username', query),
                        TrigramSimilarity('account__email', query),
                    )
                ).filter(similarity__gt=0.5).order_by('-similarity')
            return queryset
        else:
            queryset = Apartment.objects.filter(apartmentCode=apartment_code)
            return queryset
        
#add account exist in database to another apartment
class AddAccountExistToApartment(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = AssignAccountToApartmentSerializer(data=request.data)
        if serializer.is_valid():
            apartment = serializer.save()
            response_data = ApartmentSerializer(apartment).data
            return Response(response_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateApartment(APIView):
    permission_classes = [IsAuthenticated,]

    def put(self, request, apartmentCode):
        try:
            apartment = Apartment.objects.get(apartmentCode=apartmentCode)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateApartmentSerializer(instance=apartment, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            print(serializer.data)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    