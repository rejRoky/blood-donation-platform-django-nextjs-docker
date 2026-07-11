"""
Standardized API error responses.

Every error leaving the API has the same envelope:

    {
        "success": false,
        "message": "<human-readable summary>",
        "errors": {"field": ["problem", ...], ...},   # only for validation errors
        "code": "<machine-readable error code>",
        "status_code": 400
    }

The frontend relies on `message` (toast/banner text) and `errors`
(per-field form errors), so views must not invent ad-hoc shapes.
"""

import logging

from django.core.exceptions import PermissionDenied
from django.http import Http404
from rest_framework import exceptions, status
from rest_framework.response import Response
from rest_framework.views import exception_handler as drf_exception_handler

logger = logging.getLogger(__name__)


def _first_message(detail):
    """Pull the first human-readable string out of a DRF error detail."""
    if isinstance(detail, dict):
        for value in detail.values():
            message = _first_message(value)
            if message:
                return message
    elif isinstance(detail, (list, tuple)):
        for item in detail:
            message = _first_message(item)
            if message:
                return message
    elif detail:
        return str(detail)
    return None


def _field_errors(detail):
    """Normalize a DRF error detail into {field: [messages]}."""
    if not isinstance(detail, dict):
        return None
    errors = {}
    for field, value in detail.items():
        if isinstance(value, dict):
            # Nested serializer errors — flatten one level.
            for sub_field, sub_value in value.items():
                errors[f"{field}.{sub_field}"] = [str(m) for m in (
                    sub_value if isinstance(sub_value, (list, tuple)) else [sub_value]
                )]
        elif isinstance(value, (list, tuple)):
            errors[str(field)] = [str(m) for m in value]
        else:
            errors[str(field)] = [str(value)]
    return errors


def api_exception_handler(exc, context):
    """DRF exception handler producing the standard error envelope."""
    response = drf_exception_handler(exc, context)

    if response is None:
        # Unhandled exception: let it propagate in DEBUG (Django's debug page),
        # otherwise return a generic 500 without leaking internals.
        from django.conf import settings
        if settings.DEBUG:
            return None
        logger.exception("Unhandled API exception", exc_info=exc)
        return Response(
            {
                'success': False,
                'message': 'An unexpected error occurred. Please try again later.',
                'code': 'server_error',
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(exc, (exceptions.NotAuthenticated, exceptions.AuthenticationFailed)):
        code = 'not_authenticated'
        # Exact string the frontend session-expiry interceptor matches on.
        message = 'Unauthenticated.'
    elif isinstance(exc, exceptions.ValidationError):
        code = 'validation_error'
        message = _first_message(exc.detail) or 'Invalid input.'
    elif isinstance(exc, (Http404,)):
        code = 'not_found'
        message = 'The requested resource was not found.'
    elif isinstance(exc, (PermissionDenied, exceptions.PermissionDenied)):
        code = 'permission_denied'
        message = 'You do not have permission to perform this action.'
    elif isinstance(exc, exceptions.Throttled):
        code = 'throttled'
        message = _first_message(exc.detail) or 'Too many requests.'
    else:
        code = getattr(exc, 'default_code', 'error')
        message = _first_message(getattr(exc, 'detail', None)) or 'Request failed.'

    payload = {
        'success': False,
        'message': message,
        'code': code,
        'status_code': response.status_code,
    }

    if isinstance(exc, exceptions.ValidationError):
        errors = _field_errors(exc.detail)
        if errors:
            payload['errors'] = errors

    response.data = payload
    return response
