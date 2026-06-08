from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import SubscriptionPlan
from .serializers import SubscriptionPlanSerializer


class SubscriptionPlanViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = SubscriptionPlanSerializer
    pagination_class = None

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(is_active=True).prefetch_related("features").order_by(
            "-is_highlighted",
            "sort_order",
            "price_usd",
            "name",
        )
