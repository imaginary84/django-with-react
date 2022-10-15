from django.contrib.auth import get_user_model
from django.shortcuts import render

from rest_framework.generics import CreateAPIView
from rest_framework import permissions

from .serializers import SignupSerializer


class SignupView(CreateAPIView):
    model = get_user_model()
    serializer_class = SignupSerializer
    permission_classes = [
        permissions.AllowAny,
    ]
    pass
