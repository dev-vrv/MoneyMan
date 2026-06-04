from decimal import Decimal

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient

from .models import Account, Budget, Category, Currency, Transaction

User = get_user_model()


class FinanceAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="owner@example.com", password="testpass123")
        self.other_user = User.objects.create_user(email="other@example.com", password="testpass123")
        self.client.force_authenticate(self.user)

        self.usd = Currency.objects.create(code="USD", name="US Dollar", symbol="$", is_default=True)
        self.eur = Currency.objects.create(code="EUR", name="Euro", symbol="€")
        self.salary_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.INCOME,
            name="Salary",
            slug="salary",
            is_system=True,
        )
        self.food_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.EXPENSE,
            name="Food",
            slug="food",
            is_system=True,
        )
        self.custom_category = Category.objects.create(
            owner=self.user,
            kind=Category.CategoryKind.EXPENSE,
            name="Pet Care",
            slug="pet-care",
        )
        self.cash_account = Account.objects.create(
            owner=self.user,
            currency=self.usd,
            name="Cash",
            kind=Account.AccountKind.CASH,
            opening_balance=Decimal("1000.00"),
            current_balance=Decimal("1000.00"),
        )
        self.bank_account = Account.objects.create(
            owner=self.user,
            currency=self.eur,
            name="Euro Bank",
            kind=Account.AccountKind.BANK,
            opening_balance=Decimal("0.00"),
            current_balance=Decimal("0.00"),
        )

    def test_category_list_returns_system_and_custom_categories(self):
        response = self.client.get(reverse("api:finance-category-list"))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["count"], 3)

    def test_create_expense_transaction_updates_balance(self):
        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "category": self.food_category.id,
                "type": Transaction.TransactionType.EXPENSE,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "25.50",
                "title": "Groceries",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.cash_account.refresh_from_db()
        self.assertEqual(self.cash_account.current_balance, Decimal("974.50"))

    def test_create_transfer_between_currencies_requires_destination_amount(self):
        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "destination_account": self.bank_account.id,
                "type": Transaction.TransactionType.TRANSFER,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "100.00",
                "title": "FX transfer",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("destination_amount", response.data)

    def test_create_transfer_updates_both_accounts(self):
        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "destination_account": self.bank_account.id,
                "type": Transaction.TransactionType.TRANSFER,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "100.00",
                "destination_amount": "91.00",
                "title": "FX transfer",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.cash_account.refresh_from_db()
        self.bank_account.refresh_from_db()
        self.assertEqual(self.cash_account.current_balance, Decimal("900.00"))
        self.assertEqual(self.bank_account.current_balance, Decimal("91.00"))

    def test_dashboard_returns_financial_summary(self):
        Transaction.objects.create(
            owner=self.user,
            account=self.cash_account,
            category=self.salary_category,
            type=Transaction.TransactionType.INCOME,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("500.00"),
            title="Salary payment",
            occurred_on="2026-06-05",
        )
        Budget.objects.create(
            owner=self.user,
            category=self.food_category,
            currency=self.usd,
            period=Budget.BudgetPeriod.MONTHLY,
            amount=Decimal("300.00"),
            start_date="2026-06-01",
            end_date="2026-06-30",
        )

        response = self.client.get(reverse("api:finance-dashboard"))

        self.assertEqual(response.status_code, 200)
        self.assertIn("totals", response.data)
        self.assertIn("balances_by_currency", response.data["totals"])

    def test_user_cannot_use_other_users_custom_category(self):
        other_category = Category.objects.create(
            owner=self.other_user,
            kind=Category.CategoryKind.EXPENSE,
            name="Other private",
            slug="other-private",
        )

        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "category": other_category.id,
                "type": Transaction.TransactionType.EXPENSE,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "10.00",
                "title": "Invalid category",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
