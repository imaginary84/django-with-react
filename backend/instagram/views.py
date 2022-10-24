from datetime import timedelta
from re import S

from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from requests import RequestException
from rest_framework import permissions

# from rest_framework.settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from .models import Post
from .serializers import PostSerializer


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

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=["POST"])
    def like(self, request, pk):
        post = self.get_object()
        post.like_user_set.add(self.request.user)
        return Response(status=status.HTTP_201_CREATED)

    @like.mapping.delete
    def un_like(self, request, pk):
        post = self.get_object()
        post.like_user_set.remove(self.request.user)
        return Response(status=status.HTTP_204_NO_CONTENT)
