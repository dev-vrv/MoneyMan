from django.urls import include, path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenRefreshView

from backend.common.views import (
    CurrentUserView,
    HealthCheckView,
    LoginView,
    LogoutView,
    RegisterView,
    WorkspaceOverviewView,
)

app_name = "api"

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("auth/register/", RegisterView.as_view(), name="auth-register"),
    path("auth/login/", LoginView.as_view(), name="auth-login"),
    path("auth/logout/", LogoutView.as_view(), name="auth-logout"),
    path("auth/me/", CurrentUserView.as_view(), name="auth-me"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("workspace/overview/", WorkspaceOverviewView.as_view(), name="workspace-overview"),
    path("finance/", include("app.urls")),
    path("", include("mails.urls")),
    path("payments/", include("payments.urls")),
    path("subscriptions/", include("subscribes.urls")),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="api:schema"), name="docs"),
]
