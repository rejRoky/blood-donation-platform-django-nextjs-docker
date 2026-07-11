# Bangladesh geographic data

`districts.json` (64 rows) and `upazilas.json` (494 rows) are derived from
[nuhil/bangladesh-geocode](https://github.com/nuhil/bangladesh-geocode)
(MIT License, © Nuhil Mehdy).

Load them with:

```bash
python manage.py seed_areas
```

The command is idempotent — existing rows are updated in place.

## Re-syncing from upstream

The upstream files are phpMyAdmin JSON exports; the table rows live under
the `data` key of the `{"type": "table"}` element. To refresh:

1. Clone https://github.com/nuhil/bangladesh-geocode
2. Extract `districts/districts.json` and `upazilas/upazilas.json` rows and
   map them to this layout (all values strings in upstream, ids cast to int):
   - districts: `id, name, bn_name, lat, lon, url`
   - upazilas: `id, district_id, name, bn_name, url`
3. Write with `ensure_ascii=False, indent=1` and run `seed_areas` again.
