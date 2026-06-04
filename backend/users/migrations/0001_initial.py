from django.db import migrations, models
from django.utils import timezone


def create_or_align_user_table(apps, schema_editor):
    existing_tables = set(schema_editor.connection.introspection.table_names())

    from users.models import User

    if "auth_user" not in existing_tables:
        schema_editor.create_model(User)
        return

    with schema_editor.connection.cursor() as cursor:
        auth_user_columns = {
            column.name
            for column in schema_editor.connection.introspection.get_table_description(
                cursor,
                "auth_user",
            )
        }
    if "phone" not in auth_user_columns:
        schema_editor.add_field(User, User._meta.get_field("phone"))


def normalize_existing_auth_users(apps, schema_editor):
    existing_tables = set(schema_editor.connection.introspection.table_names())
    if "auth_user" not in existing_tables:
        return

    User = apps.get_model("users", "User")

    profile_phones = {}
    if "common_userprofile" in existing_tables:
        with schema_editor.connection.cursor() as cursor:
            cursor.execute("SELECT user_id, phone FROM common_userprofile")
            profile_phones = {
                user_id: (phone or "").strip() for user_id, phone in cursor.fetchall()
            }

    duplicates = {}
    users_without_email = []

    for user in User.objects.all().only("id", "email", "username", "phone"):
        normalized_email = (user.email or "").strip().lower()
        normalized_username = (user.username or "").strip() or normalized_email
        normalized_phone = (user.phone or "").strip() or profile_phones.get(user.id, "")

        if not normalized_email:
            if normalized_username and "@" in normalized_username:
                normalized_email = normalized_username.lower()
            else:
                users_without_email.append(user.id)
                continue

        duplicates.setdefault(normalized_email, []).append(user.id)

        pending_updates = []
        if user.email != normalized_email:
            user.email = normalized_email
            pending_updates.append("email")
        if user.username != normalized_username:
            user.username = normalized_username
            pending_updates.append("username")
        if user.phone != normalized_phone:
            user.phone = normalized_phone
            pending_updates.append("phone")

        if pending_updates:
            user.save(update_fields=pending_updates)

    if users_without_email:
        raise RuntimeError(
            "Cannot switch to the custom user model because some auth_user rows "
            f"do not have an email-compatible identifier: {users_without_email}."
        )

    duplicated_emails = {
        email: ids for email, ids in duplicates.items() if email and len(ids) > 1
    }
    if duplicated_emails:
        raise RuntimeError(
            "Cannot enforce a unique email constraint for auth_user. "
            f"Resolve duplicate emails first: {duplicated_emails}."
        )


class Migration(migrations.Migration):
    initial = True

    dependencies = [
        ("auth", "0012_alter_user_first_name_max_length"),
    ]

    operations = [
        migrations.SeparateDatabaseAndState(
            database_operations=[
                migrations.RunPython(
                    create_or_align_user_table,
                    migrations.RunPython.noop,
                ),
            ],
            state_operations=[
                migrations.CreateModel(
                    name="User",
                    fields=[
                        (
                            "id",
                            models.BigAutoField(
                                auto_created=True,
                                primary_key=True,
                                serialize=False,
                                verbose_name="ID",
                            ),
                        ),
                        ("password", models.CharField(max_length=128, verbose_name="password")),
                        (
                            "last_login",
                            models.DateTimeField(
                                blank=True,
                                null=True,
                                verbose_name="last login",
                            ),
                        ),
                        (
                            "is_superuser",
                            models.BooleanField(
                                default=False,
                                help_text="Designates that this user has all permissions without explicitly assigning them.",
                                verbose_name="superuser status",
                            ),
                        ),
                        (
                            "first_name",
                            models.CharField(
                                blank=True,
                                max_length=150,
                                verbose_name="first name",
                            ),
                        ),
                        (
                            "last_name",
                            models.CharField(
                                blank=True,
                                max_length=150,
                                verbose_name="last name",
                            ),
                        ),
                        (
                            "is_staff",
                            models.BooleanField(
                                default=False,
                                help_text="Designates whether the user can log into this admin site.",
                                verbose_name="staff status",
                            ),
                        ),
                        (
                            "is_active",
                            models.BooleanField(
                                default=True,
                                help_text="Designates whether this user should be treated as active. Unselect this instead of deleting accounts.",
                                verbose_name="active",
                            ),
                        ),
                        (
                            "date_joined",
                            models.DateTimeField(
                                default=timezone.now,
                                verbose_name="date joined",
                            ),
                        ),
                        (
                            "username",
                            models.CharField(
                                blank=True,
                                help_text="Optional public identifier. Defaults to the email address.",
                                max_length=150,
                                unique=True,
                                verbose_name="username",
                            ),
                        ),
                        (
                            "email",
                            models.EmailField(
                                max_length=254,
                                unique=True,
                                verbose_name="email address",
                            ),
                        ),
                        (
                            "phone",
                            models.CharField(blank=True, default="", max_length=32),
                        ),
                        (
                            "groups",
                            models.ManyToManyField(
                                blank=True,
                                db_table="auth_user_groups",
                                help_text="The groups this user belongs to.",
                                related_name="custom_users",
                                related_query_name="custom_user",
                                to="auth.group",
                                verbose_name="groups",
                            ),
                        ),
                        (
                            "user_permissions",
                            models.ManyToManyField(
                                blank=True,
                                db_table="auth_user_user_permissions",
                                help_text="Specific permissions for this user.",
                                related_name="custom_users",
                                related_query_name="custom_user",
                                to="auth.permission",
                                verbose_name="user permissions",
                            ),
                        ),
                    ],
                    options={
                        "verbose_name": "user",
                        "verbose_name_plural": "users",
                        "db_table": "auth_user",
                    },
                ),
            ],
        ),
        migrations.RunPython(
            normalize_existing_auth_users,
            migrations.RunPython.noop,
        ),
    ]
