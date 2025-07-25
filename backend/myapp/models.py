from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.models import UserManager as DjangoUserManager
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.core import validators
import uuid

class Apartment(models.Model):
    class Status(models.TextChoices):
        active = 'active'
        inactive = 'inactive'

    apartmentCode = models.CharField(max_length=10, unique=True, primary_key=True)
    floor = models.PositiveIntegerField()
    area = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=Status.choices)

    class Meta:
        ordering = ['apartmentCode']
    
    def __str__(self):
        return self.apartmentCode

class Role(models.Model):
    class Name(models.TextChoices):
        admin = 'admin'
        resident = 'resident'
    role_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=50, choices=Name.choices)
    description = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return self.name

def validate_email_address(email: str):
    try:
        validate_email(email)
    except ValidationError:
        raise ValidationError("Email không hợp lệ!")
    
class AccountManager(DjangoUserManager):
    def _create_user(self, username: str, email: str, password: str| None, **extra_fields):
        if not username:
            raise ValidationError("Tên đăng nhập không được để trống!")
        if not email:
            raise ValidationError("Email không được để trống!")
        email = self.normalize_email(email)
        validate_email_address(email)
        user = self.model(username=username, email=email, **extra_fields)
        if password:
            user.set_password(password)        
        user.save(using=self._db)
        return user
    
    def create_user(self, username: str, email: str | None = None, password: str | None = None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_superuser", False)
        return self._create_user(username, email, password, **extra_fields)

    def create_superuser(self, username: str, email: str | None = None, password: str | None = None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError("Superuser must have is_staff=True.")
        if extra_fields.get("is_superuser") is not True:
            raise ValueError("Superuser must have is_superuser=True.")
    
        role_id = extra_fields.get("role")
        if role_id is not None and isinstance(role_id, int):
            try:
                extra_fields["role"] = Role.objects.get(pk=role_id)
            except Role.DoesNotExist:
                raise ValueError(f"Role with id={role_id} does not exist.")

        return self._create_user(username, email, password, **extra_fields)
    
class Account(AbstractUser):
    pkid = models.BigAutoField(primary_key=True, editable=False)
    id = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    email = models.EmailField(
        verbose_name="Email address", unique=True, db_index=True
    )
    username = models.CharField(verbose_name="Username", max_length=60,)
    role = models.ForeignKey(Role, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, null=True, blank=True)
    EMAIL_FIELD = "email"
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "role"]

    objects = AccountManager()

    class Meta: 
        ordering = ["-date_joined"]
    
    def __str__(self) -> str:
        return self.email

    def clean(self):
        super().clean()
        if self.role.name == "resident" and not self.apartment:
            raise ValidationError("Tài khoản cư dân phải gắn với 1 căn hộ")
        if self.role.name == "admin" and self.apartment:
            raise ValidationError("Tài khoản admin không được gắn với căn hộ nào")
        
class Resident(models.Model):
    class Status(models.TextChoices):
        living = 'living'
        moved = 'moved'

    class Gender(models.TextChoices):
        male = 'male'
        female = 'female'

    residentId = models.AutoField(primary_key=True)
    fullName = models.CharField(max_length=100)
    dateOfBirth = models.DateField(null=True)
    phoneNumber = models.CharField(max_length=10, null=True)
    email = models.EmailField(unique=True)
    gender = models.CharField(max_length=6, choices=Gender.choices, null=True)
    idNumber = models.CharField(max_length=12, unique=True, null=True)
    status = models.CharField(max_length=6, choices=Status.choices)
    apartmentCode = models.ManyToManyField(Apartment, through='Member')

    def __str__(self):
        return f"{self.fullName} ({self.email})"

class Member(models.Model):
    memberId = models.AutoField(primary_key=True)
    resident = models.ForeignKey(Resident, on_delete=models.CASCADE)
    apartment = models.ForeignKey(Apartment, on_delete=models.CASCADE, related_name='member')
    isOwner = models.BooleanField(default=False)

    class Meta:
        unique_together = ('resident', 'apartment') 
        ordering = ["apartment"]

    def __str__(self):
        return f"{self.resident.fullName} ({self.resident.email}) - {self.apartment.apartmentCode}"
    

