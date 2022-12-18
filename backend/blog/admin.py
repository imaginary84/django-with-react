from django.contrib import admin
from .models import Blog, File, Tag


@admin.register(Blog)
class BlogAdmin(admin.ModelAdmin):
    list_display = ["id", "title", "content", "author", "created_at"]
    list_display_links = ["id", "title"]


@admin.register(File)
class FileAdmin(admin.ModelAdmin):
    pass


@admin.register(Tag)
class TagAdmin(admin.ModelAdmin):
    pass
