from django.urls import path
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

from backend.common.views import HealthCheckView

app_name = "api"

urlpatterns = [
    path("health/", HealthCheckView.as_view(), name="health"),
    path("auth/jwt/create/", TokenObtainPairView.as_view(), name="token-create"),
    path("auth/jwt/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("schema/", SpectacularAPIView.as_view(), name="schema"),
    path("docs/", SpectacularSwaggerView.as_view(url_name="api:schema"), name="docs"),
]
