from re import L
from django.shortcuts import render

from rest_framework import permissions

# from rest_framework.settings
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.AllowAny]  # FIXME: 인증 적용
