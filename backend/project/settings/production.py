"""
Production settings for blood donation backend.
Maximum security and performance optimizations.
"""

from django.core.exceptions import ImproperlyConfigured

from .base import *

# Production mode - DEBUG must be False
DEBUG = False

# Fail fast on insecure configuration
if SECRET_KEY == 'INSECURE-CHANGE-ME' or len(SECRET_KEY) < 32:
    raise ImproperlyConfigured(
        "SECRET_KEY must be set to a strong unique value in production "
        "(set the SECRET_KEY environment variable)."
    )
if OTP_DEBUG_EXPOSE:
    raise ImproperlyConfigured("OTP_DEBUG_EXPOSE must be disabled in production.")

# Security Headers - HTTPS enforcement
# Configurable so HTTP-only deployments (TLS terminated upstream, or an
# internal network) can opt out. Default stays secure.
SECURE_SSL_REDIRECT = config('SECURE_SSL_REDIRECT', default=True, cast=bool)
# Health probes arrive over plain HTTP from Docker/K8s/load balancers —
# redirecting them to https marks every container permanently unhealthy.
SECURE_REDIRECT_EXEMPT = [r'^health/']
SECURE_HSTS_SECONDS = 31536000  # 1 year
SECURE_HSTS_INCLUDE_SUBDOMAINS = True
SECURE_HSTS_PRELOAD = True

# Cookie Security
SESSION_COOKIE_SECURE = True
SESSION_COOKIE_HTTPONLY = True
SESSION_COOKIE_SAMESITE = 'Lax'
CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True
CSRF_COOKIE_SAMESITE = 'Lax'

# Browser Security
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'
SECURE_CONTENT_TYPE_NOSNIFF = True
SECURE_REFERRER_POLICY = 'same-origin'

# Additional Security Settings
SECURE_PROXY_SSL_HEADER = ('HTTP_X_FORWARDED_PROTO', 'https')

# Content Security Policy (optional - configure based on your needs)
# CSP_DEFAULT_SRC = ("'self'",)
# CSP_SCRIPT_SRC = ("'self'", "'unsafe-inline'")
# CSP_STYLE_SRC = ("'self'", "'unsafe-inline'")

# Sentry Integration for Error Monitoring
SENTRY_DSN = config('SENTRY_DSN', default='')
if SENTRY_DSN:
    import sentry_sdk
    from sentry_sdk.integrations.django import DjangoIntegration

    sentry_sdk.init(
        dsn=SENTRY_DSN,
        integrations=[DjangoIntegration()],
        environment=config('ENVIRONMENT', default='production'),
        traces_sample_rate=0.1,  # 10% of transactions for performance monitoring
        send_default_pii=False,  # Don't send personally identifiable information
    )

# Database - Production optimizations
DATABASES['default']['CONN_MAX_AGE'] = 600
DATABASES['default']['OPTIONS'] = {
    'connect_timeout': 10,
}

# Email Configuration (configure based on your email provider)
EMAIL_BACKEND = config('EMAIL_BACKEND', default='django.core.mail.backends.smtp.EmailBackend')
EMAIL_HOST = config('EMAIL_HOST', default='')
EMAIL_PORT = config('EMAIL_PORT', default=587, cast=int)
EMAIL_USE_TLS = config('EMAIL_USE_TLS', default=True, cast=bool)
EMAIL_HOST_USER = config('EMAIL_HOST_USER', default='')
EMAIL_HOST_PASSWORD = config('EMAIL_HOST_PASSWORD', default='')
DEFAULT_FROM_EMAIL = config('DEFAULT_FROM_EMAIL', default='noreply@blooddonation.com')

# Logging - Production level logging
LOGGING['handlers']['console']['level'] = 'WARNING'
LOGGING['loggers']['django']['level'] = 'WARNING'
LOGGING['loggers']['django.request']['level'] = 'ERROR'

# Admin notification on errors (optional)
ADMINS = [
    ('Admin', config('ADMIN_EMAIL', default='admin@blooddonation.com')),
]
MANAGERS = ADMINS

# Static files - WhiteNoise (nginx serves the shared volume; this is the fallback)
MIDDLEWARE.insert(
    MIDDLEWARE.index('django.middleware.security.SecurityMiddleware') + 1,
    'whitenoise.middleware.WhiteNoiseMiddleware',
)
STORAGES = {
    'default': {'BACKEND': 'django.core.files.storage.FileSystemStorage'},
    'staticfiles': {'BACKEND': 'whitenoise.storage.CompressedManifestStaticFilesStorage'},
}

# Increase API rate limits for production if needed
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['anon'] = config('THROTTLE_ANON', default='1000/hour')
REST_FRAMEWORK['DEFAULT_THROTTLE_RATES']['user'] = config('THROTTLE_USER', default='10000/hour')
