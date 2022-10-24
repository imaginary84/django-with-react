from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Post


class AuthorSerializer(serializers.ModelSerializer):
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
