from ..serializers.residentserializers import (ResidentSerializer, CreateResidentSerializer, RegisterTemporaryResidenceSerializer,
                                                RegisterTemporaryAbsenceSerializer, CancelRegisterTempSerializer, UpdateResidentSerializer,
                                                MemberSerializer)
from ..models import Resident, TemporaryResidence, TemporaryAbsence, Member
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.db.models.functions import Greatest
from django.contrib.postgres.search import TrigramSimilarity
from uuid import UUID
from rest_framework.pagination import PageNumberPagination

#custom page number pagination
class CustomPageNumberPagination(PageNumberPagination):
    page_size = 10 
    page_size_query_param = 'page_size' 
    max_page_size = 1000


# get resident list
       
class ResidentListAPIView(generics.ListAPIView):
    serializer_class = MemberSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = CustomPageNumberPagination

    def get_queryset(self):
        user = self.request.user
        status = self.request.query_params.get('status')
        gender = self.request.query_params.get('gender')
        apartment_code = self.request.query_params.get('apartmentCode')
        showDecreaseApartmentCode = self.request.query_params.get('showDecreaseApartmentCode')
        dateOfBirth = self.request.query_params.get('dateOfBirth')
        orderBirth = self.request.query_params.get('orderBirth')
        ADMIN_ID = UUID("f2de1633-8252-4f2e-9806-ecdf50f6c6d4")

        if user.id == ADMIN_ID:
            queryset = Member.objects.select_related('resident', 'apartment')

            if status == 'notleft':
                queryset = queryset.filter(isMember=True)
            elif status == 'living':
                queryset = queryset.filter(resident__status='living', isMember=True)
            elif status == 'temporaryresidence':
                queryset = queryset.filter(resident__status='temporaryresidence')
            elif status == 'temporaryabsence':
                queryset = queryset.filter(resident__status='temporaryabsence')
            elif status == 'left':
                queryset = queryset.filter(isMember=False)
            else:
                return queryset.none()

            if gender in ['male', 'female']:
                queryset = queryset.filter(resident__gender=gender)
            if showDecreaseApartmentCode in ['true', '1']:
                queryset = queryset.order_by('-apartment__apartmentCode')
            if orderBirth == 'increase':
                queryset = queryset.order_by('resident__dateOfBirth')
            elif orderBirth == 'decrease':
                queryset = queryset.order_by('-resident__dateOfBirth')
            elif dateOfBirth not in ['null']:
                queryset = queryset.filter(resident__dateOfBirth__year=dateOfBirth)
            return queryset

        # Resident (not admin)
        return Member.objects.filter(
            apartment__apartmentCode=apartment_code,
            isMember=True
        ).distinct()

# count number of residents
class ResidentCountView(generics.ListAPIView):
    serializer_class = ResidentSerializer
    permission_classes = [IsAuthenticated,]
    pagination_class = CustomPageNumberPagination
    
    def get_queryset(self):
        queryset = Resident.objects.exclude(status='left')
        return queryset

#create resident api view
class CreateResidentAPIView(generics.CreateAPIView):
    queryset = Resident.objects.all()
    serializer_class = CreateResidentSerializer
    permission_classes = [IsAuthenticated,]

#delete resident
class DeleteResident(APIView):
    permission_classes = [IsAuthenticated]
    def delete(self, request, residentId):
        try:
            resident = Resident.objects.get(residentId=residentId)
        except Resident.DoesNotExist:
            return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

        resident.status = 'left'
        resident.save()
        Member.objects.filter(resident=resident).update(isOwner=False, isMember=False)

        return Response({"message": "Resident marked as left"}, status=status.HTTP_200_OK)
    
#register temporary residence
class RegisterTemporaryResidence(generics.CreateAPIView):
    queryset = TemporaryResidence.objects.all()
    serializer_class = RegisterTemporaryResidenceSerializer
    permission_classes = [IsAuthenticated,]
    
#register temporary absence
class RegisterTemporaryAbsence(generics.CreateAPIView):
    queryset = TemporaryAbsence.objects.all()
    serializer_class = RegisterTemporaryAbsenceSerializer
    permission_classes = [IsAuthenticated,]
    
#cancel register temporary status
class CancelRegisterTemp(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        serializer = CancelRegisterTempSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
#update resident info
class UpdateResident(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request, residentId):
        try:
            resident = Resident.objects.get(residentId=residentId)
        except Resident.DoesNotExist:
            return Response({"error": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateResidentSerializer(instance=resident, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#search resident
class SearchResidentView(APIView):
    def get(self, request):
        keyword = request.query_params.get('q', '')
        if not keyword:
            return Response([])

        queryset = Resident.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('fullName', keyword),
                TrigramSimilarity('email', keyword),
                TrigramSimilarity('phoneNumber', keyword),
                TrigramSimilarity('hometown', keyword),
                TrigramSimilarity('idNumber', keyword),
            )
        ).filter(similarity__gt=0.4).order_by('-similarity')

        serializer = ResidentSerializer(queryset, many=True)
        return Response(serializer.data)
    
#get temporary residence detail
class TemporaryResidenceDetailView(APIView):
    def get(self, request, pk):
        try:
            absence = TemporaryResidence.objects.get(pk=pk)
            serializer = RegisterTemporaryResidenceSerializer(absence)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TemporaryResidence.DoesNotExist:
            return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)

class TemporaryAbsenceDetailView(APIView):
    def get(self, request, pk):
        try:
            absence = TemporaryAbsence.objects.get(pk=pk)
            serializer = RegisterTemporaryAbsenceSerializer(absence)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except TemporaryAbsence.DoesNotExist:
            return Response({"detail": "not found"}, status=status.HTTP_404_NOT_FOUND)