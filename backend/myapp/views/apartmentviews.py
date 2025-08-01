from ..serializers.apartmentserializers import ApartmentSerializer, AssignAccountToApartmentSerializer, UpdateApartmentSerializer
from ..models import Apartment
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import status
from django.db.models.functions import Greatest
from django.contrib.postgres.search import TrigramSimilarity

#get all apartments
class ApartmentListAPIView(generics.ListAPIView):
    queryset = Apartment.objects.all()
    serializer_class = ApartmentSerializer
    permission_classes = [IsAuthenticated,]

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

    def put(self, request):
        apartmentCode = request.data.get("apartmentCode")
        try:
            apartmentCode = Apartment.objects.get(apartmentCode=apartmentCode)
        except Apartment.DoesNotExist:
            return Response({"error": "Apartment not found"}, status=status.HTTP_404_NOT_FOUND)

        serializer = UpdateApartmentSerializer(instance=apartmentCode, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class SearchApartmentView(APIView):
    def get(self, request):
        keyword = request.query_params.get('q', '')
        if not keyword:
            return Response([])
        queryset = Apartment.objects.annotate(
            similarity=Greatest(
                TrigramSimilarity('apartmentCode', keyword),
                TrigramSimilarity('status', keyword),
                TrigramSimilarity('account__username', keyword),
                TrigramSimilarity('account__email', keyword),
            )
        ).filter(similarity__gt=0.2).order_by('-similarity')

        serializer = ApartmentSerializer(queryset, many=True)
        return Response(serializer.data)
    