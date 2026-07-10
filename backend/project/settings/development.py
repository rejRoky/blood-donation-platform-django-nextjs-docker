"""
Development settings for blood donation backend.
"""

from .base import *

# Development mode
DEBUG = True

# Allow all hosts in development
ALLOWED_HOSTS = ['*']

# CORS - Allow all origins in development
CORS_ALLOW_ALL_ORIGINS = True

# Security settings - Disabled for development (HTTP)
SECURE_SSL_REDIRECT = False
SESSION_COOKIE_SECURE = False
CSRF_COOKIE_SECURE = False

# Disable password validation in development (optional)
# AUTH_PASSWORD_VALIDATORS = []

# Show SQL queries in console (useful for debugging)
LOGGING['loggers']['django.db.backends'] = {
    'handlers': ['console'],
    'level': 'DEBUG',
    'propagate': False,
}

# Django Debug Toolbar (optional - add if needed)
# INSTALLED_APPS += ['debug_toolbar']
# MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
# INTERNAL_IPS = ['127.0.0.1']
