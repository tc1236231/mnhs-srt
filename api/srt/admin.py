from django.contrib import admin
from polymorphic.admin import StackedPolymorphicInline, PolymorphicInlineSupportMixin

from .models import *

myModels = [Site, AttendanceCategory]
admin.site.register(myModels)


class ReportingAssignmentInline(admin.StackedInline):
    model = ReportingAssignment
    extra = 0


@admin.register(Person)
class StandardModelAdmin(admin.ModelAdmin):
    inlines = [ReportingAssignmentInline]


class ReportItemInline(StackedPolymorphicInline):
    """
    An inline for a polymorphic model.
    The actual form appearance of each row is determined by
    the child inline that corresponds with the actual model type.
    """
    class DailyReportItemInline(StackedPolymorphicInline.Child):
        model = DailyReportItem

    class MonthlyReportItemInline(StackedPolymorphicInline.Child):
        model = MonthlyReportItem

    model = ReportItem
    child_inlines = (
        DailyReportItemInline,
        MonthlyReportItemInline,
    )


@admin.register(Report)
class ReportAdmin(PolymorphicInlineSupportMixin, admin.ModelAdmin):
    inlines = (ReportItemInline,)
