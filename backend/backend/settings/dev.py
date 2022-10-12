from .common import *

INSTALLED_APPS += [
    # third apps
    "debug_toolbar",
]

MIDDLEWARE = [
    "debug_toolbar.middleware.DebugToolbarMiddleware",
] + MIDDLEWARE


INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]
