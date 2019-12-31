import nested_admin
from django.contrib import admin
from polymorphic.admin import PolymorphicParentModelAdmin, PolymorphicChildModelAdmin

from .models import *

myModels = [Site, AttendanceCategory]
admin.site.register(myModels)


class ReportingAssignmentAttendanceCategoryInline(nested_admin.NestedStackedInline):
    model = ReportingAssignmentAttendanceCategory
    extra = 0


class ReportingAssignmentInline(nested_admin.NestedStackedInline):
    model = ReportingAssignment
    inlines = [ReportingAssignmentAttendanceCategoryInline]
    extra = 0


@admin.register(Person)
class StandardModelAdmin(nested_admin.NestedModelAdmin):
    inlines = [ReportingAssignmentInline]
    search_fields = ['email', 'displayname']


class ReportItemInline(admin.StackedInline):
    model = ReportItem
    extra = 0


@admin.register(DailyReport)
class DailyReportAdmin(PolymorphicChildModelAdmin):
    base_model = DailyReport
    inlines = (ReportItemInline,)


@admin.register(MonthlyReport)
class MonthlyReportAdmin(PolymorphicChildModelAdmin):
    base_model = MonthlyReport
    inlines = (ReportItemInline,)


@admin.register(Report)
class ReportParentAdmin(PolymorphicParentModelAdmin):
    """ The parent model admin """
    base_model = Report
    child_models = (MonthlyReport, DailyReport)
    inlines = (ReportItemInline,)
    search_fields = ['submitter__email', 'submitter__displayName']
