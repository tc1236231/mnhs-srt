from uuid import uuid4

from django.db import models
from month.models import MonthField
from polymorphic.models import PolymorphicModel


class Model(models.Model):
    uuid = models.UUIDField(primary_key=True, default=uuid4, editable=False)

    class Meta:
        abstract = True


class Person(Model):

    def __str__(self):
        return '{} - {}'.format(self.displayName, self.email)

    email = models.CharField(max_length=50)
    displayName = models.CharField(max_length=50)


class Site(Model):

    def __str__(self):
        return '{} - {}'.format(self.name, self.uuid)

    name = models.CharField(max_length=50)
    REPORT_MODES = [
        ('DAILY', 'DAILY'),
        ('MONTHLY', 'MONTHLY'),
    ]
    reportMode = models.CharField(
        max_length=10,
        choices=REPORT_MODES,
        default='DAILY',
    )


class AttendanceCategory(Model):

    def __str__(self):
        return '{} - {}'.format(self.name, self.uuid)

    name = models.CharField(max_length=100)

    class Meta:
        verbose_name_plural = "Attendance Categories"


class ReportingAssignment(Model):
    class Meta:
        unique_together = (('user', 'site'),)

    def __str__(self):
        return '{} - {}'.format(self.user.email, self.site.name)

    user = models.ForeignKey(Person, related_name='assignments', on_delete=models.CASCADE)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


class ReportingAssignmentAttendanceCategory(Model):

    assignment = models.ForeignKey(ReportingAssignment, related_name='categories', on_delete=models.CASCADE)
    category = models.ForeignKey(AttendanceCategory, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Reporting Assignment Attendance Categories"


class Report(Model, PolymorphicModel):

    def __str__(self):
        return '{} : {} - {}'.format(self.polymorphic_ctype.name,  self.submitter.email, self.modified)

    submitter = models.ForeignKey(Person, related_name='reports', on_delete=models.CASCADE)
    created = models.DateTimeField(auto_now_add=True)
    modified = models.DateTimeField(auto_now=True)
    notes = models.TextField(blank=True)
    site = models.ForeignKey(Site, on_delete=models.CASCADE)


class ReportItem(Model):

    report = models.ForeignKey(Report, related_name='items', on_delete=models.CASCADE)
    category = models.ForeignKey(AttendanceCategory, on_delete=models.CASCADE)
    count = models.IntegerField()


class DailyReport(Report):

    date = models.DateField()
    closed = models.BooleanField(default=False)


class MonthlyReport(Report):

    year_month = MonthField()
