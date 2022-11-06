from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings
from django.contrib.auth.models import update_last_login

import json, re

User = get_user_model()


class SignupSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    def create(self, validated_data):
        user = User.objects.create(username=validated_data["username"])
        user.set_password(validated_data["password"])
        user.save()
        return user

    class Meta:
        model = User
        fields = ["pk", "username", "password"]


class UserSerializer(serializers.ModelSerializer):

    avatar_url = serializers.SerializerMethodField(method_name="avatar_url_field")

    def avatar_url_field(self, author):
        if re.match(r"^https?;//", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "name",
            "email",
            "website_url",
            "bio",
            "phone_number",
            "gender",
            "avatar",
            "avatar_url",
        ]


class ProfileSerializer(serializers.ModelSerializer):
    following_set = UserSerializer(many=True, read_only=True)
    follower_set = UserSerializer(many=True, read_only=True)
    post_cnt = serializers.SerializerMethodField(method_name="def_post_cnt")
    avatar_url = serializers.SerializerMethodField(method_name="avatar_url_field")

    def def_post_cnt(self, user):
        # print(self.context["request"].method)
        # if self.context["request"].method == "GET":
        # print("로그인 유저 : ", self.context["request"].user)
        # print("조회된 유저 : ", user)
        # print(user.my_post_set.count())
        # print("end")
        return user.my_post_set.count()

    def avatar_url_field(self, author):
        if re.match(r"^https?;//", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "first_name",
            "last_name",
            "name",
            "email",
            "website_url",
            "bio",
            "phone_number",
            "gender",
            "avatar",
            "avatar_url",
            "following_set",
            "follower_set",
            "post_cnt",
        ]


class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)

        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data["username"] = self.user.username

        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)

        return data
