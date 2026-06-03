try:
    from backend.celery import app as celery_app
except ModuleNotFoundError:  # pragma: no cover - local tooling fallback
    celery_app = None

__all__ = ("celery_app",)
