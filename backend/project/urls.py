from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import health


# Define the schema view
schema_view = get_schema_view(
    openapi.Info(
        title="Blood Donation Backend API",
        default_version="v1",
    ),
    public=True,
    permission_classes=(permissions.AllowAny,),
    authentication_classes=[JWTAuthentication],
)

urlpatterns = [
    path("admin/", admin.site.urls),
    # Health Check Endpoints
    path("health/live/", health.health_live, name="health-live"),
    path("health/ready/", health.health_ready, name="health-ready"),
    path("health/status/", health.health_status, name="health-status"),
    # API Endpoints
    path("api/", include("users.urls")),
    path('api/', include('sitesetting.urls')),
    # API Documentation
    re_path(r"doc/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
    re_path(r"redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    # CKEditor
    path("ckeditor/", include("ckeditor_uploader.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
