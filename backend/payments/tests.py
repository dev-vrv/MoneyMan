from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from subscribes.models import SubscriptionPlan

from .models import PaymentOrder

User = get_user_model()


class PaymentOrderApiTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(email="payments@example.com", password="pass12345")
        self.client.force_authenticate(self.user)
        self.plan = SubscriptionPlan.objects.create(
            code="plus",
            name="Plus",
            description="Rates and assets",
            price_usd=Decimal("12.00"),
            price_currency="USD",
            is_active=True,
            is_public=True,
        )

    def test_create_payment_order(self):
        response = self.client.post(
            reverse("api:payment-order-list"),
            {
                "plan": self.plan.id,
                "success_url": "https://example.com/success",
                "fail_url": "https://example.com/fail",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(PaymentOrder.objects.count(), 1)
        order = PaymentOrder.objects.get()
        self.assertEqual(order.user, self.user)
        self.assertEqual(order.plan, self.plan)
        self.assertEqual(order.amount, self.plan.price_usd)
