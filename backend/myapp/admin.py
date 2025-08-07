from django.contrib import admin
from .models import *

admin.site.register(Account)
admin.site.register(Role)
admin.site.register(Apartment)
admin.site.register(Resident)
admin.site.register(Member)
admin.site.register(TemporaryResidence)
admin.site.register(TemporaryAbsence)
admin.site.register(Vehicle)
admin.site.register(FeeType)
admin.site.register(FeeCollection)
admin.site.register(ApartmentFee)
admin.site.register(PaymentTransaction)