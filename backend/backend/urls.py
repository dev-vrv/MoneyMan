from django.contrib import admin
from django.urls import include, path

admin.site.site_header = "Администрирование Fin Man"
admin.site.site_title = "Fin Man Admin"
admin.site.index_title = "Панель управления"

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include("backend.api_urls", namespace="api")),
]
