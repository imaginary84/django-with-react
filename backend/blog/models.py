from django.db import models
from django.conf import settings

# Create your models here.


class Blog(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-id"]

    def __str__(self):
        return self.title


class File(models.Model):
    blog = models.ForeignKey(Blog, on_delete=models.CASCADE)
    file = models.ImageField(upload_to="blog/%Y/%m/%d", blank=True)

    class Meta:
        ordering = ["-id"]


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    blog_set = models.ManyToManyField(Blog, related_name="tag_set", blank=True)

    def __str__(self):
        return self.name
