from django.urls import path, include
from . import views


from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)


urlpatterns = [
    path("signup/", views.SignupView.as_view(), name="signup"),
    path("login/", views.LoginView.as_view(), name="login"),
    # path("refresh/", views.CustomTokenRefreshView.as_view(), name="refresh"),
    path("refresh/", views.CustomTokenRefreshView2, name="refresh"),
    path("token/", views.MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/verify/", TokenVerifyView.as_view(), name="token_verify"),
    path(
        "suggestions/",
        views.SuggestionListApiView.as_view(),
        name="suggestion_user_list",
    ),
    path("follow/", views.user_follow, name="user_follow"),
    path("unfollow/", views.user_unfollow, name="user_unfollow"),
    path("profile/<str:username>/", views.ProfileView.as_view(), name="profile"),
]
