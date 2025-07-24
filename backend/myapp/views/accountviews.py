from django.shortcuts import render
from ..serializers.accountserializers import CustomTokenObtainPairSerializer, CreateAccountSerializer
from rest_framework.response import Response
from rest_framework import status, generics
import logging
from typing import Dict, Optional
from django.conf import settings
from rest_framework.request import Request
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from ..models import Account
from rest_framework.permissions import IsAuthenticated, AllowAny


logger = logging.getLogger(__name__)

#set the authentication cookies
def set_auth_cookies(res: Response, access_token: str, refresh_token: Optional[str] = None):
    access_token_lifetime = settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"].total_seconds()
    cookie_settings = {
        "path": settings.COOKIE_PATH,
        "secure": settings.COOKIE_SECURE,
        "httponly": settings.COOKIE_HTTPONLY,
        "samesite": settings.COOKIE_SAMESITE,
        "max_age": access_token_lifetime,
    }
    res.set_cookie("access", access_token, **cookie_settings)
    
    if refresh_token:
        refresh_token_lifetime = settings.SIMPLE_JWT["REFRESH_TOKEN_LIFETIME"].total_seconds()
        refresh_cookie_settings = cookie_settings.copy()
        refresh_cookie_settings["max_age"] = refresh_token_lifetime
        res.set_cookie("refresh", refresh_token, **refresh_cookie_settings)

    logged_in_cookie_settings = cookie_settings.copy()
    logged_in_cookie_settings["httponly"] = False

    #set the logged in cookie
    res.set_cookie("logged_in", "true", **logged_in_cookie_settings)


#custom token obtain pair api view 
class CustomTokenObtainPairAPIView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer
    
    def post(self, request: Request, *args: Dict, **kwargs: Dict):
        res = super().post(request, *args, **kwargs)

        if res.status_code == status.HTTP_200_OK:
            access_token = res.data.get("access")
            refresh_token = res.data.get("refresh")

            if access_token and refresh_token:
                set_auth_cookies(res, access_token, refresh_token)
                res.data.pop("access")
                res.data.pop("refresh")
                res.data["message"] = "Login successfully"
            else:
                res.data["message"] = "Login falied"
                logger.error("Access or refresh token not provided in response data")
        return res
    

#custom token refresh api view
class CustomTokenRefreshAPIView(TokenRefreshView):
    def post(self, request: Request, *args: Dict, **kwargs: Dict):
        #get refresh token from cookies
        refresh_token = request.COOKIES.get("refresh")

        if refresh_token:
            request.data["refresh"] = refresh_token

        res = super().post(request, *args, **kwargs)

        if res.status_code == status.HTTP_200_OK:
            access_token = res.data.get("access")
            refresh_token = res.data.get("refresh")
            if access_token and refresh_token:
                set_auth_cookies(res, access_token, refresh_token)
                res.data.pop("access")
                res.data.pop("refresh")
                res.data["message"] = "Access token refreshed successfully"
            else:
                res.data["message"] = ("Access or refresh token not provided in response data")
                logger.error("Access or refresh token not provided in response data")
        return res

#logout api view
class LogoutAPIView(APIView):
    def post(self, request: Request, *args: Dict, **kwargs: Dict):
        #create a response object
        res = Response(status=status.HTTP_204_NO_CONTENT)

        #delete authentication cookies
        res.delete_cookie("access")
        res.delete_cookie("refresh")
        res.delete_cookie("logged_in")
        return res
    
#create account api view
class CreateAccountAPIView(generics.CreateAPIView):
    queryset = Account.objects.all()
    serializer_class = CreateAccountSerializer
    permission_classes = (AllowAny,)

