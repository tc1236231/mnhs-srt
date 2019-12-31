from rest_framework import serializers
from rest_polymorphic.serializers import PolymorphicSerializer

from .models import Person, ReportingAssignment, AttendanceCategory, Site, Report, ReportItem, MonthlyReport, \
    DailyReport, ReportingAssignmentAttendanceCategory


class SiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Site
        fields = ['uuid', 'name', 'reportMode']


class AttendanceCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AttendanceCategory
        fields = ['uuid', 'name']


class ReportingAssignmentAttendanceCategorySerializer(serializers.ModelSerializer):
    category = AttendanceCategorySerializer(read_only=True)

    class Meta:
        model = ReportingAssignmentAttendanceCategory
        fields = ['category']


class ReportingAssignmentSerializer(serializers.ModelSerializer):
    site = SiteSerializer(read_only=True)
    categories = ReportingAssignmentAttendanceCategorySerializer(many=True, read_only=True)

    class Meta:
        model = ReportingAssignment
        fields = ['site', 'categories']


class ReportItemSerializer(serializers.ModelSerializer):
    category = AttendanceCategorySerializer(read_only=True)

    class Meta:
        model = ReportItem
        fields = ['uuid', 'category', 'count']


class ReportItemSubmitSerializer(serializers.ModelSerializer):
    category = serializers.PrimaryKeyRelatedField(queryset=AttendanceCategory.objects, required=True)

    class Meta:
        model = ReportItem
        fields = ['uuid', 'category', 'count']


class DailyReportSubmitSerializer(serializers.ModelSerializer):
    items = ReportItemSubmitSerializer(many=True, required=False)
    site = serializers.PrimaryKeyRelatedField(queryset=Site.objects, required=True)
    date = serializers.DateField(required=True)
    submitter = serializers.PrimaryKeyRelatedField(queryset=Person.objects, required=True)

    def create(self, validated_data):
        if 'items' in validated_data:
            items_data = validated_data.pop('items')
            report = DailyReport.objects.create(**validated_data)

            for item in items_data:
                inst = ReportItem.objects.create(report=report, **item)
                report.items.add(inst)
        else:
            report = DailyReport.objects.create(**validated_data)

        return report

    def update(self, instance, validated_data):
        if 'items' in validated_data:
            items_data = validated_data.pop('items')
            instance.items.all().delete()

            for item in items_data:
                inst = ReportItem.objects.create(report=instance, **item)
                instance.items.add(inst)

        return instance

    class Meta:
        model = DailyReport
        fields = ['uuid', 'submitter', 'created', 'modified', 'notes', 'site', 'items', 'date', 'closed']


class DailyReportSerializer(serializers.ModelSerializer):
    items = ReportItemSerializer(many=True)
    site = SiteSerializer(read_only=True)

    class Meta:
        model = DailyReport
        fields = ['uuid', 'created', 'modified', 'notes', 'site', 'items', 'date', 'closed']


class MonthlyReportSubmitSerializer(serializers.ModelSerializer):
    items = ReportItemSubmitSerializer(many=True, required=False)
    site = serializers.PrimaryKeyRelatedField(queryset=Site.objects, required=True)
    year_month = serializers.DateField(format="%Y-%m", input_formats=['%Y-%m', ])
    submitter = serializers.PrimaryKeyRelatedField(queryset=Person.objects, required=True)

    def create(self, validated_data):
        if 'items' in validated_data:
            items_data = validated_data.pop('items')
            report = MonthlyReport.objects.create(**validated_data)

            for item in items_data:
                inst = ReportItem.objects.create(report=report, **item)
                report.items.add(inst)
        else:
            report = MonthlyReport.objects.create(**validated_data)

        return report

    def update(self, instance, validated_data):
        instance.notes = validated_data.get('notes', instance.notes)
        if 'items' in validated_data:
            items_data = validated_data.pop('items')
            instance.items.all().delete()

            for item in items_data:
                inst = ReportItem.objects.create(report=instance, **item)
                instance.items.add(inst)

        instance.save()
        return instance

    class Meta:
        model = MonthlyReport
        fields = ['uuid', 'submitter', 'created', 'modified', 'notes', 'site', 'items', 'year_month']


class MonthlyReportSerializer(serializers.ModelSerializer):
    items = ReportItemSerializer(many=True)
    site = SiteSerializer(read_only=True)
    year_month = serializers.DateField(format="%Y-%m", input_formats=['%Y-%m', ])

    class Meta:
        model = MonthlyReport
        fields = ['uuid', 'created', 'modified', 'notes', 'site', 'items', 'year_month']


class ReportPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        DailyReport: DailyReportSerializer,
        MonthlyReport: MonthlyReportSerializer
    }


class ReportSubmitPolymorphicSerializer(PolymorphicSerializer):
    model_serializer_mapping = {
        DailyReport: DailyReportSubmitSerializer,
        MonthlyReport: MonthlyReportSubmitSerializer
    }


class PersonSerializer(serializers.ModelSerializer):
    assignments = ReportingAssignmentSerializer(many=True, read_only=True)
    reports = ReportPolymorphicSerializer(many=True, read_only=True)

    class Meta:
        model = Person
        fields = ['uuid', 'email', 'displayName', 'assignments', 'reports']
