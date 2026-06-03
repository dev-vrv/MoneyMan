from django.contrib import admin

from .models import Budget, FinancialAccount, Transaction, TransactionCategory, UserProfile


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ("user", "phone", "created_at")
    search_fields = ("user__email", "phone")


@admin.register(FinancialAccount)
class FinancialAccountAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "kind", "balance", "currency")
    list_filter = ("kind", "currency")
    search_fields = ("name", "owner__email", "institution")


@admin.register(TransactionCategory)
class TransactionCategoryAdmin(admin.ModelAdmin):
    list_display = ("name", "owner", "kind")
    list_filter = ("kind",)
    search_fields = ("name", "owner__email")


@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ("title", "owner", "account", "amount", "status", "transaction_date")
    list_filter = ("status", "transaction_date", "category__kind")
    search_fields = ("title", "merchant", "owner__email", "account__name")


@admin.register(Budget)
class BudgetAdmin(admin.ModelAdmin):
    list_display = ("category", "owner", "monthly_limit", "spent", "alert_threshold")
    list_filter = ("alert_threshold",)
    search_fields = ("category__name", "owner__email")
