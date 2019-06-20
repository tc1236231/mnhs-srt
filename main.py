import datetime

from flask import Flask, render_template, request, g
from flask_wtf import FlaskForm
from wtforms import (
    FieldList, TextAreaField, SelectField, StringField, BooleanField,
    SubmitField)
from wtforms.fields.html5 import IntegerField, DateField
from wtforms.validators import DataRequired
from google.auth.transport import requests
from google.cloud import datastore
import google.oauth2.id_token


firebase_request_adapter = requests.Request()
datastore_client = datastore.Client()

app = Flask(__name__)
app.secret_key = 'abcdef123456'

dummy_user = {
    'email': 'samuel.courtier@mnhs.org',
    'name': 'Samuel Courtier',
    'sites': [
        {'id': 'mhc',
         'name': 'Minnesota History Center',
         'reportFreq': 'daily',
         'categories': {
             'adult': 'Adult',
             'paid': 'Paid',
             'free': 'Free'}},
        {'id': 'hfs',
         'name': 'Historic Fort Snelling',
         'reportFreq': 'monthly',
         'categories': {
             'adult': 'Adult',
             'paid': 'Paid'}}],
    'reports': [
        {'submit_datetime': datetime.datetime.now(),
         'site_id': 'mhc',
         'site_name': 'Minnesota History Center',
         'report_date': datetime.date.today(),
         'closed': True,
         'counts': {
             'adult': 100,
             'child': 200,
             'program': 300},
         'notes': 'Here are some notes'},
        {'submit_datetime': datetime.date.today(),
         'site_id': 'hfs',
         'site_name': 'Historic Fort Snelling',
         'report_month_start': datetime.date.today(),
         'counts': {
             'adult': 4000,
             'child': 5000},
         'notes': 'Here are some other notes'}]}


class VisitCountForm(FlaskForm):
    visits = IntegerField('Visits')


class Report(FlaskForm):
    submit = SubmitField('Submit')
    visit_counts = FieldList(StringField())
    notes = TextAreaField('Notes')


class DailyReport(Report):
    date = DateField('Date')
    closed = BooleanField('Site closed')


class MonthlyReport(Report):
    year = SelectField(
        'Year',
        choices=[(i, i) for i in range(2000, datetime.date.today().year)])
    month = SelectField('Month', choices=[
        ('jan', 'January'), ('feb', 'Feburary'), ('mar', 'March'),
        ('apr', 'April'), ('may', 'May'), ('jun', 'June'),
        ('jul', 'July'), ('aug', 'August'), ('sep', 'September'),
        ('oct', 'October'), ('nov', 'November'), ('dec', 'December')])


@app.before_request
def verify_firebase_auth():
    id_token = request.cookies.get("token")
    error_message = None
    claims = None
    g.user = None

    if id_token:
        try:
            # Verify the token against the Firebase Auth API. This example
            # verifies the token on each page load. For improved performance,
            # some applications may wish to cache results in an encrypted
            # session store (see for instance
            # http://flask.pocoo.org/docs/1.0/quickstart/#sessions).
            claims = google.oauth2.id_token.verify_firebase_token(
                id_token, firebase_request_adapter)
            g.user = dummy_user

        except ValueError as exc:
            # This will be raised if the token is expired or any other
            # verification checks fail.
            error_message = str(exc)


@app.route('/')
def root():
    return render_template(
        'index.html',
        #user_data=claims, error_message=error_message, times=times,
        user_data=g.user)


@app.route('/new_report/<site_id>')
def new_report(site_id):
    site = next(s for s in g.user['sites'] if s['id'] == site_id)
    form_class = (DailyReport if site['reportFreq'] == 'daily'
                  else MonthlyReport)

    class F(form_class):
        pass

    for id, name in site['categories'].items():
        setattr(F, id, IntegerField(name))

    return render_template(
        'site_report_form.html',
        site=site,
        form=F(),
        user_data=g.user)


@app.route('/submit', methods=('GET', 'POST'))
def submit():
    form = MyForm()
    if form.validate_on_submit():
        return redirect('/success')
    return render_template('submit.html', form=form)


if __name__ == '__main__':
    app.run(debug=True)
