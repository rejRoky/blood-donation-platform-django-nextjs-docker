#!/bin/bash
set -e

echo "Starting Blood Donation Backend..."

echo "Waiting for database..."
until python -c "import psycopg2; psycopg2.connect(host='$POSTGRES_HOST', port='$POSTGRES_PORT', dbname='$POSTGRES_DB', user='$POSTGRES_USER', password='$POSTGRES_PASSWORD')" 2>/dev/null; do
  sleep 1
done
echo "Database is ready!"

if [ -n "$REDIS_HOST" ]; then
  echo "Waiting for Redis..."
  until python -c "import redis; redis.Redis(host='$REDIS_HOST', port=$REDIS_PORT, password='$REDIS_PASSWORD').ping()" 2>/dev/null; do
    sleep 1
  done
  echo "Redis is ready!"
fi

echo "Running database migrations..."
# Migration files are not tracked in git — generate them if missing
python manage.py makemigrations users sitesetting --noinput
python manage.py migrate --noinput

echo "Seeding geographic data..."
# Idempotent — updates existing rows, so safe on every boot
python manage.py seed_areas

echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

echo "Starting Gunicorn..."
exec gunicorn project.wsgi:application -c /code/gunicorn_config.py
