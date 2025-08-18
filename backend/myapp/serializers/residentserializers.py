from rest_framework import serializers
from ..models import Resident, Member, Apartment, TemporaryResidence, TemporaryAbsence
import re

class MemberSerializer(serializers.ModelSerializer):
    residentId = serializers.IntegerField(source='resident.residentId')
    fullName = serializers.CharField(source='resident.fullName')
    dateOfBirth = serializers.DateField(source='resident.dateOfBirth')
    status = serializers.CharField(source='resident.status')
    phoneNumber = serializers.CharField(source='resident.phoneNumber')
    email = serializers.EmailField(source='resident.email')
    gender = serializers.CharField(source='resident.gender')
    hometown = serializers.CharField(source='resident.hometown')
    idNumber = serializers.CharField(source='resident.idNumber')
    apartmentCode = serializers.CharField(source='apartment.apartmentCode')
    absence_id = serializers.SerializerMethodField()
    residence_id = serializers.SerializerMethodField()

    class Meta:
        model = Member
        fields = [
            "memberId",
            "residentId",
            "fullName",
            "dateOfBirth",
            "email",
            "phoneNumber",
            "gender",
            "hometown",
            "idNumber",
            "status",
            "apartmentCode",
            "isOwner",
            "isMember",
            "absence_id",
            "residence_id",
        ]

    def get_absence_id(self, obj):
        absence = obj.resident.temporaryabsence_set.order_by('-absenceId').first()
        return absence.pk if absence else None

    def get_residence_id(self, obj):
        residence = obj.resident.temporaryresidence_set.order_by('-residenceId').first()
        return residence.pk if residence else None


class ResidentSerializer(serializers.ModelSerializer):
    apartment = MemberSerializer(source="member_set", many=True)
    class Meta:
        model = Resident
        fields = [
            "residentId",
            "fullName",
            "dateOfBirth",
            "email",
            "phoneNumber",
            "gender",
            "hometown",
            "idNumber",
            "status",
            "apartment",
        ]

class CreateResidentSerializer(serializers.ModelSerializer):
    apartment_code = serializers.CharField(write_only=True)

    class Meta:
        model = Resident
        fields = ("residentId", "email", "fullName", "dateOfBirth", "gender", "hometown", "phoneNumber", "idNumber", "apartment_code")

    def validate_fullName(self, value):
        if not value:
            raise serializers.ValidationError("Họ tên không được để trống.")
        return value

    def validate_email(self, value):
        if value:
            regex = r"\S+@\S+\.\S+"
            if not re.match(regex, value):
                raise serializers.ValidationError("Email không đúng định dạng.")
        return value

    def validate_dateOfBirth(self, value):
        if not value:
            raise serializers.ValidationError("Ngày sinh không được để trống.")
        return value

    def validate_gender(self, value):
        if not value:
            raise serializers.ValidationError("Giới tính không được để trống.")
        return value

    def validate_hometown(self, value):
        if not value:
            raise serializers.ValidationError("Quê quán không được để trống.")
        return value

    def validate_phoneNumber(self, value):
        if value: 
            if not re.match(r"^\d{10}$", value):
                raise serializers.ValidationError("Số điện thoại phải có 10 chữ số.")
        return value

    def validate_idNumber(self, value):
        if value: 
            if not re.match(r"^\d{12}$", value):
                raise serializers.ValidationError("Số căn cước công dân phải có 12 chữ số.")
        return value

    def validate(self, data):
        apartment_code = data.get("apartment_code")
        if not apartment_code:
            raise serializers.ValidationError({"apartment_code": "Thiếu mã căn hộ."})
        try:
            Apartment.objects.get(apartmentCode=apartment_code)
        except Apartment.DoesNotExist:
            raise serializers.ValidationError({"apartment_code": "Mã căn hộ không tồn tại."})
        return data

    def create(self, validated_data):
        apartment_code = validated_data.pop("apartment_code")
        apartment = Apartment.objects.get(apartmentCode=apartment_code)
        #create new resident
        resident = Resident.objects.create(
            fullName=validated_data["fullName"],
            email=validated_data.get("email", None),
            dateOfBirth=validated_data["dateOfBirth"],
            gender=validated_data["gender"],
            hometown=validated_data["hometown"],
            phoneNumber=validated_data.get("phoneNumber", None),
            idNumber=validated_data.get("idNumber", None),
            status="living"
        )
        #create new member
        Member.objects.create(
            resident=resident,
            apartment=apartment,
            isOwner=False,
            isMember=True
        )

        return resident

