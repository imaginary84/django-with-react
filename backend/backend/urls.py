from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path, include
from django_pydenticon.views import image as pydenticon_image


urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("instagram.urls")),
    path("blog/", include("blog.urls")),
    path("accounts/", include("accounts.urls")),
    path("api-auth/", include("rest_framework.urls")),
    path("identicon/image/<str:data>.png/", pydenticon_image, name="pydenticon_image"),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

    urlpatterns += [
        path("__debug__/", include("debug_toolbar.urls")),
    ]
