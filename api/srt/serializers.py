from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from .models import Person, ReportingAssignment, AttendanceCategory, Site, Report, ReportItem, DailyReportItem, \
    MonthlyReportItem


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['uuid', 'name']


class AttendanceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceCategory
        fields = ['uuid', 'name']


class ReportingAssignmentSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True);
    category = AttendanceCategorySerializer(read_only=True);

    class Meta:
        model = ReportingAssignment
        fields = ['site', 'category']


class DailyReportItemSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True);
    category = AttendanceCategorySerializer(read_only=True);

    class Meta:
        model = DailyReportItem
        fields = ['site', 'category', 'count', 'date', 'closed']


class MonthlyReportItemSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True);
    category = AttendanceCategorySerializer(read_only=True);

    class Meta:
        model = MonthlyReportItem
        fields = ['site', 'category', 'count', 'year_month']


class ReportItemSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True);
    category = AttendanceCategorySerializer(read_only=True);

    class Meta:
        model = ReportItem
        fields = ['site', 'category', 'count']


class ReportItemPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        ReportItem: ReportItemSerializer,
        DailyReportItem: DailyReportItemSerializer,
        MonthlyReportItem: MonthlyReportItemSerializer
    }


class ReportSerializer(serializers.ModelSerializer):
    items = ReportItemPolymorphicSerializer(many=True, read_only=True)

    class Meta:
        model = Report
        fields = ['created', 'modified', 'notes', 'items']


class PersonSerializer(serializers.ModelSerializer):
    assignments = ReportingAssignmentSerializer(many=True, read_only=True)
    reports = ReportSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ['email', 'displayname', 'assignments', 'reports']
