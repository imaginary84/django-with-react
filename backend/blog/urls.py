from django.urls import path, include
from . import views

urlpatterns = [
    # path("hello_world/", views.hello_world),
    path("", views.blog_create_list),
    path("<int:pk>/", views.blog_detail),
]
