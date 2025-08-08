from rest_framework import viewsets
from rest_framework.response import Response
from django.db.models import Max
from ..models import ApartmentFee, FeeCollection
from ..serializers.feeserializers import ApartmentFeeSerializer
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import IsAuthenticated
from uuid import UUID
from django.db.models.functions import Cast
from django.db.models import IntegerField
import os
from dotenv import load_dotenv
load_dotenv()  

#custom page number pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size' 
    max_page_size = 1000


#vehicle view set
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
        if user.id == ADMIN_ID or not apartment_code:
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
            return queryset
        
        #role = resident
        else:
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
        