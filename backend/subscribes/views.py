from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.viewsets import ReadOnlyModelViewSet

from .models import SubscriptionPlan, UserSubscription
from .serializers import SubscriptionPlanSerializer, UserSubscriptionSerializer


class SubscriptionPlanViewSet(ReadOnlyModelViewSet):
    permission_classes = [AllowAny]
    serializer_class = SubscriptionPlanSerializer
    pagination_class = None

    def get_queryset(self):
        return SubscriptionPlan.objects.filter(
            is_active=True,
            is_public=True,
        ).prefetch_related("features").order_by(
            "-is_highlighted",
            "sort_order",
            "price_usd",
            "name",
        )


class UserSubscriptionViewSet(ReadOnlyModelViewSet):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSubscriptionSerializer
    pagination_class = None

    def get_queryset(self):
        return UserSubscription.objects.filter(user=self.request.user).select_related("plan").prefetch_related(
            "plan__features"
        )
