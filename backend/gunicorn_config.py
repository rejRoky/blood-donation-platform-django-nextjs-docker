"""
Gunicorn configuration for production deployment.
"""

import multiprocessing
import os

# Server socket
bind = "0.0.0.0:8000"
backlog = 2048

# Worker processes
workers = int(os.getenv('GUNICORN_WORKERS', multiprocessing.cpu_count() * 2 + 1))
worker_class = "sync"
max_requests = 1000            # recycle workers to contain slow leaks
max_requests_jitter = 100
timeout = 120
graceful_timeout = 30
keepalive = 5

# Logging (stdout/stderr — Docker collects them)
accesslog = "-"
errorlog = "-"
loglevel = os.getenv('GUNICORN_LOG_LEVEL', 'info')
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s" %(D)s'

# Process naming
proc_name = 'blood_donation_backend'
