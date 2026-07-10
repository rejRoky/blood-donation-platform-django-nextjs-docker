"""
Health check endpoints for monitoring and orchestration.
"""

from django.http import JsonResponse
from django.views.decorators.http import require_GET
from django.db import connection
from django.core.cache import cache
import logging

logger = logging.getLogger(__name__)


@require_GET
def health_live(request):
    """
    Liveness probe - Checks if the application is running.
    Returns 200 OK if the application is alive.
    Used by Docker/Kubernetes to restart container if it fails.
    """
    return JsonResponse({
        'status': 'ok',
        'message': 'Application is running'
    })


@require_GET
def health_ready(request):
    """
    Readiness probe - Checks if the application is ready to serve traffic.
    Verifies database and Redis connectivity.
    Used by load balancers to route traffic.
    """
    health_status = {
        'status': 'ok',
        'checks': {}
    }

    # Check database connectivity
    try:
        connection.ensure_connection()
        health_status['checks']['database'] = {
            'status': 'ok',
            'message': 'Database connection is healthy'
        }
    except Exception as e:
        logger.error(f"Database health check failed: {str(e)}")
        health_status['status'] = 'error'
        health_status['checks']['database'] = {
            'status': 'error',
            'message': f'Database connection failed: {str(e)}'
        }

    # Check Redis connectivity
    try:
        cache.set('health_check', 'ok', 10)
        cache_value = cache.get('health_check')
        if cache_value == 'ok':
            health_status['checks']['cache'] = {
                'status': 'ok',
                'message': 'Redis connection is healthy'
            }
        else:
            raise Exception('Cache value mismatch')
    except Exception as e:
        logger.error(f"Redis health check failed: {str(e)}")
        health_status['status'] = 'error'
        health_status['checks']['cache'] = {
            'status': 'error',
            'message': f'Redis connection failed: {str(e)}'
        }

    # Return appropriate status code
    status_code = 200 if health_status['status'] == 'ok' else 503
    return JsonResponse(health_status, status=status_code)


@require_GET
def health_status(request):
    """
    Detailed health status endpoint with system information.
    """
    import sys
    import django

    return JsonResponse({
        'status': 'ok',
        'application': 'Blood Donation Backend',
        'version': '1.0.0',
        'python_version': sys.version,
        'django_version': django.get_version(),
    })
