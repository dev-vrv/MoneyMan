from django.apps import AppConfig
from django.db.models.signals import post_migrate


class FinanceAppConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "app"
    verbose_name = "Финансы"

    def ready(self) -> None:
        from .schema_compat import ensure_dev_account_schema_compatibility

        post_migrate.connect(
            lambda **kwargs: ensure_dev_account_schema_compatibility(),
            sender=self,
            dispatch_uid="app.ensure_dev_account_schema_compatibility",
        )
