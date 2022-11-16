from django.urls import path, include
from . import views

urlpatterns = [
    # path("hello_world/", views.hello_world),
    # path("", views.blog_create_list),
    path("", views.BlogList2.as_view()),
    # path("<int:pk>/", views.blog_detail),
    path("<int:pk>/", views.BlogDetail0.as_view()),
]
