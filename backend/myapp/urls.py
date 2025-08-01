from django.urls import path
from .views.accountviews import (CustomTokenObtainPairAPIView, CustomTokenRefreshAPIView, LogoutAPIView, CreateAccountAPIView, 
                                 DeactivateAccount, AccountByApartment, PasswordResetConfirm, ResetPassword, CheckAccount)
from .views.apartmentviews import ApartmentListAPIView, AddAccountExistToApartment, UpdateApartment, SearchApartmentView
from .views.residentviews import (ResidentListAPIView, CreateResidentAPIView, DeleteResident, RegisterTemporaryResidence, RegisterTemporaryAbsence, 
                                  CancelRegisterTemp, UpdateResident, SearchResidentView, TemporaryAbsenceDetailView, TemporaryResidenceDetailView)

urlpatterns = [
    path('login/', CustomTokenObtainPairAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('refresh/', CustomTokenRefreshAPIView.as_view(), name="token-refresh"),

    path('apartments/', ApartmentListAPIView.as_view(), name='apartment-list'),
    path('addaccountapartment/', AddAccountExistToApartment.as_view(), name='add-account-exist-to-apartment'),
    path('updateapartment/', UpdateApartment.as_view(), name='update-apartment'),
    path('search-apartments/', SearchApartmentView.as_view(), name='search-apartments'),

    path('addnewaccount/', CreateAccountAPIView.as_view(), name='add-new-account'),
    path('lockaccount/', DeactivateAccount.as_view(), name='lock-account'),
    path('accounts/by-apartment/', AccountByApartment.as_view(), name='account-by-apartment'),
    path('account/checkaccountexists/', CheckAccount.as_view(), name='check-account-exists'),
    path('resetpassword/', ResetPassword.as_view(), name='reset-password'),
    path('password-reset-confirm/', PasswordResetConfirm.as_view(), name='password-reset-confirm'),

    path('residents/', ResidentListAPIView.as_view(), name='resident-list'),
    path('addnewresident/', CreateResidentAPIView.as_view(), name='add-new-resident'),
    path('deleteresident/', DeleteResident.as_view(), name='delete-resident'),
    path('updateresident/', UpdateResident.as_view(), name='update-resident'),
    path('search-residents/', SearchResidentView.as_view(), name='search-residents'),


    path('registertempresidence/', RegisterTemporaryResidence.as_view(), name='register-temp-residence'),
    path('registertempabsence/', RegisterTemporaryAbsence.as_view(), name='register-temp-absence'),
    path('canceltempstatus/', CancelRegisterTemp.as_view(), name='cancel-temp-status'),
    path('temporary-absence/<int:pk>/', TemporaryAbsenceDetailView.as_view(), name='temporary-absence-detail'),
    path('temporary-residence/<int:pk>/', TemporaryResidenceDetailView.as_view(), name='temporary-residence-detail'),
]



