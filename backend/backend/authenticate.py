from rest_framework_simplejwt.authentication import JWTAuthentication
from django.conf import settings

from rest_framework.authentication import CSRFCheck
from rest_framework import exceptions


def enforce_csrf(request):
    def dummy_get_response(request):  # pragma: no cover
        return None

    check = CSRFCheck(dummy_get_response)
    check.process_request(request)
    reason = check.process_view(request, None, (), {})

    if reason:
        raise exceptions.PermissionDenied("CSRF Failed: %s" % reason)


class CustomAuthentication(JWTAuthentication):
    def authenticate(self, request):
        header = self.get_header(request)
        # print("header", header)
        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"]) or None
            # print("raw_token", raw_token, request.path)
            if (
                request.path == "/accounts/login/"
                # or request.path == "/accounts/refresh/"
                or request.path == "/accounts/signup/"
            ):
                raw_token = None

        else:
            raw_token = self.get_raw_token(header)
        # print(11111111111111)
        if raw_token is None:
            return None
        # print(222222222222222)
        validated_token = self.get_validated_token(raw_token)
        # print(333333333333333)
        enforce_csrf(request)
        # print(44444444444444)

        return self.get_user(validated_token), validated_token
