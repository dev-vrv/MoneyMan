from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.test import APIClient

from backend.common.models import Budget, FinancialAccount, Transaction, TransactionCategory, UserProfile
from backend.common.services import create_user_with_workspace

User = get_user_model()


class UserModelTests(TestCase):
    def test_create_user_uses_email_as_identity(self):
        user = User.objects.create_user(
            email="TestUser@Example.com",
            phone=" +7 777 123 45 67 ",
            password="StrongPass123!",
        )

        self.assertEqual(user.email, "testuser@example.com")
        self.assertEqual(user.username, "testuser@example.com")
        self.assertEqual(user.phone, "+7 777 123 45 67")
        self.assertTrue(user.check_password("StrongPass123!"))

    def test_create_superuser_sets_required_flags(self):
        user = User.objects.create_superuser(
            email="admin@example.com",
            password="StrongPass123!",
        )

        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertTrue(user.is_active)


class AuthFlowTests(TestCase):
    def setUp(self):
        self.client = APIClient()

    def test_register_creates_user_with_empty_workspace(self):
        response = self.client.post(
            "/api/v1/auth/register/",
            {
                "email": "member@example.com",
                "phone": "+7 701 000 00 00",
                "password": "StrongPass123!",
                "password_confirmation": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        user = User.objects.get(email="member@example.com")
        self.assertEqual(response.data["user"]["email"], user.email)
        self.assertEqual(response.data["user"]["phone"], "+7 701 000 00 00")
        self.assertFalse(response.data["user"]["two_factor_enabled"])
        self.assertEqual(user.phone, "+7 701 000 00 00")
        self.assertTrue(UserProfile.objects.filter(user=user, phone=user.phone).exists())
        self.assertEqual(FinancialAccount.objects.filter(owner=user).count(), 0)
        self.assertEqual(TransactionCategory.objects.filter(owner=user).count(), 0)
        self.assertEqual(Budget.objects.filter(owner=user).count(), 0)
        self.assertEqual(Transaction.objects.filter(owner=user).count(), 0)

    def test_login_works_with_email_username_field(self):
        user = create_user_with_workspace(
            email="login@example.com",
            phone="+7 702 000 00 00",
            password="StrongPass123!",
        )

        response = self.client.post(
            "/api/v1/auth/login/",
            {
                "email": user.email,
                "password": "StrongPass123!",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["user"]["email"], user.email)
        self.assertEqual(response.data["user"]["phone"], user.phone)
        self.assertFalse(response.data["user"]["two_factor_enabled"])
        self.assertIn("access", response.data)
        self.assertIn("refresh", response.data)

    def test_current_user_patch_updates_profile_fields(self):
        user = create_user_with_workspace(
            email="profile@example.com",
            phone="+7 555 000 00 00",
            password="StrongPass123!",
        )
        self.client.force_authenticate(user)

        response = self.client.patch(
            "/api/v1/auth/me/",
            {
                "first_name": "Aida",
                "last_name": "Omur",
                "phone": "+996 700 11 22 33",
                "two_factor_enabled": True,
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        user.refresh_from_db()
        self.assertEqual(user.first_name, "Aida")
        self.assertEqual(user.last_name, "Omur")
        self.assertEqual(user.phone, "+996 700 11 22 33")
        self.assertTrue(user.two_factor_enabled)
        self.assertEqual(response.data["phone"], "+996 700 11 22 33")
        self.assertTrue(response.data["two_factor_enabled"])
