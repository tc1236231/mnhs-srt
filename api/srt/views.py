from django.http import Http404
from rest_framework import status
from rest_framework.decorators import api_view

from .models import Person, Report
from .serializers import PersonSerializer, ReportPolymorphicSerializer, \
    ReportSubmitPolymorphicSerializer
from rest_framework.response import Response


@api_view(['GET'])
def get_user(request, email):
    """
    List all code snippets, or create a new snippet.
    """
    def get_object(email):
        try:
            return Person.objects.get(email=email)
        except Person.DoesNotExist:
            raise Http404

    if request.method == 'GET':
        p = get_object(email=email)
        serializer = PersonSerializer(p)
        return Response(serializer.data)


@api_view(['POST', 'PUT', 'DELETE'])
def api_report(request, uuid=None):
    """
    List all code snippets, or create a new snippet.
    """
    def get_object(pk_uuid):
        try:
            return Report.objects.get(pk=pk_uuid)
        except Report.DoesNotExist:
            raise Http404

    if request.method == 'DELETE':
        p = get_object(uuid)
        p.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
    elif request.method == 'POST':
        serializer = ReportSubmitPolymorphicSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'PUT':
        p = get_object(uuid)
        serializer = ReportSubmitPolymorphicSerializer(p, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
