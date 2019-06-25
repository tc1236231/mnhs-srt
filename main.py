import os

from flask import Flask, request, send_from_directory
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token


firebase_request_adapter = requests.Request()
datastore_client = datastore.Client()

app = Flask(__name__, static_folder='react-app/build/static')
app.secret_key = 'abcdef123456'


@app.before_request
def verify_firebase_auth():
    id_token = request.cookies.get("token")
    error_message = None
    claims = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)
        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    print(app.static_folder)
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(
            os.path.join(app.static_folder, os.pardir), 'index.html')
