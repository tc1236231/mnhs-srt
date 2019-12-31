import google.oauth2.id_token
from google.auth.transport import requests
from rest_framework import authentication
from rest_framework import exceptions


firebase_request_adapter = requests.Request()


class APIFirebaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        if request.method == 'OPTIONS':
            return

        id_token = request.COOKIES.get('token')
        claims = None

        if id_token:
            try:
                claims = google.oauth2.id_token.verify_firebase_token(
                    id_token, firebase_request_adapter)
            except ValueError as exc:
                # This will be raised if the token is expired or any other
                # verification checks fail.
                error_message = str(exc)
                raise exceptions.AuthenticationFailed(error_message)

        if not claims:
            raise exceptions.AuthenticationFailed('Bad ID Token')
