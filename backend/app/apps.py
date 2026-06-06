from django.apps import AppConfig


class FinanceAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"
    verbose_name = "Финансы"

    def ready(self) -> None:
        from .schema_compat import ensure_dev_account_schema_compatibility

        ensure_dev_account_schema_compatibility()
