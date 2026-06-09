from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import SubscriptionPlan, UserSubscription

User = get_user_model()


class SubscriptionApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="plans@example.com", password="pass12345")
        self.client.force_authenticate(self.user)
        self.plan = SubscriptionPlan.objects.create(
            code="pro",
            name="Pro",
            description="AI guidance",
            price_usd=Decimal("29.00"),
            price_currency="USD",
            is_active=True,
            is_public=True,
        )

    def test_list_plans(self):
        response = self.client.get(reverse("api:subscription-plan-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["code"], self.plan.code)

    def test_list_current_user_subscriptions(self):
        UserSubscription.objects.create(user=self.user, plan=self.plan, status=UserSubscription.Status.ACTIVE)

        response = self.client.get(reverse("api:user-subscription-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["status"], UserSubscription.Status.ACTIVE)
