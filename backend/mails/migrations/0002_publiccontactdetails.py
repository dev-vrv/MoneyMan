from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("mails", "0001_initial"),
    ]

    operations = [
        migrations.CreateModel(
            name="PublicContactDetails",
            fields=[
                ("id", models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                ("locale", models.CharField(choices=[("en", "English"), ("ru", "Russian"), ("kg", "Kyrgyz")], max_length=8, unique=True)),
                ("phone_primary", models.CharField(blank=True, default="", max_length=64)),
                ("phone_secondary", models.CharField(blank=True, default="", max_length=64)),
                ("email", models.EmailField(blank=True, default="", max_length=254)),
                ("address", models.CharField(blank=True, default="", max_length=255)),
                ("working_hours", models.CharField(blank=True, default="", max_length=160)),
                ("telegram_url", models.URLField(blank=True, default="")),
                ("whatsapp_url", models.URLField(blank=True, default="")),
                ("instagram_url", models.URLField(blank=True, default="")),
                ("youtube_url", models.URLField(blank=True, default="")),
                ("facebook_url", models.URLField(blank=True, default="")),
                ("linkedin_url", models.URLField(blank=True, default="")),
                ("tiktok_url", models.URLField(blank=True, default="")),
            ],
            options={
                "verbose_name": "Public contact details",
                "verbose_name_plural": "Public contact details",
                "ordering": ("locale",),
            },
        ),
    ]
