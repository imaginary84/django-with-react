from django.urls import path, include
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register("", views.BlogViewSet)

urlpatterns = [
    # path("hello_world/", views.hello_world),
    # path("<int:pk>/", views.blog_detail),
    path("<int:pk>/", views.BlogDetail2.as_view()),
    path("files/", views.FileList.as_view()),
    path("files/<int:pk>/", views.FileDetail.as_view()),
    path("tag/", views.TagList.as_view()),
    # path("", views.blog_create_list),
    path("", views.BlogList2.as_view()),
    # path("", include(router.urls)),
]
