from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Blog, File

User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = "__all__"


class FileSerializer(serializers.ModelSerializer):
    class Meta:
        model = File
        fields = ["id", "blog", "file"]
        read_only_fields = ["id", "blog"]


class BlogSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(
        read_only=True,
    )
    file_set = FileSerializer(many=True, read_only=True)

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "updated_at",
            "author",
            "file_set",
        ]
        read_only_fields = ["id", "author"]

    def create(self, validated_data):
        request = self.context.get("request", None)

        if request is not None:

            blog = Blog.objects.create(**validated_data, author=request.user)

            files = request.data.getlist("files")

            for file in files:
                File.objects.create(blog=blog, file=file)

            return blog
        else:
            return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request", None)
        # print("Hantler Test", request)
        return super().update(instance, validated_data)
