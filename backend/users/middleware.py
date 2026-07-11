"""
Request logging middleware.

Requests are logged through the standard logging pipeline (stdout + rotating
file) instead of writing a database row per request — a per-request INSERT
does not survive production traffic. Security-relevant events (login,
registration, password reset, ...) are persisted to UserActionLog explicitly
in the views that handle them.
"""

import logging
import time

logger = logging.getLogger('api.requests')

_SKIP_PREFIXES = ('/health/', '/static/', '/media/', '/favicon')


def _client_ip(request):
    forwarded = request.META.get('HTTP_X_FORWARDED_FOR')
    if forwarded:
        return forwarded.split(',')[0].strip()
    return request.META.get('REMOTE_ADDR', '0.0.0.0')


class RequestLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        start = time.monotonic()
        response = self.get_response(request)

        if not request.path.startswith(_SKIP_PREFIXES):
            duration_ms = (time.monotonic() - start) * 1000
            user = getattr(request, 'user', None)
            logger.info(
                '%s %s %s %.0fms user=%s ip=%s',
                request.method,
                request.path,
                response.status_code,
                duration_ms,
                getattr(user, 'mobile_number', '-') if getattr(user, 'is_authenticated', False) else '-',
                _client_ip(request),
            )
        return response
