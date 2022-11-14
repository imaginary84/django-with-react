from django.contrib.auth import get_user_model
from django.shortcuts import render
from rest_framework_simplejwt.views import TokenObtainPairView

from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    ListAPIView,
    get_object_or_404,
    RetrieveUpdateDestroyAPIView,
)
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.viewsets import ModelViewSet

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from django.contrib.auth import authenticate
from django.conf import settings
from django.middleware import csrf
from rest_framework_simplejwt.serializers import (
    TokenVerifySerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.views import TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as e:
            raise InvalidToken(e.args[0])

        data = serializer.validated_data

        response = Response()

        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=data["access"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )

        response.data = {
            "Success": "Refresh successfully",
            "refresh": data.get("refresh", ""),
        }

        csrf.get_token(request)

        response.status = status.HTTP_201_CREATED

        return response


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class LoginView(APIView):
    permission_classes = [
        permissions.AllowAny,
    ]

    def post(self, request, format=None):
        data = request.data
        response = Response()
        username = data.get("username", None)
        password = data.get("password", None)
        user = authenticate(username=username, password=password)
        if user is not None:
            if user.is_active:
                data = get_tokens_for_user(user)
                response.set_cookie(
                    key=settings.SIMPLE_JWT["AUTH_COOKIE"],
                    value=data["access"],
                    expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
                    secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
                    httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
                    samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
                )

                csrf.get_token(request)
                response.data = {
                    "Success": "Login successfully",
                    "refresh": data.get("refresh", ""),
                }

                return response
            else:
                return Response(
                    {"No active": "This account is not active!!"},
                    status=status.HTTP_404_NOT_FOUND,
                )
        else:
            return Response(
                {"Invalid": "Invalid username or password!!"},
                status=status.HTTP_404_NOT_FOUND,
            )


class RefreshView(APIView):
    def post(self, request, format=None):

        response = Response()

        user = request.user
        data = get_tokens_for_user(user)

        response.set_cookie(
            key=settings.SIMPLE_JWT["AUTH_COOKIE"],
            value=data["access"],
            expires=settings.SIMPLE_JWT["ACCESS_TOKEN_LIFETIME"],
            secure=settings.SIMPLE_JWT["AUTH_COOKIE_SECURE"],
            httponly=settings.SIMPLE_JWT["AUTH_COOKIE_HTTP_ONLY"],
            samesite=settings.SIMPLE_JWT["AUTH_COOKIE_SAMESITE"],
        )

        csrf.get_token(request)
        response.data = {
            "Success": "Refresh successfully",
            "refresh": data.get("refresh", ""),
        }

        return response


from .serializers import (
    SignupSerializer,
    ProfileSerializer,
    UserSerializer,
    MyTokenObtainPairSerializer,
)


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class SignupView(CreateAPIView):
    model = get_user_model()
    serializer_class = SignupSerializer
    permission_classes = [
        permissions.AllowAny,
    ]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class ProfileView(RetrieveUpdateDestroyAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = ProfileSerializer
    # permission_classes = [permissions.AllowAny]

    def get_object(self):
        if self.kwargs.get("username") == "my":
            # print("self.request.user.id ::", self.request.user.id)
            return get_user_model().objects.get(id=self.request.user.id)
        else:
            return get_user_model().objects.get(username=self.kwargs.get("username"))


class SuggestionListApiView(ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = ProfileSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.exclude(pk=self.request.user.pk)
        qs = qs.exclude(pk__in=self.request.user.following_set.all())
        return qs


@api_view(["POST"])
def user_follow(request):
    # print("In user_follow-1")
    # print(request.data)
    # print(request.data.get("following_user", ""))
    follow_user = get_object_or_404(
        get_user_model(),
        username=request.data.get("following_user", ""),
        is_active=True,
    )
    login_user = request.user
    # print("follow_user", follow_user)
    # print("login_user", login_user)

    login_user.following_set.add(follow_user)
    follow_user.follower_set.add(login_user)
    # print("In user_follow-2")
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["POST"])
def user_unfollow(request):
    follow_user = get_object_or_404(
        get_object_or_404,
        username=request.data.get("following_user", ""),
        is_active=True,
    )
    login_user = request.user

    login_user.following_set.remove(follow_user)
    follow_user.follower_set.remove(login_user)

    return Response(status.HTTP_204_NO_CONTENT)
