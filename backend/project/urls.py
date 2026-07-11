from django.contrib import admin
from django.urls import path, include, re_path
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.authentication import JWTAuthentication
from . import health

api_patterns = [
    path("", include("users.urls")),
    path("", include("sitesetting.urls")),
]

urlpatterns = [
    path("admin/", admin.site.urls),
    # Health Check Endpoints
    path("health/live/", health.health_live, name="health-live"),
    path("health/ready/", health.health_ready, name="health-ready"),
    path("health/status/", health.health_status, name="health-status"),
    # Versioned API (canonical)
    path("api/v1/", include((api_patterns, "v1"))),
    # Legacy unversioned mount kept for existing clients — prefer /api/v1/
    path("api/", include(api_patterns)),
]

if settings.API_DOCS_ENABLED:
    schema_view = get_schema_view(
        openapi.Info(
            title="Blood Donation Backend API",
            default_version="v1",
            description="REST API for the blood donation platform. "
                        "Authenticate with 'Bearer <access_token>'.",
        ),
        public=True,
        permission_classes=(permissions.AllowAny,),
        authentication_classes=[JWTAuthentication],
    )
    urlpatterns += [
        re_path(r"doc/$", schema_view.with_ui("swagger", cache_timeout=0), name="schema-swagger-ui"),
        re_path(r"redoc/$", schema_view.with_ui("redoc", cache_timeout=0), name="schema-redoc"),
    ]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
