from django.urls import path, include
from . import views

urlpatterns = [
    path('user/<str:email>', views.get_user),
]