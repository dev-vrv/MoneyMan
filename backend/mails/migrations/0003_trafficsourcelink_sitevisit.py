from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("mails", "0002_publiccontactdetails"),
    ]

    operations = [
        migrations.CreateModel(
            name="TrafficSourceLink",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("name", models.CharField(max_length=120)),
                ("code", models.SlugField(max_length=64, unique=True)),
                ("target_path", models.CharField(blank=True, default="/", max_length=255)),
                ("locale", models.CharField(blank=True, default="", max_length=8)),
                ("utm_source", models.CharField(blank=True, default="", max_length=120)),
                ("utm_medium", models.CharField(blank=True, default="", max_length=120)),
                ("utm_campaign", models.CharField(blank=True, default="", max_length=160)),
                ("utm_content", models.CharField(blank=True, default="", max_length=160)),
                ("utm_term", models.CharField(blank=True, default="", max_length=160)),
                ("notes", models.TextField(blank=True, default="")),
                ("is_active", models.BooleanField(default=True)),
            ],
            options={
                "verbose_name": "Traffic source link",
                "verbose_name_plural": "Traffic source links",
                "ordering": ("name", "code"),
            },
        ),
        migrations.CreateModel(
            name="SiteVisit",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("tracking_code", models.CharField(blank=True, default="", max_length=64)),
                ("locale", models.CharField(blank=True, default="", max_length=8)),
                ("path", models.CharField(blank=True, default="", max_length=255)),
                ("landing_url", models.URLField(blank=True, default="", max_length=600)),
                ("referrer_url", models.URLField(blank=True, default="", max_length=600)),
                ("referrer_host", models.CharField(blank=True, default="", max_length=255)),
                ("utm_source", models.CharField(blank=True, default="", max_length=120)),
                ("utm_medium", models.CharField(blank=True, default="", max_length=120)),
                ("utm_campaign", models.CharField(blank=True, default="", max_length=160)),
                ("utm_content", models.CharField(blank=True, default="", max_length=160)),
                ("utm_term", models.CharField(blank=True, default="", max_length=160)),
                ("ip_address", models.GenericIPAddressField(blank=True, null=True)),
                ("user_agent", models.CharField(blank=True, default="", max_length=512)),
                (
                    "source_link",
                    models.ForeignKey(
                        blank=True,
                        null=True,
                        on_delete=django.db.models.deletion.SET_NULL,
                        related_name="visits",
                        to="mails.trafficsourcelink",
                    ),
                ),
            ],
            options={
                "verbose_name": "Site visit",
                "verbose_name_plural": "Site visits",
                "ordering": ("-created_at",),
                "indexes": [
                    models.Index(fields=["created_at"], name="mails_sitev_created_f3343e_idx"),
                    models.Index(fields=["tracking_code"], name="mails_sitev_trackin_c5a6ea_idx"),
                    models.Index(fields=["referrer_host"], name="mails_sitev_referre_331432_idx"),
                    models.Index(fields=["locale"], name="mails_sitev_locale_c93e07_idx"),
                ],
            },
        ),
    ]
