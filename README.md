# 🩸 Blood Donation Platform

A full-stack blood donation management system with a Django REST API backend and Next.js frontend.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.2%20LTS-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## ✨ Features

- 🔐 Mobile number authentication (Bangladesh format: `01XXXXXXXXX`)
- 🔑 JWT access/refresh tokens with blacklisting on logout & password reset
- 🩸 Donation tracking with 120-day interval enforcement
- 🔑 OTP-based password reset (single-use reset token, attempt limiting)
- 📍 Bangladesh geographic data — Districts & Upazilas
- 👥 Role-based users: Admin, Manager, Donor
- 🔍 Donor directory with server-side filtering & pagination
- ⚙️ Site settings management
- 💓 Health check endpoints (liveness, readiness, status)

---

## 🛠️ Tech Stack

### Backend
- Python 3.12, Django 5.2 LTS, Django REST Framework 3.17
- PostgreSQL 16, Redis 7
- djangorestframework-simplejwt, drf-yasg
- Gunicorn, Nginx, WhiteNoise

### Frontend
- Next.js 15 (App Router) + React 19, TypeScript
- TanStack Query, NextAuth (JWT with refresh rotation)
- Tailwind CSS 4, React Hook Form + Zod, sonner, lucide-react
- Standalone output in a non-root multi-stage Docker image

---

## 🚀 Quick Start (Development)

### Prerequisites
- Docker 20.10+ and Docker Compose 2.0+

### 1. Clone & Configure
```bash
git clone https://github.com/yourusername/blood-donation-backend-django.git
cd blood-donation-backend-django
cp .env.example .env
# Edit .env with your values
```

### 2. Start All Services
```bash
docker compose up --build
```

Database migrations are generated and applied automatically by the backend
container on startup (migration files are intentionally not tracked in git).

### 3. Seed Geographic Data (first run)
```bash
docker compose exec backend python manage.py seed_areas
```

