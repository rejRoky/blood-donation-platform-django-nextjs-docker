"""
Settings package initialization.
Automatically loads the appropriate settings module based on DJANGO_SETTINGS_MODULE.
"""

import os

# Default to development settings if not specified
settings_module = os.getenv('DJANGO_SETTINGS_MODULE', 'project.settings.development')

# Import the appropriate settings
if 'production' in settings_module:
    from .production import *
elif 'staging' in settings_module:
    from .staging import *
else:
    from .development import *