class RegisterTemporaryResidenceSerializer(serializers.ModelSerializer):
    resident_id = serializers.IntegerField()

    class Meta:
        model = TemporaryResidence
        fields = ("resident_id", "startDate", "endDate", "reason")
        read_only_fields = ("residenceId",)
    
    def validate_resident_id(self, value):
        try:
            resident = Resident.objects.get(residentId=value)
        except Resident.DoesNotExist:
            raise serializers.ValidationError("Cư dân không tồn tại.")
        return value

    def validate_startDate(self, value):
        if not value:
            raise serializers.ValidationError("Ngày bắt đầu không được để trống!")
        return value
    
    def validate_endDate(self, value):
        if not value:
            raise serializers.ValidationError("Ngày kết thúc không được để trống!")
        return value
    
    def validate_reason(self, value):
        if not value:
            raise serializers.ValidationError("Lý do không được để trống!")
        return value
    
    def validate(self, data):
        start = data.get("startDate")
        end = data.get("endDate")
        if start and end and end < start:
            raise serializers.ValidationError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.")
        return data

    def create(self, validated_data):
        resident_id = validated_data.pop("resident_id")
        resident = Resident.objects.get(residentId=resident_id)
        #create new temporaryresidence
        temporaryResidence = TemporaryResidence.objects.create(
            resident=resident,
            startDate=validated_data["startDate"],
            endDate=validated_data["endDate"],
            reason=validated_data["reason"]
        )
        #update status of resident
        resident.status = 'temporaryresidence'
        resident.save()
        return temporaryResidence
    

class RegisterTemporaryAbsenceSerializer(serializers.ModelSerializer):
    resident_id = serializers.IntegerField()

    class Meta:
        model = TemporaryAbsence
        fields = ("resident_id", "startDate", "endDate", "reason", "destination")
        read_only_fields = ("absenceId",)

    def validate_resident_id(self, value):
        try:
            resident = Resident.objects.get(residentId=value)
        except Resident.DoesNotExist:
            raise serializers.ValidationError("Cư dân không tồn tại.")
        return value

    def validate_startDate(self, value):
        if not value:
            raise serializers.ValidationError("Ngày bắt đầu không được để trống!")
        return value
    
    def validate_endDate(self, value):
        if not value:
            raise serializers.ValidationError("Ngày kết thúc không được để trống!")
        return value
    
    def validate_reason(self, value):
        if not value:
            raise serializers.ValidationError("Lý do không được để trống!")
        return value
    
    def validate_destination(self, value):
        if not value:
            raise serializers.ValidationError("Địa điểm di chuyển không được để trống!")
        return value
    
    def validate(self, data):
        start = data.get("startDate")
        end = data.get("endDate")
        if start and end and end < start:
            raise serializers.ValidationError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu.")
        return data
    
    def create(self, validated_data):
        resident_id = validated_data.pop("resident_id")
        resident = Resident.objects.get(residentId=resident_id)
        #create new temporaryresidence
        temporaryAbsence = TemporaryAbsence.objects.create(
            resident=resident,
            startDate=validated_data["startDate"],
            endDate=validated_data["endDate"],
            reason=validated_data["reason"],
            destination=validated_data["destination"]
        )
        #update status of resident
        resident.status = 'temporaryabsence'
        resident.save()
        return temporaryAbsence
    
class CancelRegisterTempSerializer(serializers.Serializer):
    resident_id = serializers.IntegerField()

    def validate_resident_id(self, value):
        try:
            self.resident = Resident.objects.get(pk=value)
        except Resident.DoesNotExist:
            raise serializers.ValidationError("Resident does not exist")
        return value
    
    def save(self, **kwargs):
        resident = self.resident
        resident.status = 'living' #update status = living
        resident.save()
        return resident
    
class UpdateResidentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resident
        fields = ("residentId", "fullName", "email", "dateOfBirth", "gender", "hometown", "phoneNumber", "idNumber")
        read_only_fields = ("residentId",) 

    def validate_fullName(self, value):
        if not value:
            raise serializers.ValidationError("Họ tên không được để trống.")
        return value

    def validate_email(self, value):
        if value:
            regex = r"\S+@\S+\.\S+"
            if not re.match(regex, value):
                raise serializers.ValidationError("Email không đúng định dạng.")
        return value

    def validate_dateOfBirth(self, value):
        if not value:
            raise serializers.ValidationError("Ngày sinh không được để trống.")
        return value

    def validate_gender(self, value):
        if not value:
            raise serializers.ValidationError("Giới tính không được để trống.")
        return value

    def validate_hometown(self, value):
        if not value:
            raise serializers.ValidationError("Quê quán không được để trống.")
        return value

    def validate_phoneNumber(self, value):
        if value: 
            if not re.match(r"^\d{10}$", value):
                raise serializers.ValidationError("Số điện thoại phải có 10 chữ số.")
        return value

    def validate_idNumber(self, value):
        if value: 
            if not re.match(r"^\d{12}$", value):
                raise serializers.ValidationError("Số căn cước công dân phải có 12 chữ số.")
        return value

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance