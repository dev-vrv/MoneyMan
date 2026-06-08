from datetime import date
from decimal import Decimal
from unittest.mock import Mock, patch

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from django.utils import timezone
from rest_framework.test import APIClient

from .currency_sync import FX_KG_SOURCE, sync_fx_kg_reference_data
from .market_data import (
    CRYPTO_MARKET_PROVIDER_BINANCE,
    CRYPTO_MARKET_PROVIDER_OKX,
    CryptoMarketDataError,
    CryptoMarketSnapshot,
)
from .models import (
    Account,
    AccountDepositProfile,
    AccountTaxProfile,
    Budget,
    Category,
    CryptoAsset,
    CryptoAssetNetwork,
    CryptoHolding,
    CryptoNetwork,
    Currency,
    ExchangeRate,
    Notification,
    NotificationReceipt,
    Transaction,
)
from .services import (
    build_tax_obligations,
    build_workspace_overview,
    calculate_deposit_snapshot,
    ensure_default_crypto_reference_data,
    ensure_system_categories,
    ensure_user_finance_setup,
    get_next_period_start,
    get_period_start,
)

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
            name_ru="Зарплата",
            name_en="Salary",
            name_kg="Айлык",
            slug="salary",
            is_system=True,
        )
        self.food_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.EXPENSE,
            name="Food",
            name_ru="Еда",
            name_en="Food",
            name_kg="Тамак-аш",
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

    def test_category_list_localizes_system_names_but_keeps_custom_name(self):
        response = self.client.get(
            reverse("api:finance-category-list"),
            HTTP_X_LOCALE="kg",
        )

        self.assertEqual(response.status_code, 200)
        category_map = {item["slug"]: item["name"] for item in response.data["results"]}
        self.assertEqual(category_map["salary"], "Айлык")
        self.assertEqual(category_map["food"], "Тамак-аш")
        self.assertEqual(category_map["pet-care"], "Pet Care")

    def test_category_list_returns_fallback_icon_and_color_for_system_categories(self):
        response = self.client.get(reverse("api:finance-category-list"))

        self.assertEqual(response.status_code, 200)
        category_map = {item["slug"]: item for item in response.data["results"]}
        self.assertEqual(category_map["salary"]["icon"], "salary")
        self.assertEqual(category_map["salary"]["color"], "emerald")
        self.assertEqual(category_map["food"]["icon"], "food")
        self.assertEqual(category_map["food"]["color"], "orange")

    def test_user_can_create_personal_subcategory_under_system_category(self):
        response = self.client.post(
            reverse("api:finance-category-list"),
            {
                "parent": self.food_category.id,
                "kind": Category.CategoryKind.EXPENSE,
                "name": "Dog food",
                "slug": "dog-food",
                "description": "Personal subcategory",
                "icon": "food",
                "color": "amber",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        created_category = Category.objects.get(pk=response.data["id"])
        self.assertEqual(created_category.owner, self.user)
        self.assertEqual(created_category.parent, self.food_category)
        self.assertFalse(created_category.is_system)
        self.assertEqual(created_category.name, "Dog food")
        self.assertEqual(created_category.icon, "food")
        self.assertEqual(created_category.color, "amber")

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

    def test_create_transaction_without_title_is_allowed(self):
        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "category": self.food_category.id,
                "type": Transaction.TransactionType.EXPENSE,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "25.50",
                "title": "",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["title"], "")

    def test_notifications_list_includes_personal_and_broadcast_only(self):
        personal = Notification.objects.create(
            recipient=self.user,
            scope=Notification.Scope.PERSONAL,
            level=Notification.Level.INFO,
            title="Personal",
            body="Personal body",
        )
        broadcast = Notification.objects.create(
            scope=Notification.Scope.BROADCAST,
            level=Notification.Level.WARNING,
            title="Broadcast",
            body="Broadcast body",
        )
        Notification.objects.create(
            recipient=self.other_user,
            scope=Notification.Scope.PERSONAL,
            level=Notification.Level.INFO,
            title="Other user personal",
            body="Hidden",
        )

        response = self.client.get(reverse("api:finance-notification-list"))

        self.assertEqual(response.status_code, 200)
        returned_ids = {item["id"] for item in response.data}
        self.assertEqual(returned_ids, {personal.id, broadcast.id})
        self.assertTrue(all(item["is_read"] is False for item in response.data))

    def test_notification_mark_read_creates_receipt(self):
        notification = Notification.objects.create(
            scope=Notification.Scope.BROADCAST,
            level=Notification.Level.INFO,
            title="Broadcast",
            body="Body",
        )

        response = self.client.post(
            reverse("api:finance-notification-mark-read", kwargs={"pk": notification.pk}),
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["is_read"])
        self.assertTrue(
            NotificationReceipt.objects.filter(
                notification=notification,
                user=self.user,
                read_at__isnull=False,
            ).exists()
        )

    def test_notification_mark_all_read_marks_all_visible_items(self):
        personal = Notification.objects.create(
            recipient=self.user,
            scope=Notification.Scope.PERSONAL,
            title="Personal",
            body="Body",
        )
        broadcast = Notification.objects.create(
            scope=Notification.Scope.BROADCAST,
            title="Broadcast",
            body="Body",
        )
        NotificationReceipt.objects.create(
            notification=personal,
            user=self.user,
            read_at=timezone.now(),
        )

        response = self.client.post(
            reverse("api:finance-notification-mark-all-read"),
            format="json",
        )

        self.assertEqual(response.status_code, 204)
        self.assertEqual(
            NotificationReceipt.objects.filter(
                user=self.user,
                notification__in=[personal, broadcast],
                read_at__isnull=False,
            ).count(),
            2,
        )

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

    def test_user_can_create_entrepreneur_account_with_nested_tax_profile(self):
        response = self.client.post(
            reverse("api:finance-account-list"),
            {
                "currency": self.usd.code,
                "name": "IP account",
                "kind": Account.AccountKind.ENTREPRENEUR,
                "status": Account.AccountStatus.ACTIVE,
                "institution": "Demir Bank",
                "opening_balance": "0.00",
                "credit_limit": "0.00",
                "tax_profile": {
                    "tax_rate": "4.0000",
                    "social_fund_rate": "0.0000",
                    "note": "Quarterly turnover tax",
                    "is_active": True,
                },
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        account = Account.objects.get(pk=response.data["id"])
        self.assertTrue(hasattr(account, "tax_profile"))
        self.assertEqual(account.tax_profile.entity_type, AccountTaxProfile.EntityType.ENTREPRENEUR)
        self.assertEqual(account.tax_profile.reporting_period, AccountTaxProfile.ReportingPeriod.QUARTERLY)
        self.assertEqual(account.tax_profile.due_day, 20)
        self.assertEqual(account.tax_profile.tax_rate, Decimal("4.0000"))

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

    def test_delete_transaction_reverts_balance(self):
        transaction = Transaction.objects.create(
            owner=self.user,
            account=self.cash_account,
            category=self.food_category,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("25.50"),
            title="Groceries",
            occurred_on="2026-06-05",
        )
        self.cash_account.current_balance = Decimal("974.50")
        self.cash_account.save(update_fields=["current_balance"])

        response = self.client.delete(
            reverse("api:finance-transaction-detail", kwargs={"pk": transaction.pk})
        )

        self.assertEqual(response.status_code, 204)
        self.cash_account.refresh_from_db()
        self.assertEqual(self.cash_account.current_balance, Decimal("1000.00"))
        self.assertFalse(Transaction.objects.filter(pk=transaction.pk).exists())

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

    def test_dashboard_localizes_system_category_names(self):
        Transaction.objects.create(
            owner=self.user,
            account=self.cash_account,
            category=self.food_category,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("25.50"),
            title="Groceries",
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

        response = self.client.get(
            reverse("api:finance-dashboard"),
            HTTP_X_LOCALE="kg",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["budgets"][0]["category"], "Тамак-аш")
        self.assertEqual(response.data["recent_transactions"][0]["category"], "Тамак-аш")

    def test_workspace_overview_localizes_system_category_names(self):
        Transaction.objects.create(
            owner=self.user,
            account=self.cash_account,
            category=self.food_category,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("25.50"),
            title="Groceries",
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

        response = self.client.get(
            reverse("api:workspace-overview"),
            HTTP_X_LOCALE="kg",
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["budgets"][0]["category"], "Тамак-аш")
        self.assertEqual(response.data["transactions"][0]["category"], "Тамак-аш")

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


class CategorySeedTestCase(TestCase):
    def test_ensure_system_categories_creates_localized_tree(self):
        ensure_system_categories()

        employment_income = Category.objects.get(slug="employment-income", owner__isnull=True)
        salary = Category.objects.get(slug="salary", owner__isnull=True)
        food = Category.objects.get(slug="food", owner__isnull=True)
        groceries = Category.objects.get(slug="groceries", owner__isnull=True)

        self.assertEqual(employment_income.name_ru, "Доход от работы")
        self.assertEqual(employment_income.name_en, "Employment income")
        self.assertEqual(employment_income.name_kg, "Эмгек кирешеси")
        self.assertEqual(salary.parent, employment_income)
        self.assertEqual(groceries.parent, food)
        self.assertTrue(employment_income.is_system)
        self.assertTrue(groceries.is_system)

    def test_ensure_user_finance_setup_creates_base_account_for_new_user(self):
        user = User.objects.create_user(email="empty@example.com", password="testpass123")

        ensure_user_finance_setup(user=user)

        account = Account.objects.get(owner=user)
        self.assertEqual(account.kind, Account.AccountKind.BANK)
        self.assertEqual(account.status, Account.AccountStatus.ACTIVE)
        self.assertEqual(account.current_balance, Decimal("0.00"))
        self.assertEqual(Transaction.objects.filter(owner=user).count(), 0)
        self.assertEqual(Budget.objects.filter(owner=user).count(), 0)
        self.assertGreater(Category.objects.filter(owner__isnull=True, is_system=True).count(), 0)
        self.assertGreater(Currency.objects.filter(is_active=True).count(), 0)

    def test_workspace_overview_repairs_stale_current_balance_from_opening_balance(self):
        self.cash_account.opening_balance = Decimal("50000.00")
        self.cash_account.current_balance = Decimal("0.00")
        self.cash_account.save(update_fields=["opening_balance", "current_balance", "updated_at"])

        overview = build_workspace_overview(user=self.user, locale="ru")

        self.cash_account.refresh_from_db()
        self.assertEqual(self.cash_account.current_balance, Decimal("50000.00"))
        self.assertEqual(overview["summary"]["net_worth"], "50000.00")
        self.assertEqual(overview["accounts"][0]["balance"], "50000.00")


class TaxProfileTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="tax@example.com", password="testpass123")
        self.client.force_authenticate(self.user)
        self.kgs = Currency.objects.create(code="KGS", name="Kyrgyzstani som", symbol="сом", is_default=True)
        self.salary_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.INCOME,
            name="Salary",
            name_ru="Зарплата",
            name_en="Salary",
            name_kg="Айлык",
            slug="salary",
            is_system=True,
        )
        self.tax_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.EXPENSE,
            name="Taxes",
            name_ru="Налоги",
            name_en="Taxes",
            name_kg="Салыктар",
            slug="taxes",
            is_system=True,
        )
        self.ip_account = Account.objects.create(
            owner=self.user,
            currency=self.kgs,
            name="IP Main",
            kind=Account.AccountKind.ENTREPRENEUR,
            opening_balance=Decimal("0.00"),
            current_balance=Decimal("0.00"),
        )

    def test_quarterly_tax_obligation_uses_income_turnover(self):
        Transaction.objects.create(
            owner=self.user,
            account=self.ip_account,
            category=self.salary_category,
            type=Transaction.TransactionType.INCOME,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("40000.00"),
            title="Quarter revenue",
            occurred_on="2026-05-15",
        )
        AccountTaxProfile.objects.create(
            account=self.ip_account,
            entity_type=AccountTaxProfile.EntityType.ENTREPRENEUR,
            template_code=AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4,
            calculation_source=AccountTaxProfile.CalculationSource.TRANSACTIONS,
            reporting_period=AccountTaxProfile.ReportingPeriod.QUARTERLY,
            due_day=20,
            tax_rate=Decimal("4.0000"),
            social_fund_rate=Decimal("0.0000"),
        )

        obligations = build_tax_obligations(user=self.user, today=date.fromisoformat("2026-06-05"))

        self.assertEqual(len(obligations), 1)
        self.assertEqual(obligations[0]["tax_base"], "40000.00")
        self.assertEqual(obligations[0]["tax_amount"], "1600.00")
        self.assertEqual(obligations[0]["total_amount"], "1600.00")
        self.assertEqual(obligations[0]["due_date"], "2026-07-20")

    def test_quarter_boundaries_start_from_january(self):
        self.assertEqual(
            get_period_start(date.fromisoformat("2026-01-10"), AccountTaxProfile.ReportingPeriod.QUARTERLY),
            date.fromisoformat("2026-01-01"),
        )
        self.assertEqual(
            get_period_start(date.fromisoformat("2026-03-31"), AccountTaxProfile.ReportingPeriod.QUARTERLY),
            date.fromisoformat("2026-01-01"),
        )
        self.assertEqual(
            get_period_start(date.fromisoformat("2026-04-01"), AccountTaxProfile.ReportingPeriod.QUARTERLY),
            date.fromisoformat("2026-04-01"),
        )
        self.assertEqual(
            get_period_start(date.fromisoformat("2026-06-30"), AccountTaxProfile.ReportingPeriod.QUARTERLY),
            date.fromisoformat("2026-04-01"),
        )

    def test_quarterly_tax_obligation_uses_apr_to_jun_before_july_boundary(self):
        AccountTaxProfile.objects.create(
            account=self.ip_account,
            entity_type=AccountTaxProfile.EntityType.ENTREPRENEUR,
            template_code=AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4,
            calculation_source=AccountTaxProfile.CalculationSource.MANUAL,
            reporting_period=AccountTaxProfile.ReportingPeriod.QUARTERLY,
            due_day=20,
            tax_rate=Decimal("4.0000"),
            social_fund_rate=Decimal("0.0000"),
            manual_tax_base=Decimal("0.00"),
            manual_tax_amount=Decimal("0.00"),
        )

        obligations = build_tax_obligations(user=self.user, today=date.fromisoformat("2026-06-30"))

        self.assertEqual(obligations[0]["period_start"], "2026-04-01")
        self.assertEqual(obligations[0]["period_end"], "2026-06-30")
        self.assertEqual(obligations[0]["due_date"], "2026-07-20")

    def test_quarterly_tax_obligation_switches_to_next_quarter_on_july_first(self):
        AccountTaxProfile.objects.create(
            account=self.ip_account,
            entity_type=AccountTaxProfile.EntityType.ENTREPRENEUR,
            template_code=AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4,
            calculation_source=AccountTaxProfile.CalculationSource.MANUAL,
            reporting_period=AccountTaxProfile.ReportingPeriod.QUARTERLY,
            due_day=20,
            tax_rate=Decimal("4.0000"),
            social_fund_rate=Decimal("0.0000"),
            manual_tax_base=Decimal("0.00"),
            manual_tax_amount=Decimal("0.00"),
        )

        obligations = build_tax_obligations(user=self.user, today=date.fromisoformat("2026-07-01"))

        self.assertEqual(obligations[0]["period_start"], "2026-07-01")
        self.assertEqual(obligations[0]["period_end"], "2026-09-30")
        self.assertEqual(obligations[0]["due_date"], "2026-10-20")

    def test_quarterly_tax_obligation_becomes_settled_after_linked_payment(self):
        profile = AccountTaxProfile.objects.create(
            account=self.ip_account,
            entity_type=AccountTaxProfile.EntityType.ENTREPRENEUR,
            template_code=AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4,
            calculation_source=AccountTaxProfile.CalculationSource.MANUAL,
            reporting_period=AccountTaxProfile.ReportingPeriod.QUARTERLY,
            due_day=20,
            tax_rate=Decimal("4.0000"),
            social_fund_rate=Decimal("0.0000"),
            manual_tax_base=Decimal("40000.00"),
            manual_tax_amount=Decimal("1600.00"),
        )

        snapshot = build_tax_obligations(user=self.user, today=date.fromisoformat("2026-06-05"))[0]
        Transaction.objects.create(
            owner=self.user,
            account=self.ip_account,
            category=None,
            type=Transaction.TransactionType.EXPENSE,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("1600.00"),
            title="Tax payment",
            occurred_on="2026-06-20",
            external_reference=f"tax-obligation:{self.ip_account.id}:{snapshot['period_start']}:{snapshot['period_end']}:manualgroup:tax",
        )

        obligations = build_tax_obligations(user=self.user, today=date.fromisoformat("2026-06-05"))

        self.assertEqual(profile.account_id, self.ip_account.id)
        self.assertEqual(obligations[0]["payment_status"], "cleared")
        self.assertEqual(obligations[0]["settled_components"], ["tax"])
        self.assertFalse(obligations[0]["can_create_payment"])

    def test_create_tax_transactions_binds_payment_to_selected_quarter(self):
        AccountTaxProfile.objects.create(
            account=self.ip_account,
            entity_type=AccountTaxProfile.EntityType.ENTREPRENEUR,
            template_code=AccountTaxProfile.TemplateCode.KG_IP_SIMPLIFIED_4,
            calculation_source=AccountTaxProfile.CalculationSource.MANUAL,
            reporting_period=AccountTaxProfile.ReportingPeriod.QUARTERLY,
            due_day=20,
            tax_rate=Decimal("4.0000"),
            social_fund_rate=Decimal("0.0000"),
            manual_tax_base=Decimal("40000.00"),
            manual_tax_amount=Decimal("1600.00"),
        )

        response = self.client.post(
            reverse("api:finance-account-create-tax-transactions", args=[self.ip_account.id]),
            {
                "source_account": self.ip_account.id,
                "mode": "tax",
                "status": "cleared",
                "occurred_on": "2026-07-10",
                "obligation_period_start": "2026-04-01",
                "obligation_period_end": "2026-06-30",
                "tax_category": self.tax_category.id,
                "tax_title": "Tax payment",
                "tax_merchant": "Tax Authority",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["obligation"]["period_start"], "2026-04-01")
        self.assertEqual(response.data["obligation"]["period_end"], "2026-06-30")
        self.assertEqual(response.data["obligation"]["due_date"], "2026-07-20")
        self.assertEqual(len(response.data["transactions"]), 1)
        self.assertIn(
            "tax-obligation:"
            f"{self.ip_account.id}:2026-04-01:2026-06-30:",
            response.data["transactions"][0]["external_reference"],
        )


class DepositAccountTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="deposit@example.com", password="testpass123")
        self.client.force_authenticate(self.user)
        self.kgs = Currency.objects.create(code="KGS", name="Kyrgyzstani som", symbol="сом", is_default=True)
        self.income_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.INCOME,
            name="Top Up",
            name_ru="Пополнение",
            name_en="Top Up",
            name_kg="Толуктоо",
            slug="top-up",
            is_system=True,
        )
        self.expense_category = Category.objects.create(
            owner=None,
            kind=Category.CategoryKind.EXPENSE,
            name="Withdrawal",
            name_ru="Снятие",
            name_en="Withdrawal",
            name_kg="Чыгарып алуу",
            slug="withdrawal",
            is_system=True,
        )
        self.cash_account = Account.objects.create(
            owner=self.user,
            currency=self.kgs,
            name="Cash",
            kind=Account.AccountKind.CASH,
            opening_balance=Decimal("50000.00"),
            current_balance=Decimal("50000.00"),
        )

    def test_user_can_create_deposit_account_with_profile(self):
        response = self.client.post(
            reverse("api:finance-account-list"),
            {
                "currency": self.kgs.code,
                "name": "Main deposit",
                "kind": Account.AccountKind.DEPOSIT,
                "status": Account.AccountStatus.ACTIVE,
                "institution": "Aiyl Bank",
                "opening_balance": "100000.00",
                "credit_limit": "0.00",
                "deposit_profile": {
                    "annual_interest_rate": "12.0000",
                    "interest_payout_frequency": "monthly",
                    "day_count_convention": "actual_365",
                    "term_start_date": "2026-01-01",
                    "maturity_date": "2026-12-31",
                    "capitalization_enabled": False,
                    "auto_renewal": False,
                    "allow_top_up": True,
                    "allow_partial_withdrawal": False,
                    "minimum_balance": "1000.00",
                    "note": "Term deposit",
                    "is_active": True,
                },
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        account = Account.objects.get(pk=response.data["id"])
        self.assertEqual(account.current_balance, Decimal("100000.00"))
        self.assertTrue(AccountDepositProfile.objects.filter(account=account, annual_interest_rate="12.0000").exists())

    def test_updating_opening_balance_shifts_current_balance_by_delta(self):
        response = self.client.patch(
            reverse("api:finance-account-detail", args=[self.cash_account.id]),
            {
                "opening_balance": "50000.00",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 200)
        self.cash_account.refresh_from_db()
        self.assertEqual(self.cash_account.opening_balance, Decimal("50000.00"))
        self.assertEqual(self.cash_account.current_balance, Decimal("50000.00"))

    def test_deposit_snapshot_recalculates_interest_after_top_up(self):
        deposit_account = Account.objects.create(
            owner=self.user,
            currency=self.kgs,
            name="Deposit",
            kind=Account.AccountKind.DEPOSIT,
            opening_balance=Decimal("100000.00"),
            current_balance=Decimal("150000.00"),
        )
        profile = AccountDepositProfile.objects.create(
            account=deposit_account,
            annual_interest_rate=Decimal("12.0000"),
            interest_payout_frequency=AccountDepositProfile.InterestPayoutFrequency.MONTHLY,
            day_count_convention=AccountDepositProfile.DayCountConvention.ACTUAL_365,
            term_start_date=date.fromisoformat("2026-01-01"),
            maturity_date=date.fromisoformat("2026-12-31"),
            capitalization_enabled=False,
            allow_top_up=True,
            allow_partial_withdrawal=False,
            minimum_balance=Decimal("0.00"),
        )
        Transaction.objects.create(
            owner=self.user,
            account=self.cash_account,
            destination_account=deposit_account,
            type=Transaction.TransactionType.TRANSFER,
            status=Transaction.TransactionStatus.CLEARED,
            amount=Decimal("50000.00"),
            destination_amount=Decimal("50000.00"),
            title="Deposit top-up",
            occurred_on="2026-01-16",
        )

        snapshot = calculate_deposit_snapshot(
            account=deposit_account,
            profile=profile,
            as_of=date.fromisoformat("2026-01-31"),
        )

        self.assertEqual(snapshot["principal_balance"], "150000.00")
        self.assertEqual(snapshot["accrued_interest"], "1232.88")
        self.assertEqual(snapshot["projected_balance"], "151232.88")

    def test_deposit_without_top_up_rejects_incoming_transfer(self):
        deposit_account = Account.objects.create(
            owner=self.user,
            currency=self.kgs,
            name="Locked deposit",
            kind=Account.AccountKind.DEPOSIT,
            opening_balance=Decimal("100000.00"),
            current_balance=Decimal("100000.00"),
        )
        AccountDepositProfile.objects.create(
            account=deposit_account,
            annual_interest_rate=Decimal("10.0000"),
            interest_payout_frequency=AccountDepositProfile.InterestPayoutFrequency.MONTHLY,
            day_count_convention=AccountDepositProfile.DayCountConvention.ACTUAL_365,
            term_start_date=date.fromisoformat("2026-01-01"),
            allow_top_up=False,
            allow_partial_withdrawal=False,
            minimum_balance=Decimal("0.00"),
        )

        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": self.cash_account.id,
                "destination_account": deposit_account.id,
                "type": Transaction.TransactionType.TRANSFER,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "1000.00",
                "destination_amount": "1000.00",
                "title": "Forbidden top-up",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("destination_account", response.data)

    def test_deposit_without_partial_withdrawal_rejects_expense(self):
        deposit_account = Account.objects.create(
            owner=self.user,
            currency=self.kgs,
            name="Locked expense deposit",
            kind=Account.AccountKind.DEPOSIT,
            opening_balance=Decimal("100000.00"),
            current_balance=Decimal("100000.00"),
        )
        AccountDepositProfile.objects.create(
            account=deposit_account,
            annual_interest_rate=Decimal("10.0000"),
            interest_payout_frequency=AccountDepositProfile.InterestPayoutFrequency.MONTHLY,
            day_count_convention=AccountDepositProfile.DayCountConvention.ACTUAL_365,
            term_start_date=date.fromisoformat("2026-01-01"),
            allow_top_up=True,
            allow_partial_withdrawal=False,
            minimum_balance=Decimal("5000.00"),
        )

        response = self.client.post(
            reverse("api:finance-transaction-list"),
            {
                "account": deposit_account.id,
                "category": self.expense_category.id,
                "type": Transaction.TransactionType.EXPENSE,
                "status": Transaction.TransactionStatus.CLEARED,
                "amount": "100.00",
                "title": "Forbidden withdrawal",
                "occurred_on": "2026-06-05",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn("account", response.data)


class CurrencySyncTestCase(TestCase):
    def setUp(self):
        Currency.objects.create(code="KGS", name="Kyrgyzstani som", symbol="сом")

    @patch("app.currency_sync.requests.get")
    def test_sync_fx_kg_reference_data_creates_currencies_and_rates(self, mock_get):
        mock_get.side_effect = [
            Mock(
                json=Mock(
                    return_value=[
                        {"id": 1, "code": "KGS", "title": "Кыргызский сом"},
                        {"id": 2, "code": "USD", "title": "Доллар США"},
                        {"id": 3, "code": "EUR", "title": "Евро"},
                    ]
                ),
                raise_for_status=Mock(),
            ),
            Mock(
                json=Mock(
                    return_value={
                        "updated_at": "2026-06-05T06:00:00.000000Z",
                        "is_current": 1,
                        "usd": "87.5000",
                        "eur": "96.2500",
                    }
                ),
                raise_for_status=Mock(),
            ),
        ]

        with self.settings(
            FX_KG_API_BASE_URL="https://data.fx.kg/api/v1",
            FX_KG_API_TOKEN="test-token",
            FX_KG_API_TIMEOUT=10,
        ):
            result = sync_fx_kg_reference_data()

        self.assertEqual(result.currencies_synced, 3)
        self.assertEqual(result.rates_synced, 2)
        self.assertEqual(result.effective_date, "2026-06-05")
        self.assertTrue(Currency.objects.filter(code="USD", name="Доллар США", is_active=True).exists())
        self.assertTrue(Currency.objects.filter(code="EUR", name="Евро", is_active=True).exists())
        self.assertTrue(
            ExchangeRate.objects.filter(
                base_currency_id="USD",
                quote_currency_id="KGS",
                source=FX_KG_SOURCE,
                rate="87.5000",
                is_active=True,
            ).exists()
        )

    @patch("app.currency_sync.requests.get")
    def test_sync_fx_kg_reference_data_updates_existing_rates_in_place(self, mock_get):
        usd = Currency.objects.create(code="USD", name="US Dollar", symbol="$")
        kgs = Currency.objects.get(code="KGS")
        ExchangeRate.objects.create(
            base_currency=usd,
            quote_currency=kgs,
            rate="87.1000",
            rate_date="2026-06-05",
            source=FX_KG_SOURCE,
            is_active=True,
        )

        mock_get.side_effect = [
            Mock(
                json=Mock(
                    return_value=[
                        {"id": 1, "code": "KGS", "title": "Кыргызский сом"},
                        {"id": 2, "code": "USD", "title": "Доллар США"},
                    ]
                ),
                raise_for_status=Mock(),
            ),
            Mock(
                json=Mock(
                    return_value={
                        "updated_at": "2026-06-05T18:00:00.000000Z",
                        "is_current": 1,
                        "usd": "88.0000",
                    }
                ),
                raise_for_status=Mock(),
            ),
        ]

        with self.settings(
            FX_KG_API_BASE_URL="https://data.fx.kg/api/v1",
            FX_KG_API_TOKEN="test-token",
            FX_KG_API_TIMEOUT=10,
        ):
            sync_fx_kg_reference_data()

        self.assertEqual(
            ExchangeRate.objects.filter(
                base_currency_id="USD",
                quote_currency_id="KGS",
                rate_date="2026-06-05",
                source=FX_KG_SOURCE,
            ).count(),
            1,
        )
        self.assertTrue(
            ExchangeRate.objects.filter(
                base_currency_id="USD",
                quote_currency_id="KGS",
                rate="88.0000",
                is_active=True,
                source=FX_KG_SOURCE,
            ).exists()
        )

    @patch("app.currency_sync.requests.get")
    def test_sync_fx_kg_reference_data_ignores_uppercase_meta_fields(self, mock_get):
        mock_get.side_effect = [
            Mock(
                json=Mock(
                    return_value=[
                        {"id": 1, "code": "KGS", "title": "Кыргызский сом"},
                        {"id": 2, "code": "USD", "title": "Доллар США"},
                    ]
                ),
                raise_for_status=Mock(),
            ),
            Mock(
                json=Mock(
                    return_value={
                        "CREATED_AT": "2026-06-05T06:00:00.000000Z",
                        "UPDATED_AT": "2026-06-05T18:00:00.000000Z",
                        "IS_CURRENT": 1,
                        "USD": "87.5000",
                    }
                ),
                raise_for_status=Mock(),
            ),
        ]

        with self.settings(
            FX_KG_API_BASE_URL="https://data.fx.kg/api/v1",
            FX_KG_API_TOKEN="test-token",
            FX_KG_API_TIMEOUT=10,
        ):
            result = sync_fx_kg_reference_data()

        self.assertEqual(result.rates_synced, 1)
        self.assertTrue(
            ExchangeRate.objects.filter(
                base_currency_id="USD",
                quote_currency_id="KGS",
                rate="87.5000",
                is_active=True,
                source=FX_KG_SOURCE,
            ).exists()
        )


class CryptoReferenceSeedTestCase(TestCase):
    def test_seed_crypto_reference_data_creates_popular_assets_and_networks(self):
        result = ensure_default_crypto_reference_data()

        self.assertGreaterEqual(result.networks_synced, 10)
        self.assertGreaterEqual(result.assets_synced, 50)
        self.assertGreaterEqual(result.links_synced, 30)
        self.assertTrue(CryptoNetwork.objects.filter(owner__isnull=True, code="bitcoin", is_system=True).exists())
        self.assertTrue(CryptoAsset.objects.filter(owner__isnull=True, symbol="BTC", is_system=True).exists())
        self.assertTrue(
            CryptoAssetNetwork.objects.filter(
                asset__symbol="USDT",
                network__code="tron",
                token_standard="TRC20",
            ).exists()
        )


class CryptoAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(email="crypto@example.com", password="testpass123")
        self.other_user = User.objects.create_user(email="other-crypto@example.com", password="testpass123")
        self.client.force_authenticate(self.user)
        self.usd = Currency.objects.create(code="USD", name="US Dollar", symbol="$", is_default=True)
        ensure_default_crypto_reference_data()

    def test_user_can_list_system_crypto_assets(self):
        response = self.client.get(reverse("api:finance-crypto-asset-list"))

        self.assertEqual(response.status_code, 200)
        self.assertGreaterEqual(len(response.data), 50)

    def test_user_can_create_custom_crypto_asset(self):
        response = self.client.post(
            reverse("api:finance-crypto-asset-list"),
            {
                "symbol": "MYT",
                "name": "My Token",
                "slug": "my-token",
                "asset_type": CryptoAsset.AssetType.TOKEN,
                "decimals": 18,
                "description": "Private token",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 201)
        created_asset = CryptoAsset.objects.get(pk=response.data["id"])
        self.assertEqual(created_asset.owner, self.user)
        self.assertFalse(created_asset.is_system)

    def test_user_can_create_wallet_and_holding(self):
        network = CryptoNetwork.objects.get(code="ethereum", owner__isnull=True)
        asset = CryptoAsset.objects.get(symbol="ETH", owner__isnull=True)
        asset_network = CryptoAssetNetwork.objects.get(asset=asset, network=network)

        wallet_response = self.client.post(
            reverse("api:finance-crypto-wallet-list"),
            {
                "network": network.id,
                "name": "Main ETH Wallet",
                "wallet_type": "software",
                "provider": "MetaMask",
                "address": "0x1234567890abcdef1234567890abcdef12345678",
            },
            format="json",
        )
        self.assertEqual(wallet_response.status_code, 201)

        holding_response = self.client.post(
            reverse("api:finance-crypto-holding-list"),
            {
                "wallet": wallet_response.data["id"],
                "asset": asset.id,
                "asset_network": asset_network.id,
                "balance": "1.250000000000000000",
                "available_balance": "1.100000000000000000",
                "locked_balance": "0.150000000000000000",
                "price_currency": self.usd.code,
            },
            format="json",
        )
        self.assertEqual(holding_response.status_code, 201)
        self.assertTrue(CryptoHolding.objects.filter(wallet_id=wallet_response.data["id"], asset=asset).exists())

    def test_user_cannot_use_other_users_custom_network(self):
        network = CryptoNetwork.objects.create(
            owner=self.other_user,
            name="Private EVM",
            code="private-evm",
            protocol="ERC20",
            native_symbol="PRV",
        )

        response = self.client.post(
            reverse("api:finance-crypto-wallet-list"),
            {
                "network": network.id,
                "name": "Invalid Wallet",
                "wallet_type": "software",
            },
            format="json",
        )

        self.assertEqual(response.status_code, 400)

    @patch("backend.app.views.fetch_crypto_market_snapshot")
    def test_market_snapshot_falls_back_to_okx_when_binance_errors(self, fetch_snapshot_mock):
        fetch_snapshot_mock.side_effect = [
            CryptoMarketDataError("Binance request failed: 451 Client Error"),
            CryptoMarketSnapshot(
                provider=CRYPTO_MARKET_PROVIDER_OKX,
                assets=[
                    {
                        "symbol": "BTC",
                        "name": "Bitcoin",
                        "price": "65000.00000000",
                        "price_change_24h": "1.25",
                        "quote_currency": "USDT",
                        "provider": CRYPTO_MARKET_PROVIDER_OKX,
                        "last_updated": timezone.now().isoformat(),
                    }
                ],
                fetched_at=timezone.now().isoformat(),
            ),
        ]

        response = self.client.get(reverse("api:finance-market-snapshot"), {"provider": "binance"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["provider"], CRYPTO_MARKET_PROVIDER_OKX)
        self.assertEqual(len(response.data["crypto_assets"]), 1)
        self.assertIn("Binance unavailable", response.data["provider_error"])
        self.assertEqual(fetch_snapshot_mock.call_args_list[0].args[0], CRYPTO_MARKET_PROVIDER_BINANCE)
        self.assertEqual(fetch_snapshot_mock.call_args_list[1].args[0], CRYPTO_MARKET_PROVIDER_OKX)

    @patch("backend.app.views.fetch_crypto_market_snapshot")
    def test_market_snapshot_falls_back_to_okx_when_binance_returns_no_assets(self, fetch_snapshot_mock):
        fetch_snapshot_mock.side_effect = [
            CryptoMarketSnapshot(
                provider=CRYPTO_MARKET_PROVIDER_BINANCE,
                assets=[],
                fetched_at=timezone.now().isoformat(),
            ),
            CryptoMarketSnapshot(
                provider=CRYPTO_MARKET_PROVIDER_OKX,
                assets=[
                    {
                        "symbol": "ETH",
                        "name": "Ethereum",
                        "price": "3200.00000000",
                        "price_change_24h": "0.75",
                        "quote_currency": "USDT",
                        "provider": CRYPTO_MARKET_PROVIDER_OKX,
                        "last_updated": timezone.now().isoformat(),
                    }
                ],
                fetched_at=timezone.now().isoformat(),
            ),
        ]

        response = self.client.get(reverse("api:finance-market-snapshot"), {"provider": "binance"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["provider"], CRYPTO_MARKET_PROVIDER_OKX)
        self.assertEqual(len(response.data["crypto_assets"]), 1)
        self.assertIn("switched to OKX", response.data["provider_error"])

    @patch("backend.app.views.sync_fx_kg_reference_data")
    def test_exchange_rates_list_triggers_sync_when_rates_missing(self, sync_rates_mock):
        ExchangeRate.objects.all().delete()

        def seed_rates():
            ExchangeRate.objects.create(
                base_currency=self.usd,
                quote_currency=Currency.objects.create(code="KGS", name="Kyrgyzstani som", symbol="сом"),
                rate=Decimal("87.5000"),
                rate_date=date.fromisoformat("2026-06-07"),
                source=FX_KG_SOURCE,
                is_active=True,
            )
            return Mock()

        sync_rates_mock.side_effect = seed_rates

        response = self.client.get(reverse("api:finance-exchange-rate-list"), {"quote_currency": "KGS"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["base_currency"]["code"], "USD")
        sync_rates_mock.assert_called_once()

    @patch("backend.app.views.fetch_crypto_market_snapshot")
    @patch("backend.app.views.sync_fx_kg_reference_data")
    def test_market_snapshot_triggers_fx_sync_when_fiat_rates_missing(self, sync_rates_mock, fetch_snapshot_mock):
        ExchangeRate.objects.all().delete()
        kgs = Currency.objects.create(code="KGS", name="Kyrgyzstani som", symbol="сом")

        def seed_rates():
            ExchangeRate.objects.create(
                base_currency=self.usd,
                quote_currency=kgs,
                rate=Decimal("87.5000"),
                rate_date=date.fromisoformat("2026-06-07"),
                source=FX_KG_SOURCE,
                is_active=True,
            )
            return Mock()

        sync_rates_mock.side_effect = seed_rates
        fetch_snapshot_mock.return_value = CryptoMarketSnapshot(
            provider=CRYPTO_MARKET_PROVIDER_BINANCE,
            assets=[],
            fetched_at=timezone.now().isoformat(),
        )

        response = self.client.get(reverse("api:finance-market-snapshot"), {"provider": "binance", "quote_currency": "KGS"})

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["fiat_rates"]), 1)
        self.assertEqual(response.data["fiat_rates"][0]["base_currency"]["code"], "USD")
        sync_rates_mock.assert_called_once()
