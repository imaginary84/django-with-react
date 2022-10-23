from datetime import timedelta
from re import S

from django.db.models import Q
from django.shortcuts import render
from django.utils import timezone
from rest_framework import permissions

# from rest_framework.settings
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer

from rest_framework import status
from rest_framework.response import Response
from rest_framework.settings import api_settings


class PostViewSet(ModelViewSet):
    queryset = (
        Post.objects.all()
        .select_related("author")
        .prefetch_related("tag_set", "like_user_set")
    )
    serializer_class = PostSerializer
    # permission_classes = [permissions.AllowAny]  # FIXME: 인증 적용

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        qs = qs.filter(Q(author=user) | Q(author__in=user.following_set.all()))
        # qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=3))
        return qs

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
        return super().perform_create(serializer)

    def create(self, request, *args, **kwargs):
        print("request.data : ", request.data)
        print("request.FILES : ", request.FILES)
        print("request.POST : ", request.POST)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
        # return super().create(request, *args, **kwargs)
