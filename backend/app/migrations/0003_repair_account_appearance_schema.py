from django.db import migrations


ACCOUNT_APPEARANCE_REPAIR_SQL = """
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'public' AND table_name = 'app_account'
    ) THEN
        ALTER TABLE public.app_account
            ADD COLUMN IF NOT EXISTS icon varchar(32);

        ALTER TABLE public.app_account
            ADD COLUMN IF NOT EXISTS color varchar(16);

        UPDATE public.app_account
        SET icon = ''
        WHERE icon IS NULL;

        UPDATE public.app_account
        SET color = 'emerald'
        WHERE color IS NULL OR color = '';

        ALTER TABLE public.app_account
            ALTER COLUMN icon SET NOT NULL,
            ALTER COLUMN color SET NOT NULL,
            ALTER COLUMN color SET DEFAULT 'emerald';
    END IF;
END $$;
"""


class Migration(migrations.Migration):

    dependencies = [
        ("app", "0002_initial"),
    ]

    operations = [
        migrations.RunSQL(
            sql=ACCOUNT_APPEARANCE_REPAIR_SQL,
            reverse_sql=migrations.RunSQL.noop,
        ),
    ]
