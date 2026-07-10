# 🩸 Blood Donation Platform

A full-stack blood donation management system with a Django REST API backend and Next.js frontend.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)

---

## ✨ Features

- 🔐 Mobile number authentication (Bangladesh format: `01XXXXXXXXX`)
- 🔑 JWT access/refresh tokens with blacklisting on logout
- 🩸 Donation tracking with 120-day interval enforcement
- 🔑 OTP-based password reset (via Redis cache)
- 📍 Bangladesh geographic data — Districts & Upazilas
- 👥 Role-based users: Admin, Manager, Donor
- 🔍 Donor search by blood group, district, upazila
- ⚙️ Site settings management
- 💓 Health check endpoints (liveness, readiness, status)

---

## 🛠️ Tech Stack

### Backend
- Python 3.12, Django 5.0, Django REST Framework 3.15
- PostgreSQL 16, Redis 7
- djangorestframework-simplejwt, drf-yasg, django-ckeditor
- Gunicorn, Nginx

### Frontend
- Next.js 15, React 18
- Redux Toolkit, NextAuth, Axios
- MUI, Tailwind CSS, React Hook Form

---

## 🚀 Quick Start

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
docker-compose up --build
```

### 3. Access
| Service | URL |
|---------|-----|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| Admin Panel | http://localhost:8000/admin/ |
| Swagger UI | http://localhost:8000/doc/ |
| ReDoc | http://localhost:8000/redoc/ |
| Health Check | http://localhost:8000/health/ready/ |

### 4. Create Superuser (Optional)
```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 📁 Project Structure

```
blood-donation-backend-django/
├── backend/
│   ├── project/                  # Django project settings & URLs
│   │   └── settings/             # base / development / staging / production
│   ├── users/                    # Auth, users, donations, geographic data
│   ├── sitesetting/              # Site configuration app
│   ├── requirements/             # base / dev / production
│   ├── Dockerfile
│   ├── gunicorn_config.py
│   └── manage.py
├── frontend/                     # Next.js application
├── nginx/                        # Nginx reverse proxy config
├── redis/                        # Redis config
├── docker-compose.yml
└── .env.example
```

---

## 📚 API Endpoints

### Authentication
| Method | Endpoint | Auth |
|--------|----------|------|
| POST | `/api/users/register/` | No |
| POST | `/api/users/login/` | No |
| POST | `/api/users/logout/` | Yes |
| POST | `/api/users/token/refresh/` | No |

### Password Reset (OTP)
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/users/send-reset-password-otp/` | Send OTP to mobile |
| POST | `/api/users/verify-reset-password-otp/` | Verify OTP |
| POST | `/api/users/reset-password/` | Set new password |

### Users
| Method | Endpoint | Auth |
|--------|----------|------|
| GET/PUT | `/api/users/profile/` | Yes |
| GET | `/api/users/` | Yes — supports `?blood_group=&district_id=&upazila_id=` |
| GET | `/api/users/<uuid>/` | Yes |
| POST | `/api/users/is_donate_first/` | Yes |
| POST | `/api/users/is_active/` | Yes |

### Donations
| Method | Endpoint | Auth |
|--------|----------|------|
| POST/GET/DELETE | `/api/users/donate/` | Yes |

### Geographic Data
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/area/district/` | No |
| POST | `/api/area/upazila/` | No — body: `{ "district_id": int }` |

### Site Settings
| Method | Endpoint | Auth |
|--------|----------|------|
| GET | `/api/site-settings/` | No |
| GET | `/api/site-settings/<id>/` | No |
| GET | `/api/site-settings/footer-logo/` | No |

### Health Checks
| Endpoint | Description |
|----------|-------------|
| `/health/live/` | Liveness probe |
| `/health/ready/` | Readiness probe |
| `/health/status/` | Detailed system info |

---

## ⚙️ Environment Variables

```bash
# Django
SECRET_KEY=your-secret-key
DEBUG=False
DJANGO_SETTINGS_MODULE=project.settings.production
ALLOWED_HOSTS=yourdomain.com

# Database
POSTGRES_DB=blood_donation_db
POSTGRES_USER=your_db_user
POSTGRES_PASSWORD=your_secure_password
POSTGRES_HOST=db
POSTGRES_PORT=5432

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com

# Frontend (Next.js)
NEXT_PUBLIC_API_URL=https://yourdomain.com/api
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-nextauth-secret

# Optional
SENTRY_DSN=your_sentry_dsn
TZ=Asia/Dhaka
```

See [.env.example](.env.example) for all options.

---

## 🔒 Security

- Password requirements: min 8 chars, uppercase, lowercase, digit, special char (`@#$%^&*()-+=`)
- Mobile number: exactly 11 digits, starts with `01`
- JWT token blacklisting on logout
- OTP-based password reset (5-minute expiry via Redis)
- CORS whitelisting, HTTPS enforcement in production

---

## 💻 Local Development (Without Docker)

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements/dev.txt
set DJANGO_SETTINGS_MODULE=project.settings.development
python manage.py migrate
python manage.py runserver
```

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Services

| Service | Image | Port |
|---------|-------|------|
| `db` | postgres:16-alpine | 5432 |
| `redis` | redis:7-alpine | 6379 |
| `backend` | Custom (Gunicorn) | 8000 |
| `frontend` | Custom (Next.js) | 3000 |
| `nginx` | Custom (Nginx) | 80 |

---

## 📝 License

MIT License — see [LICENSE](LICENSE) for details.
