from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("common", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="userprofile",
            name="phone",
            field=models.CharField(blank=True, default="", max_length=32),
        ),
    ]
