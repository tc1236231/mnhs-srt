import datetime
import json
import os
from uuid import uuid4

from google.cloud import storage


storage_client = storage.Client()
bucket = storage_client.get_bucket(os.getenv('DW_BUCKET_URL'))


def fetch(blob):
    return json.loads(blob.download_as_string())


def document(folder, id):
    blob = bucket.blob('{}/{}.json'.format(folder, id))

    return fetch(blob)


def user(email):
    return dict(email=email, **document('users', email))


def site(uuid):
    return dict(uuid=uuid, **document('sites', uuid))


def category(uuid):
    return dict(uuid=uuid, **document('categories', uuid))


def reports(email):
    blobs = bucket.list_blobs(
        prefix='reports/{}/'.format(email), delimiter="/")

    return (
        dict(uuid=b.name.strip('.json'), **fetch(b)) for b in blobs
        if b.name.endswith('.json'))


def enriched_site(uuid):
    s = site(uuid)

    result = {
        'uuid': uuid,
        'name': s['name'],
        'reportFreq': s['reportFreq'],
        'categories': []}

    for cuuid in s['categoryUUIDs']:
        result['categories'].append(category(cuuid))

    return result


def add_report(report):
    uuid = str(uuid4())
    blob = bucket.blob('reports/{}/{}.json'.format(
        report['submitterEmail'], uuid))
    blob.upload_from_string(json.dumps(report))

    return uuid
