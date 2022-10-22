from django.contrib.auth import get_user_model
from django.shortcuts import render

# from requests import Response

from rest_framework.generics import CreateAPIView, ListAPIView, get_object_or_404
from rest_framework import permissions, status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .serializers import SignupSerializer, SuggestionUserSerializer


class SignupView(CreateAPIView):
    model = get_user_model()
    serializer_class = SignupSerializer
    permission_classes = [
        permissions.AllowAny,
    ]


class SuggestionListApiView(ListAPIView):
    queryset = get_user_model().objects.all()
    serializer_class = SuggestionUserSerializer

    def get_queryset(self):
        qs = super().get_queryset()
        qs = qs.exclude(pk=self.request.user.pk)
        qs = qs.exclude(pk__in=self.request.user.following_set.all())
        return qs


@api_view(["POST"])
def user_follow(request):
    print("In user_follow-1")
    print(request.data)
    print(request.data.get("following_user", ""))
    follow_user = get_object_or_404(
        get_user_model(),
        username=request.data.get("following_user", ""),
        is_active=True,
    )
    login_user = request.user
    print("follow_user", follow_user)
    print("login_user", login_user)

    login_user.following_set.add(follow_user)
    follow_user.follower_set.add(login_user)
    print("In user_follow-2")
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
