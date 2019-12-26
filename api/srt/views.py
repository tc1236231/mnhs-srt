from django.http import Http404
from rest_framework.decorators import api_view

from .models import Person
from .serializers import PersonSerializer
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
