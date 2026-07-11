"""
Test settings: SQLite + local-memory cache so the suite runs anywhere
without Postgres/Redis, and fast password hashing.
"""

from .base import *

DEBUG = False
SECRET_KEY = 'test-only-secret-key-not-used-anywhere-else-0123456789'
ALLOWED_HOSTS = ['*']

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': ':memory:',
    }
}

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'bdp-tests',
    }
}

PASSWORD_HASHERS = ['django.contrib.auth.hashers.MD5PasswordHasher']

# Throttling off so tests don't trip rate limits
REST_FRAMEWORK = {
    **REST_FRAMEWORK,
    'DEFAULT_THROTTLE_CLASSES': [],
    'DEFAULT_THROTTLE_RATES': {
        'anon': None,
        'user': None,
        'login': '1000/min',
        'register': '1000/min',
        'otp': '1000/min',
    },
}

OTP_DEBUG_EXPOSE = True

LOGGING['handlers']['console']['level'] = 'ERROR'
