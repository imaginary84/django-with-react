import re
from django.conf import settings
from django.db import models
from django.urls import reverse
from imagekit.models import ProcessedImageField

# from django.contrib.auth import get_user_model
# from django_pydenticon.views import image as django_pydenticon
# from django.shortcuts import resolve_url


class TimestampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Post(TimestampedModel):
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL, related_name="my_post_set", on_delete=models.CASCADE
    )
    # photo = models.ImageField(upload_to="instagram/post/%Y/%m/%d")
    photo = ProcessedImageField(
        upload_to="instagram/post/%Y/%m/%d", format="JPEG", options={"quality": 80}
    )
    caption = models.CharField(max_length=500)
    tag_set = models.ManyToManyField("Tag", blank=True)
    location = models.CharField(max_length=100)
    like_user_set = models.ManyToManyField(
        settings.AUTH_USER_MODEL, blank=True, related_name="like_post_set"
    )

    def __str__(self):
        return self.caption

    def extract_tag_list(self):
        tag_name_list = re.findall(r"#([a-zA-Z\dㄱ-힣]+)", self.caption)
        tag_list = []

        for tagname in tag_name_list:
            tag, _ = Tag.objects.get_or_create(name=tagname)
            tag_list.append(tag)

        return tag_list

    def get_absolute_url(self):
        return reverse("instagram:post_detail", args=[self.pk])

    def is_like_user(self, user):
        return self.like_user_set.filter(pk=user.pk).exists()

    # @property
    # def author_username(self):
    #     return get_user_model().objects.get(pk=self.author.pk).username

    # @property
    # def author_avatar(self):
    #     return resolve_url(django_pydenticon, self.author.username)

    class Meta:
        ordering = ["-id"]


class Comment(TimestampedModel):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    message = models.TextField()

    class Meta:
        ordering = ["id"]


class Tag(TimestampedModel):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name
