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

        # print(0, header)

        if header is None:
            raw_token = request.COOKIES.get(settings.SIMPLE_JWT["AUTH_COOKIE"]) or None
            # print("raw_token1", raw_token)
            if (
                request.path == "/accounts/login/"
                or request.path == "/accounts/refresh/"
                or request.path == "/accounts/signup/"
            ):
                raw_token = None

            # print("raw_token2", raw_token)
        else:
            raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        validated_token = self.get_validated_token(raw_token)
        # print("validated_token", validated_token)
        enforce_csrf(request)

        # print("get_user", self.get_user(validated_token))
        return self.get_user(validated_token), validated_token
