from datetime import timedelta
from pathlib import Path

import environ

BASE_DIR = Path(__file__).resolve().parent.parent
ROOT_DIR = BASE_DIR.parent

env = environ.Env()
environ.Env.read_env(ROOT_DIR / ".env")

SECRET_KEY = env("DJANGO_SECRET_KEY", default="django-insecure-change-me")
DEBUG = env.bool("DJANGO_DEBUG", default=False)

ALLOWED_HOSTS = env.list("DJANGO_ALLOWED_HOSTS", default=["localhost", "127.0.0.1"])
CSRF_TRUSTED_ORIGINS = env.list(
    "DJANGO_CSRF_TRUSTED_ORIGINS",
    default=["http://localhost", "http://127.0.0.1"],
)
CORS_ALLOWED_ORIGINS = env.list(
    "DJANGO_CORS_ALLOWED_ORIGINS",
    default=["http://localhost", "http://127.0.0.1"],
)
CORS_ALLOW_CREDENTIALS = True

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "drf_spectacular",
    "backend.common",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "backend.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "backend.wsgi.application"
ASGI_APPLICATION = "backend.asgi.application"

DATABASES = {
    "default": env.db(
        "DATABASE_URL",
        default=(
            f"postgresql://{env('POSTGRES_USER', default='fin_man')}:"
            f"{env('POSTGRES_PASSWORD', default='fin_man')}@"
            f"{env('POSTGRES_HOST', default='localhost')}:"
            f"{env('POSTGRES_PORT', default='5432')}/"
            f"{env('POSTGRES_DB', default='fin_man')}"
        ),
    )
}
DATABASES["default"]["ATOMIC_REQUESTS"] = True

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = env("DJANGO_TIME_ZONE", default="UTC")
USE_I18N = True
USE_TZ = True

STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": (
        "rest_framework_simplejwt.authentication.JWTAuthentication",
    ),
    "DEFAULT_PERMISSION_CLASSES": (
        "rest_framework.permissions.IsAuthenticated",
    ),
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "PAGE_SIZE": 20,
}

SPECTACULAR_SETTINGS = {
    "TITLE": "Fin Man API",
    "DESCRIPTION": "API for the Fin Man financial management platform.",
    "VERSION": "1.0.0",
}

SIMPLE_JWT = {
    "ACCESS_TOKEN_LIFETIME": timedelta(
        minutes=env.int("ACCESS_TOKEN_LIFETIME_MINUTES", default=15)
    ),
    "REFRESH_TOKEN_LIFETIME": timedelta(
        days=env.int("REFRESH_TOKEN_LIFETIME_DAYS", default=7)
    ),
    "ROTATE_REFRESH_TOKENS": True,
    "BLACKLIST_AFTER_ROTATION": True,
    "UPDATE_LAST_LOGIN": True,
}

CELERY_BROKER_URL = env("REDIS_URL", default="redis://localhost:6379/0")
CELERY_RESULT_BACKEND = CELERY_BROKER_URL
CELERY_ACCEPT_CONTENT = ["json"]
CELERY_TASK_SERIALIZER = "json"
CELERY_RESULT_SERIALIZER = "json"
CELERY_TIMEZONE = TIME_ZONE

SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_CONTENT_TYPE_NOSNIFF = True
X_FRAME_OPTIONS = "DENY"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
