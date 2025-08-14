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
from rest_framework.decorators import action
from datetime import date
from django.db.models import Q
import os
from dotenv import load_dotenv
load_dotenv()  
import pandas as pd
from django.http import HttpResponse
from io import BytesIO
import json
from django.views.decorators.csrf import csrf_exempt


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
        feeName = self.request.query_params.get('feeName')

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

        if user.id == ADMIN_ID:
            queryset = ApartmentFee.objects.all()
        elif apartment_code:
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
        
        if user.id == ADMIN_ID:          
            if isRequired in ['True', 'False']:
                queryset = queryset.filter(feeCollection__feeType__isRequired=isRequired)
            if status in ['paid', 'unpaid']:
                queryset = queryset.filter(status=status)
            if dueDate == 'increase':
                queryset = queryset.order_by('feeCollection__dueDate')
            if dueDate == 'decrease':
                queryset = queryset.order_by('-feeCollection__dueDate')
            if feeName not in ['null']:
                queryset = queryset.filter(feeCollection__feeType__feeName__iexact=feeName)

            apartmentFeeId = self.kwargs.get('apartmentFeeId')
            if apartmentFeeId:
                queryset = ApartmentFee.objects.filter(apartmentFeeId=apartmentFeeId)
        return queryset

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        else: return Response({ "errors": serializer.errors }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'], url_path='search')
    def search_fee(self, request):
        keyword = request.query_params.get('q', '')
        if not keyword:
            return Response({"count": 0, "results": []})

        keywords = keyword.split()

        queryset = ApartmentFee.objects.all()
        for kw in keywords:
            queryset = queryset.filter(
                Q(apartment__apartmentCode__icontains=kw) |
                Q(feeCollection__feeType__feeName__icontains=kw)
            )

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

#feetype viewset
class FeeTypeViewSet(viewsets.ModelViewSet):
    serializer_class = FeeTypeSerializer
    permission_classes = [IsAuthenticated,]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        month = self.request.query_params.get('month')
        year = self.request.query_params.get('year')
        statistic = self.request.query_params.get('statistic')
        ADMIN_ID = UUID(os.getenv("ADMIN_ID"))

        if user.id == ADMIN_ID:
            queryset = FeeType.objects.filter(status='active')
            if year and month:
                fee_collection = FeeCollection.objects.filter(month=month, year=year)
                listFeeCollectionExist = fee_collection.values_list('feeType__typeId', flat=True)
                if statistic in ['true', 'True']:
                    queryset=queryset.filter(typeId__in=listFeeCollectionExist)
                    return queryset
                queryset = queryset.exclude(typeId__in=listFeeCollectionExist)
            return queryset

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
        if scope == FeeType.Scope.all:
            apartments = Apartment.objects.filter(status='active')
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
        
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = 'inactive'
        instance.save()
        return Response(status=status.HTTP_200_OK)
        
#Check feeName exist
class CheckFeeNameExist(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        serializer = CheckFeeNameSerializer(data=request.data)
        if serializer.is_valid():
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_404_NOT_FOUND)

class CreateFeeCollection(APIView):
    permission_classes = [IsAuthenticated,]

    def post(self, request):
        month = request.data.get('month')
        year = request.data.get('year')
        feeCollection = request.data.get('feeCollection', [])

        try: 
            for fee in feeCollection:
                feeTypeId = fee.get('typeId')
                dueDate = fee.get('dueDate')
                apartments = fee.get('apartments', [])
                if not feeTypeId or not dueDate or not apartments:
                    return Response(status=status.HTTP_400_BAD_REQUEST)
                
                feeType = FeeType.objects.get(typeId=feeTypeId)

                #create new fee collection
                fee_collection = FeeCollection.objects.create(
                    month=month,
                    year=year,
                    createdDate=date.today(),
                    dueDate=dueDate,
                    feeType=feeType
                )
                #create apartmentfee
                apartment_fees = [
                    ApartmentFee(
                        amount=a['amount'],
                        apartment_id=a['apartmentCode'],
                        feeCollection=fee_collection
                    )
                    for a in apartments
                ]
                ApartmentFee.objects.bulk_create(apartment_fees)
            return Response(status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

@csrf_exempt
def export_data_to_excel(request):
    if request.method == "POST":
        body_unicode = request.body.decode('utf-8')
        body_data = json.loads(body_unicode)

        allowed_fields = ["amount", "apartmentCode", "dueDate", "feeName", "isRequired", "month", "status"]
        filtered_data = []
        for item in body_data:
            row = {}
            for field in allowed_fields:
                row[field] = item.get(field)
            filtered_data.append(row)

        translated_data = []
        for item in filtered_data:
            translated_data.append({
                "Mã căn hộ": item.get("apartmentCode"),
                "Tên khoản phí": item.get("feeName"),
                "Tháng/Năm": item.get("month"),
                "Số tiền": item.get("amount"),
                "Bắt buộc": "Có" if item.get("isRequired") else "Không",                
                "Hạn nộp": item.get("dueDate"),
                "Trạng thái": "Chưa thanh toán" if item.get("status") == "unpaid" else "Đã thanh toán"
            })
            print(translated_data)

        df = pd.DataFrame(translated_data)
        df.insert(0, 'STT', range(1, len(df) + 1))

        buffer = BytesIO()
        df.to_excel(buffer, index=False)
        buffer.seek(0)

        response = HttpResponse(
            buffer,
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )
        response['Content-Disposition'] = 'attachment; filename="export.xlsx"'
        return response
    
    