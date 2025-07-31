from ..serializers.residentserializers import (ResidentSerializer, CreateResidentSerializer, DeleteResidentSerializer, RegisterTemporaryResidenceSerializer,
                                                RegisterTemporaryAbsenceSerializer, CancelRegisterTempSerializer, UpdateResidentSerializer)
from ..models import Resident, TemporaryResidence, TemporaryAbsence
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.db.models.functions import Greatest
from django.contrib.postgres.search import TrigramSimilarity

#get all residents
class ResidentListAPIView(generics.ListAPIView):
    queryset = Resident.objects.all()
    serializer_class = ResidentSerializer
    permission_classes = [IsAuthenticated,]


#create resident api view
class CreateResidentAPIView(generics.CreateAPIView):
    queryset = Resident.objects.all()
    serializer_class = CreateResidentSerializer
    permission_classes = [IsAuthenticated,]


class DeleteResident(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        serializer = DeleteResidentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'status': 'success', 'message': 'Resident deleted'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class RegisterTemporaryResidence(generics.CreateAPIView):
    queryset = TemporaryResidence.objects.all()
    serializer_class = RegisterTemporaryResidenceSerializer
    permission_classes = [IsAuthenticated,]
    
class RegisterTemporaryAbsence(generics.CreateAPIView):
    queryset = TemporaryAbsence.objects.all()
    serializer_class = RegisterTemporaryAbsenceSerializer
    permission_classes = [IsAuthenticated,]
    
class CancelRegisterTemp(APIView):
    permission_classes = [IsAuthenticated,]
    def post(self, request):
        serializer = CancelRegisterTempSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UpdateResident(APIView):
    permission_classes = [IsAuthenticated,]

    def put(self, request):
        residentId = request.data.get("residentId")
        try:
            resident = Resident.objects.get(residentId=residentId)
        except Resident.DoesNotExist:
            return Response({"error": "Resident not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateResidentSerializer(instance=resident, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

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
        ).filter(similarity__gt=0.1).order_by('-similarity')

        serializer = ResidentSerializer(queryset, many=True)
        return Response(serializer.data)