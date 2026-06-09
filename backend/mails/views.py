from django.db import transaction
from django.utils.decorators import method_decorator
from rest_framework.generics import CreateAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    ContactMessageCreateSerializer,
    PublicContactDetailsSerializer,
    SiteVisitCreateSerializer,
)


@method_decorator(transaction.non_atomic_requests, name="dispatch")
class ContactMessageCreateView(CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = ContactMessageCreateSerializer


class PublicContactDetailsView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []

    def get(self, request, *args, **kwargs):
        serializer = PublicContactDetailsSerializer.from_request(request)
        return Response(serializer.data)


@method_decorator(transaction.non_atomic_requests, name="dispatch")
class SiteVisitCreateView(CreateAPIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = SiteVisitCreateSerializer
