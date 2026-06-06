import sys
from threading import Lock

from django.conf import settings
from django.db import connection
from django.db.utils import OperationalError, ProgrammingError


_schema_repair_lock = Lock()
_schema_repair_done = False


def ensure_dev_account_schema_compatibility() -> None:
    global _schema_repair_done

    if _schema_repair_done or not settings.DEBUG:
        return

    if not any(arg in sys.argv for arg in ("runserver", "gunicorn", "uvicorn", "daphne")):
        return

    with _schema_repair_lock:
        if _schema_repair_done:
            return

        try:
            with connection.cursor() as cursor:
                cursor.execute(
                    """
                    SELECT column_name
                    FROM information_schema.columns
                    WHERE table_schema = 'public' AND table_name = 'app_account'
                    """
                )
                existing_columns = {row[0] for row in cursor.fetchall()}
                repair_statements: list[str] = []

                if "icon" not in existing_columns:
                    repair_statements.append(
                        "ALTER TABLE public.app_account "
                        "ADD COLUMN icon varchar(32) NOT NULL DEFAULT ''"
                    )

                if "color" not in existing_columns:
                    repair_statements.append(
                        "ALTER TABLE public.app_account "
                        "ADD COLUMN color varchar(16) NOT NULL DEFAULT 'emerald'"
                    )

                for statement in repair_statements:
                    cursor.execute(statement)
        except (OperationalError, ProgrammingError):
            return

        _schema_repair_done = True
