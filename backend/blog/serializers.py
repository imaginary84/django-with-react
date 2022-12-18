from urllib import parse
import re

from django.contrib.auth import get_user_model
from rest_framework import serializers
from .models import Blog, File, Tag

User = get_user_model()


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username"]


class FileSerializer(serializers.ModelSerializer):
    filename = serializers.SerializerMethodField("get_file_name", read_only=True)

    class Meta:
        model = File
        fields = ["id", "blog", "filename"]
        read_only_fields = ["id", "blog"]

    def get_file_name(self, obj):
        # return parse.unquote(obj.file.url)

        if re.match(r"^https?;//", obj.file.url):
            return parse.unquote(obj.file.url)

        if "request" in self.context:
            scheme = self.context["request"].scheme  # "http" or "https"
            host = self.context["request"].get_host()
            return scheme + "://" + host + parse.unquote(obj.file.url)


class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = ["id", "name"]


class BlogSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(
        read_only=True,
    )
    file_set = FileSerializer(many=True, read_only=True)
    tag_set = TagSerializer(many=True, read_only=True)

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
            "tag_set",
        ]
        read_only_fields = ["id", "author"]

    def create(self, validated_data):
        request = self.context.get("request", None)

        if request is not None:
            blog = Blog.objects.create(**validated_data, author=request.user)

            files = request.data.getlist("files")

            for file in files:
                File.objects.create(blog=blog, file=file)

            tag_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", validated_data.get("content"))
            for tag in tag_list:
                tag, created = Tag.objects.get_or_create(name=tag)
                tag.blog_set.add(blog)

            return blog
        else:
            return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get("request", None)

        if request.data.get("files", None):
            files = request.data.pop("files")
            for file in files:
                File.objects.create(blog=instance, file=file)

        tag_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", validated_data.get("content"))
        for tag in tag_list:
            tag, created = Tag.objects.get_or_create(name=tag)
            tag.blog_set.add(instance)

        return super().update(instance, validated_data)


class BlogListSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(
        read_only=True,
    )
    file_exist = serializers.SerializerMethodField("get_file_exist", read_only=True)

    def get_file_exist(self, obj):
        return obj.file_set.exists()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "content",
            "created_at",
            "author",
            # "file_set",
            # "tag_set",
            "file_exist",
        ]
        read_only_fields = ["id", "author"]

    def create(self, validated_data):
        request = self.context.get("request", None)

        if request is not None:
            blog = Blog.objects.create(**validated_data, author=request.user)

            # 파일 첨부.
            files = request.data.getlist("files")
            for file in files:
                File.objects.create(blog=blog, file=file)

            # 태그 달기.
            tag_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", validated_data.get("content"))
            for tag in tag_list:
                tag, created = Tag.objects.get_or_create(name=tag)
                tag.blog_set.add(blog)

            return blog
        else:
            return super().create(validated_data)


class BlogDetailSerializer(serializers.ModelSerializer):
    author = AuthorSerializer(
        read_only=True,
    )
    file_set = FileSerializer(many=True, read_only=True)
    tag_set = TagSerializer(many=True, read_only=True)

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
            "tag_set",
        ]
        read_only_fields = ["id", "author"]

    def update(self, instance, validated_data):
        request = self.context.get("request", None)

        # 파일 첨부.
        if request.data.get("files", None):
            files = request.data.pop("files")
            for file in files:
                File.objects.create(blog=instance, file=file)

        # 태그 전부다 지우고
        for tag in instance.tag_set.all():
            instance.tag_set.remove(tag)

        # 태그 새로 달기
        tag_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", validated_data.get("content"))
        for tag in tag_list:
            tag, created = Tag.objects.get_or_create(name=tag)
            tag.blog_set.add(instance)

        return super().update(instance, validated_data)
