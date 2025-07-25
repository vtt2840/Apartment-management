from django.urls import path
from .views.accountviews import (CustomTokenObtainPairAPIView, CustomTokenRefreshAPIView, LogoutAPIView, CreateAccountAPIView, DeactivateAccount, AccountByApartment)
from .views.apartmentviews import ApartmentListAPIView

urlpatterns = [
    path('login/', CustomTokenObtainPairAPIView.as_view(), name='login'),
    path('logout/', LogoutAPIView.as_view(), name='logout'),
    path('refresh/', CustomTokenRefreshAPIView.as_view(), name="token-refresh"),

    path('apartments/', ApartmentListAPIView.as_view(), name='apartment-list'),
    path('addnewaccount/', CreateAccountAPIView.as_view(), name='add-new-account'),
    path('lockaccount/<int:user_id>/', DeactivateAccount.as_view(), name='lock-account'),
    path('accounts/by-apartment/', AccountByApartment.as_view(), name='account-by-apartment'),
]
