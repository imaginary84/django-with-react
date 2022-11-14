from datetime import timedelta

# from re import S

from django.db.models import Q
from django.shortcuts import get_object_or_404, render
from django.utils import timezone
from django.contrib.auth import get_user_model
from requests import RequestException
from rest_framework import permissions


# from rest_framework.settings
from rest_framework.viewsets import ModelViewSet
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from .models import Post, Comment
from .serializers import CommentSerializer, PostSerializer


class PostPagination(PageNumberPagination):
    page_size = 3
    page_size_query_param = "page_size"


class PostViewSet(ModelViewSet):
    queryset = (
        Post.objects.all()
        .select_related("author")
        .prefetch_related("tag_set", "like_user_set")
    )
    serializer_class = PostSerializer
    pagination_class = PostPagination
    # permission_classes = [permissions.AllowAny]  # FIXME: 인증 적용

    def get_queryset(self):
        qs = super().get_queryset()
        user = self.request.user
        # print(self.request.GET)

        # 프로필인경우는 해당 유저의 포스팅만 조회
        if self.request.GET.get("profile") == "Y":
            if self.request.GET.get("username") == user.username:
                qs = qs.filter(author=user)
            else:
                qs = qs.filter(
                    author=get_user_model().objects.get(
                        username=self.request.GET.get("username")
                    )
                )
        # 프로필이 아니면 루트이며 로그인유저 내용과 팔로윙유저의 포스팅을 조회.
        else:
            qs = qs.filter(Q(author=user) | Q(author__in=user.following_set.all()))

        # qs = qs.filter(created_at__gte=timezone.now() - timedelta(days=3))
        return qs

    # drf 과거버전은 모르겠으나 현재는 자동으로 해줌.
    # def get_serializer_context(self):
    #     context = super().get_serializer_context()
    #     context["request"] = self.request
    #     return context

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


class CommentViewSet(ModelViewSet):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        post_pk = self.kwargs["post_pk"]
        # print("self.kwargs", self.kwargs)
        qs = super().get_queryset()
        qs = qs.filter(post__id=post_pk)
        return qs

    def perform_create(self, serializer):
        print("한재성 테스트1 :", self.kwargs["post_pk"])
        post = get_object_or_404(Post, pk=self.kwargs["post_pk"])
        serializer.save(author=self.request.user, post=post)

    def create(self, request, *args, **kwargs):
        print("한재성 테스트2 :", self.kwargs["post_pk"])
        print("한재성 테스트3 :", request.data)
        serializer = self.get_serializer(data=request.data)
        print("한재성 테스트4 :", request)

        print("한재성 테스트5 :", request.POST)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )
