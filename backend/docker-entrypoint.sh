#!/bin/bash
set -e

echo "Starting Blood Donation Backend..."

# Wait for database to be ready
echo "Waiting for database..."
while ! nc -z $POSTGRES_HOST $POSTGRES_PORT; do
  sleep 0.5
done
echo "Database is ready!"

# Wait for Redis to be ready (if configured)
if [ -n "$REDIS_HOST" ]; then
  echo "Waiting for Redis..."
  while ! nc -z $REDIS_HOST $REDIS_PORT; do
    sleep 0.5
  done
  echo "Redis is ready!"
fi

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Create superuser if it doesn't exist (optional - for first-time setup)
# Uncomment and configure if needed:
# python manage.py shell <<EOF
# from users.models import User
# if not User.objects.filter(mobile_number='${ADMIN_MOBILE}').exists():
#     User.objects.create_superuser('${ADMIN_MOBILE}', '${ADMIN_PASSWORD}')
#     print('Superuser created')
# EOF

echo "Starting Gunicorn..."
exec gunicorn project.wsgi:application -c /code/gunicorn_config.py
