from rest_framework.exceptions import PermissionDenied, AuthenticationFailed, NotAuthenticated
from django.http import Http404
from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

def my_handler(exc, context):
    response = exception_handler(exc, context)

    if isinstance(exc, PermissionDenied):
        return Response({
          "message": "error",
          "error": {
            "code": 403,
            "details": "Access denied"
          },
          "data": None
        }, status=status.HTTP_403_FORBIDDEN)
    elif isinstance(exc, AuthenticationFailed or NotAuthenticated):
        return Response({
          "message": "error",
          "error": {
            "code": 401,
            "details": "Authentication failed"
          },
          "data": None
        },status=status.HTTP_401_UNAUTHORIZED)
    elif isinstance(exc, Http404):
        return Response({
          "message": "error",
          "error": {
            "code": 404,
            "details": "Not found"
          },
          "data": None
        }, status=status.HTTP_404_NOT_FOUND)

    return response