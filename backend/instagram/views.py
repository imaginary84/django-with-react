from datetime import timedelta

from django.db.models import Q
from django.shortcuts import render
from django.utils import timezone
from rest_framework import permissions

# from rest_framework.settings
from rest_framework.viewsets import ModelViewSet
from .models import Post
from .serializers import PostSerializer


class PostViewSet(ModelViewSet):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    # permission_classes = [permissions.AllowAny]  # FIXME: 인증 적용

    def get_queryset(self):

        qs = super().get_queryset()
        user = self.request.user
        qs = qs.filter(Q(author=user) | Q(author__in=user.following_set.all()))
        # qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=3))
        return qs
