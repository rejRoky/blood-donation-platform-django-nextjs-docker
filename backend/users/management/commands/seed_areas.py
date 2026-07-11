"""
Seed Bangladesh districts and upazilas from the bundled JSON data files.

Data source: https://github.com/nuhil/bangladesh-geocode (MIT License).
See users/data/README.md for the re-sync procedure.

Idempotent: existing rows are updated in place, so it is safe to run on
every deployment.

Usage:
    python manage.py seed_areas
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand
from django.db import transaction

from users.models import Districts, Upazilas

DATA_DIR = Path(__file__).resolve().parent.parent.parent / 'data'


class Command(BaseCommand):
    help = 'Seed Bangladesh districts and upazilas geographic data (idempotent).'

    @transaction.atomic
    def handle(self, *args, **options):
        with open(DATA_DIR / 'districts.json', encoding='utf-8') as f:
            districts = json.load(f)
        with open(DATA_DIR / 'upazilas.json', encoding='utf-8') as f:
            upazilas = json.load(f)

        for row in districts:
            Districts.objects.update_or_create(id=row['id'], defaults={
                'name': row['name'],
                'bn_name': row['bn_name'],
                'lat': row['lat'],
                'lon': row['lon'],
                'url': row['url'],
            })

        for row in upazilas:
            Upazilas.objects.update_or_create(id=row['id'], defaults={
                'district_id': row['district_id'],
                'name': row['name'],
                'bn_name': row['bn_name'],
                'url': row['url'],
            })

        self.stdout.write(self.style.SUCCESS(
            f'Seeded {len(districts)} districts and {len(upazilas)} upazilas.'
        ))