Loads the bundled dataset of 64 districts and 494 upazilas (idempotent —
safe to re-run). Registration and donor search need this data. Source:
[nuhil/bangladesh-geocode](https://github.com/nuhil/bangladesh-geocode) (MIT).

### 4. Access
| Service | URL |
|---------|-----|
| App (via nginx) | http://localhost |
| Frontend (direct) | http://localhost:3000 |
| Backend API (direct) | http://localhost:8000 |
| Admin Panel | http://localhost:8000/admin/ |
| Swagger UI | http://localhost:8000/doc/ |
| ReDoc | http://localhost:8000/redoc/ |
| Health Check | http://localhost:8000/health/ready/ |

In development, DB/Redis/backend/frontend ports are bound to `127.0.0.1` only.

### 5. Create Superuser (Optional)
```bash
docker compose exec backend python manage.py createsuperuser
```

---

## 🏭 Production Deployment

Production uses an overlay file — no source mounts, no published DB/Redis
ports, secrets are **required** (the stack refuses to start without them),
and `project.settings.production` fails fast on an insecure `SECRET_KEY`:

```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
docker compose exec backend python manage.py seed_areas   # first deploy
```

Static and media files are served by nginx directly from shared volumes
(WhiteNoise as fallback). Terminate TLS at the nginx container (mount
certificates) or at an upstream load balancer/CDN.

Deployment notes:

- `ALLOWED_HOSTS` needs your public domain(s) only — internal hostnames
  (`backend`, `localhost`) are appended automatically for container
  healthchecks and the Next.js server's internal API calls.
- `SECURE_SSL_REDIRECT` defaults to `True`; set it to `False` when TLS is
  terminated upstream of nginx. Health endpoints are always exempt from
  the redirect so probes keep working.
- The overlay replaces (not merges) dev bind-mounts and published ports
  via compose `!override` tags — only nginx's port is exposed.

**SMS gateway:** the OTP flow logs messages until a provider is wired into
`backend/users/services.py` (`send_sms`). Do not enable `OTP_DEBUG_EXPOSE`
in production — production settings refuse to start with it on.

---

## 📁 Project Structure

```
blood-donation-backend-django/
├── backend/
│   ├── project/                  # Django project
│   │   ├── settings/             # base / development / staging / production / test
│   │   ├── exceptions.py         # standardized API error envelope
│   │   ├── pagination.py         # standard page-number pagination
│   │   └── health.py             # liveness / readiness probes
│   ├── users/                    # Auth, users, donations, geographic data
│   │   ├── data/                 # Bangladesh districts & upazilas (JSON)
│   │   ├── management/commands/  # seed_areas
│   │   ├── services.py           # OTP + SMS gateway integration point
│   │   └── tests.py              # API test suite
│   ├── sitesetting/              # Site configuration app
│   ├── requirements/             # base / dev / production
│   ├── Dockerfile
│   └── gunicorn_config.py
├── frontend/                     # Next.js 15 App Router (TypeScript)
│   ├── app/                      # Routes: home, donors, dashboard, auth, about, terms
│   ├── components/               # UI primitives + feature components
│   ├── lib/                      # API client, auth, hooks, validation
│   └── Dockerfile                # dev + standalone production targets
├── nginx/                        # Reverse proxy: static, gzip, rate limiting
├── docker-compose.yml            # Development
├── docker-compose.prod.yml       # Production overlay
├── .env.example
└── LICENSE                       # MIT
```

---

## 📚 API

All endpoints are mounted at **`/api/v1/`** (canonical) and `/api/`
(legacy alias). Authenticate with `Authorization: Bearer <access_token>`.

### Error envelope

Every error response has one consistent shape:

```json
{
  "success": false,
  "message": "Human-readable summary",
  "errors": { "field_name": ["What is wrong"] },
  "code": "validation_error",
  "status_code": 400
}
```

### Authentication
| Method | Endpoint | Auth | Throttle |
|--------|----------|------|----------|
| POST | `/api/v1/users/register/` | No | 20/hour |
| POST | `/api/v1/users/login/` | No | 10/min |
| POST | `/api/v1/users/logout/` | Yes | — |
| POST | `/api/v1/users/token/refresh/` | No | — |

### Password Reset (OTP)
| Method | Endpoint | Body |
|--------|----------|------|
| POST | `/api/v1/users/send-reset-password-otp/` | `{mobile_number}` — always responds 200 (no account enumeration) |
| POST | `/api/v1/users/verify-reset-password-otp/` | `{mobile_number, otp}` → returns single-use `reset_token` |
| POST | `/api/v1/users/reset-password/` | `{mobile_number, reset_token, new_password}` — revokes all sessions |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET/PUT | `/api/v1/users/profile/` | Yes |
| GET | `/api/v1/users/` | Yes — donor directory: `?blood_group=&district_id=&upazila_id=&page=&page_size=` |
| GET | `/api/v1/users/<uuid>/` | Yes |
| POST | `/api/v1/users/is_donate_first/` | Yes |
| POST | `/api/v1/users/is_active/` | Yes — toggles donor availability |

### Donations
| Method | Endpoint | Notes |
|--------|----------|-------|
| POST | `/api/v1/users/donate/` | `{date, amount, note?}` — 120-day rule enforced |
| GET | `/api/v1/users/donate/` | Own donations only |
| DELETE | `/api/v1/users/donate/` | `{donation_id}` — own donations only |

### Geographic Data
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/area/district/` | No |
| GET | `/api/v1/area/upazila/?district_id=<id>` | No |
| POST | `/api/v1/area/upazila/` | No — legacy body variant |

### Site Settings
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/v1/site-settings/` | No |
| GET | `/api/v1/site-settings/<id>/` | No |
| GET | `/api/v1/site-settings/footer-logo/` | No |

### Health Checks
| Endpoint | Description |
|----------|-------------|
| `/health/live/` | Liveness probe |
| `/health/ready/` | Readiness probe (DB + Redis) |
| `/health/status/` | App version (runtime details for staff only) |

---

## 🔒 Security

- Password requirements: min 8 chars, uppercase, lowercase, digit, special char
- JWT refresh-token blacklisting on logout **and** on password reset
- OTP reset flow: OTP never returned by the API, max 5 verify attempts,
  single-use reset token, generic responses prevent account enumeration
- Login: single generic error for wrong password / unknown / inactive accounts
- Registration cannot set roles or staff flags
- Donation records can only be deleted by their owner
- Rate limiting at both nginx (edge) and DRF (per-user/scope) levels
- Secure-by-default DRF: every endpoint requires auth unless explicitly public
- `python manage.py check --deploy` passes clean in production settings

---

## 🧪 Tests

```bash
cd backend
python manage.py test users --settings=project.settings.test
```

The test settings use SQLite + local-memory cache, so no services are needed.

---

## 💻 Local Development (Without Docker)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements/dev.txt
set DJANGO_SETTINGS_MODULE=project.settings.development
python manage.py makemigrations users sitesetting   # migrations aren't tracked in git
python manage.py migrate
python manage.py seed_areas
python manage.py runserver
```

The frontend calls the API same-origin through nginx, so full-stack work is
easiest with `docker compose up`. Running `npm run dev` directly only serves
pages that don't need the API unless you put a proxy in front.

```bash
cd frontend
npm install
npm run dev
```

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.
