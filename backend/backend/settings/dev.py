from .common import *

INSTALLED_APPS += [
    # third apps
    "debug_toolbar",
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + MIDDLEWARE


INTERNAL_IPS = [
    "127.0.0.1",
]


# API 서버와 리액트 서버가 주소가 다를때는 CORS나 CSRF를 해결하기위해 설정이 필요하다.
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

CORS_ALLOW_CREDENTIALS = True

CSRF_TRUSTED_ORIGINS = ["http://localhost:3000"]
