from django.urls import path, include
from . import views

urlpatterns = [
    path('user/<str:email>', views.get_user),
    path('report', views.api_report),
    path('report/<str:uuid>', views.api_report),
]
