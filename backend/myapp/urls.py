from django.urls import path
from .views.accountviews import (CustomTokenObtainPairAPIView, CustomTokenRefreshAPIView, LogoutAPIView, CreateAccountAPIView, UpdateAccountAdmin,
                                 DeactivateAccount, AccountByApartment, PasswordResetConfirm, ResetPassword, CheckAccount, ChangePasswordView)
from .views.apartmentviews import ApartmentListAPIView, AddAccountExistToApartment, UpdateApartment, SearchApartmentView
from .views.residentviews import (ResidentListAPIView, CreateResidentAPIView, DeleteResident, RegisterTemporaryResidence, RegisterTemporaryAbsence, 
                                  CancelRegisterTemp, UpdateResident, SearchResidentView, TemporaryAbsenceDetailView, TemporaryResidenceDetailView,
                                  ResidentCountView)
from .views.feeviews import (ApartmentFeeViewSet)
from .views.vehicleviews import (VehicleViewSet)
from rest_framework.routers import SimpleRouter


router = SimpleRouter()
router.register(r'vehicles', VehicleViewSet, basename='vehicle')
router.register(r'fee', ApartmentFeeViewSet, basename='fee')



urlpatterns = [
    path('login/', CustomTokenObtainPairAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('refresh/', CustomTokenRefreshAPIView.as_view(), name="token-refresh"),

    path('apartments/', ApartmentListAPIView.as_view(), name='apartment-list'),
    path('apartments/addaccount/', AddAccountExistToApartment.as_view(), name='add-account-exist-to-apartment'),
    path('apartments/updateinfo/<int:apartmentCode>/', UpdateApartment.as_view(), name='update-apartment'),
    path('apartments/search/', SearchApartmentView.as_view(), name='search-apartments'),

    path('apartments/addnewaccount/', CreateAccountAPIView.as_view(), name='add-new-account'),
    path('apartments/lockaccount/', DeactivateAccount.as_view(), name='lock-account'),
    path('accounts/accounts-by-apartment/', AccountByApartment.as_view(), name='account-by-apartment'),
    path('accounts/check-account-exists/', CheckAccount.as_view(), name='check-account-exists'),
    path('accounts/resetpassword/', ResetPassword.as_view(), name='reset-password'),
    path('accounts/password-reset-confirm/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('update-account-admin/', UpdateAccountAdmin.as_view(), name='update-account-admin'),

    path('residents/', ResidentListAPIView.as_view(), name='resident-list'),
    path('residents/count/', ResidentCountView.as_view(), name='count-resident'),
    path('residents/addnewresident/', CreateResidentAPIView.as_view(), name='add-new-resident'),
    path('residents/delete/<int:residentId>/', DeleteResident.as_view(), name='delete-resident'),
    path('residents/update/<int:residentId>/', UpdateResident.as_view(), name='update-resident'),
    path('residents/search/', SearchResidentView.as_view(), name='search-residents'),


    path('temporary-residence/register/', RegisterTemporaryResidence.as_view(), name='register-temp-residence'),
    path('temporary-absence/register/', RegisterTemporaryAbsence.as_view(), name='register-temp-absence'),
    path('canceltempstatus/', CancelRegisterTemp.as_view(), name='cancel-temp-status'),
    path('temporary-absence/<int:pk>/', TemporaryAbsenceDetailView.as_view(), name='temporary-absence-detail'),
    path('temporary-residence/<int:pk>/', TemporaryResidenceDetailView.as_view(), name='temporary-residence-detail'),

] + router.urls



