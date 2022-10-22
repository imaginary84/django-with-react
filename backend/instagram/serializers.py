from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = ["id", "username", "name", "avatar_url"]


class PostSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(read_only=True)

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
            "like_user_set",
            # "author_username",
            # "author_avatar",
        ]
