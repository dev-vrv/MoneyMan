from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("subscribes", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="subscriptionplan",
            name="billing_mode",
            field=models.CharField(
                choices=[("one_time", "One-time"), ("recurring", "Recurring")],
                default="recurring",
                max_length=16,
            ),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="freedompay_payment_page_id",
            field=models.CharField(blank=True, default="", max_length=128),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="freedompay_product_id",
            field=models.CharField(blank=True, default="", max_length=128),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="grace_period_days",
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="is_public",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="price_currency",
            field=models.CharField(default="USD", max_length=3),
        ),
        migrations.AddField(
            model_name="subscriptionplan",
            name="trial_days",
            field=models.PositiveSmallIntegerField(default=0),
        ),
        migrations.CreateModel(
            name="UserSubscription",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("status", models.CharField(choices=[("pending", "Pending"), ("active", "Active"), ("past_due", "Past due"), ("canceled", "Canceled"), ("expired", "Expired")], default="pending", max_length=16)),
                ("started_at", models.DateTimeField(blank=True, null=True)),
                ("expires_at", models.DateTimeField(blank=True, null=True)),
                ("trial_ends_at", models.DateTimeField(blank=True, null=True)),
                ("next_billing_at", models.DateTimeField(blank=True, null=True)),
                ("last_payment_at", models.DateTimeField(blank=True, null=True)),
                ("canceled_at", models.DateTimeField(blank=True, null=True)),
                ("cancel_at_period_end", models.BooleanField(default=False)),
                ("auto_renew", models.BooleanField(default=True)),
                ("external_customer_id", models.CharField(blank=True, default="", max_length=128)),
                ("external_subscription_id", models.CharField(blank=True, default="", max_length=128)),
                ("plan", models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, related_name="subscriptions", to="subscribes.subscriptionplan")),
                ("user", models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name="subscriptions", to=settings.AUTH_USER_MODEL)),
            ],
            options={
                "verbose_name": "User subscription",
                "verbose_name_plural": "User subscriptions",
                "ordering": ("-created_at",),
            },
        ),
        migrations.AddIndex(
            model_name="usersubscription",
            index=models.Index(fields=["user", "status"], name="subscribes_u_user_id_05ea4b_idx"),
        ),
        migrations.AddIndex(
            model_name="usersubscription",
            index=models.Index(fields=["external_subscription_id"], name="subscribes_u_externa_a42955_idx"),
        ),
    ]
