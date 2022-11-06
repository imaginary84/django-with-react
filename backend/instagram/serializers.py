import re

# from xml.etree.ElementTree import Comment
from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post, Comment


class AuthorSerializer(serializers.ModelSerializer):

    avatar_url = serializers.SerializerMethodField(method_name="avatar_url_field")

    def avatar_url_field(self, author):
        if re.match(r"^https?;//", author.avatar_url):
            return author.avatar_url

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + author.avatar_url

    class Meta:
        model = get_user_model()
        fields = ["id", "username", "name", "avatar_url"]


class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    is_like = serializers.SerializerMethodField(method_name="is_like_field")

    # self.context에서 request를 가져오려면. view에서 get_serializer_context를 상속받아서 context에 request를 채워서
    def is_like_field(self, post):
        if "request" in self.context:
            user = self.context["request"].user
            return post.like_user_set.filter(pk=user.pk).exists()
        return False

    class Meta:
        model = Post
        fields = [
            "id",
            "created_at",
            "updated_at",
            "photo",
            "caption",
            "location",
            "author",
            "tag_set",
            "is_like",
        ]


class CommentSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)
    # post = PostSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "message", "author", "created_at"]
