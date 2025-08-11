from rest_framework import viewsets, status
from rest_framework.response import Response
from ..models import ApartmentFee, FeeCollection, FeeType, Apartment
from ..serializers.feeserializers import ApartmentFeeSerializer, FeeTypeSerializer, CheckFeeNameSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from uuid import UUID
from django.db.models.functions import Cast
from rest_framework.views import APIView
from django.db.models import IntegerField
import os
from dotenv import load_dotenv
load_dotenv()  

#custom page number pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size' 
    max_page_size = 1000


#apartmentfee viewset
class ApartmentFeeViewSet(viewsets.ModelViewSet):
    serializer_class = ApartmentFeeSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination
    lookup_field = 'apartmentFeeId'

    def get_queryset(self):
        user = self.request.user
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        apartment_code = self.request.query_params.get('apartment_code')
        isRequired = self.request.query_params.get('isRequired')
        status = self.request.query_params.get('status')
        dueDate =self.request.query_params.get('dueDate')

        ADMIN_ID = UUID(os.getenv("ADMIN_ID"))

        #get latest feeCollection date
        latest = (
            FeeCollection.objects
            .annotate(
                year_int=Cast('year', IntegerField()),
                month_int=Cast('month', IntegerField())
            )
            .order_by('-year_int', '-month_int')
            .first()
        )
        latest_month = latest.month
        latest_year = latest.year

        #role == admin
        if user.id == ADMIN_ID:
            queryset = ApartmentFee.objects.all()
            if month != 'latest' and year != 'latest':
                queryset = queryset.filter(feeCollection__month=month, feeCollection__year=year)
            elif month != 'latest':
                queryset = queryset.filter(feeCollection__month=month)
            elif year != 'latest':
                queryset = queryset.filter(feeCollection__year=year)
            elif month == 'latest' and year == 'latest':
                queryset = queryset.filter(feeCollection__month=latest_month)
                queryset = queryset.filter(feeCollection__year=latest_year)
            else:
                return queryset.none()
            
            if isRequired in ['True', 'False']:
                queryset = queryset.filter(feeCollection__feeType__isRequired=isRequired)
            if status in ['paid', 'unpaid']:
                queryset = queryset.filter(status=status)
            if dueDate == 'increase':
                queryset = queryset.order_by('feeCollection__dueDate')
            if dueDate == 'decrease':
                queryset = queryset.order_by('-feeCollection__dueDate')

            apartmentFeeId = self.kwargs.get('apartmentFeeId')
            if apartmentFeeId:
                queryset = ApartmentFee.objects.filter(apartmentFeeId=apartmentFeeId)
            return queryset
        
        #role == resident
        if apartment_code:
            queryset = ApartmentFee.objects.filter(apartment__apartmentCode=apartment_code)
            if month != 'latest' and year != 'latest':
                queryset = queryset.filter(feeCollection__month=month, feeCollection__year=year)
            elif month != 'latest':
                queryset = queryset.filter(feeCollection__month=month)
            elif year != 'latest':
                queryset = queryset.filter(feeCollection__year=year)
            elif month == 'latest' and year == 'latest':
                queryset = queryset.filter(feeCollection__month=latest_month)
                queryset = queryset.filter(feeCollection__year=latest_year)
            else:
                return queryset.none()
            return queryset
        
    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else: return Response({ "errors": serializer.errors }, status=status.HTTP_400_BAD_REQUEST)

#feetype viewset
class FeeTypeViewSet(viewsets.ModelViewSet):
    queryset = FeeType.objects.all()
    serializer_class = FeeTypeSerializer
    permission_classes = [IsAuthenticated,]
    pagination_class = CustomPageNumberPagination


    def create(self, request, *args, **kwargs):
        scope = request.data.get('appliedScope')
        applicableApartments = request.data.get('applicableApartments', [])

        instance = FeeType.objects.create(
            feeName=request.data.get('feeName'),
            typeDescription=request.data.get('typeDescription', ''),
            isRequired=request.data.get('isRequired'),
            amountDefault=request.data.get('amountDefault'),
            appliedScope=scope
        )
        if scope == FeeType.Scope.some:
            apartments = Apartment.objects.filter(apartmentCode__in=applicableApartments)
            instance.applicableApartments.set(apartments)

        serializer = self.get_serializer(instance)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=False)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else:
            print(serializer.errors)
            return Response({ "errors": serializer.errors }, status=status.HTTP_400_BAD_REQUEST)
        
#Check feeName exist
class CheckFeeNameExist(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        serializer = CheckFeeNameSerializer(data=request.data)
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)


        