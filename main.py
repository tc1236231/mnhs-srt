import os
import json

import google.oauth2.id_token
from google.auth.transport import requests
from flask import Flask, request, send_from_directory
from flask_restful import Resource, Api

import storage


firebase_request_adapter = requests.Request()

app = Flask(__name__, static_folder='react-app/build/static')
app.secret_key = 'abcdef123456'

api = Api(app)


@app.before_request
def verify_firebase_auth():
    id_token = request.cookies.get('token')
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

#            return 'You are not authorized to view this.'

    else:
        pass
#        return 'You are not authorized to view this.'


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve_react_app(path):
    if path != "" and os.path.exists(app.static_folder + path):
        return send_from_directory(app.static_folder, path)
    else:
        return send_from_directory(
            os.path.join(app.static_folder, os.pardir), 'index.html')


class User(Resource):
    def get(self, email):
        user = storage.user(email)

        enriched_user = dict(
            email=email,
            displayName=user['displayName'],
            sites=[],
            reports=[])

        for suuid in user['siteUUIDs']:
            enriched_user['sites'].append(storage.enriched_site(suuid))

        for report in storage.reports(email):
            enriched_report = dict(
                submitTS=report['submitTS'],
                submitterEmail=report['submitterEmail'],
                site=storage.site(report['siteUUID']),
                counts=[],
                notes=report['notes'])

            if report.get('date'):
                enriched_report['date'] = report['date']
                enriched_report['closed'] = report['closed']
            elif report.get('year'):
                enriched_report['year'] = report['year']
                enriched_report['month'] = report['month']

            for cnt in report['counts']:
                enriched_report['counts'].append(dict(
                    category=storage.category(cnt['categoryUUID']),
                    count=cnt['count']))

            enriched_user['reports'].append(enriched_report)

        return enriched_user


class Report(Resource):
    def post(self):
        return storage.add_report(request.json)

    # blob = bucket.blob('site-reports/{}.json'.format(uuid))
    # return(blob.download_as_string())


api.add_resource(User, '/user/<email>')
api.add_resource(Report, '/report')
