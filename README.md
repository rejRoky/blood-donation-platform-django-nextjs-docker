# 🩸 Blood Donation Backend - Django REST API

A **production-grade** Django REST API for managing blood donation operations, featuring user registration with mobile number authentication, donation tracking with medical compliance (120-day intervals), and geographic data management for Bangladesh.

[![Python](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![Django](https://img.shields.io/badge/Django-5.0-green.svg)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/DRF-3.15-red.svg)](https://www.django-rest-framework.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](https://www.docker.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Security Features](#-security-features)
- [Environment Configuration](#-environment-configuration)
- [Development](#-development)
- [Production Deployment](#-production-deployment)
- [Testing](#-testing)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

### Core Features
- 🔐 **Mobile Number Authentication** - Custom authentication using Bangladesh mobile numbers
- 🔑 **JWT Token Management** - Access/refresh tokens with automatic blacklisting
- 🩸 **Donation Tracking** - Record blood donations with 120-day interval enforcement
- 📍 **Geographic Data** - Bangladesh districts and upazilas (administrative divisions)
- 👥 **User Management** - Profile management, role-based access (Admin, Manager, Donor)
- 📊 **Donation History** - View past donations with date and amount tracking
- ⚕️ **Medical Compliance** - Automatic validation of donation intervals (120 days)

### Production Features
- 🔒 **Security Hardened** - HTTPS, CORS whitelisting, secure cookies, HSTS headers
- 🚀 **High Performance** - Gunicorn WSGI server, Redis caching, database indexing
- 📝 **Structured Logging** - JSON logs with rotation, error tracking via Sentry
- 💓 **Health Checks** - Liveness and readiness probes for orchestration
- 🔄 **Rate Limiting** - API throttling to prevent abuse
- 🐳 **Docker Ready** - Multi-stage builds, non-root user, health checks
- 📈 **Monitoring** - Comprehensive logging and error tracking
- 🔍 **Audit Trail** - User action logging with IP tracking

---

## 🛠️ Tech Stack

### Backend Framework
- **Python 3.12** - Programming language
- **Django 5.0** - Web framework
- **Django REST Framework 3.15** - RESTful API toolkit
- **djangorestframework-simplejwt** - JWT authentication

### Database & Caching
- **PostgreSQL 16** - Relational database
- **Redis 7** - Caching and session storage
- **psycopg2** - PostgreSQL adapter

### Server & Deployment
- **Gunicorn** - WSGI HTTP server
- **Nginx** - Reverse proxy and static file serving
- **Docker & Docker Compose** - Containerization

### Security & Monitoring
- **django-cors-headers** - CORS handling
- **Sentry SDK** - Error monitoring
- **python-json-logger** - Structured logging
- **django-ratelimit** - Rate limiting

### API Documentation
- **drf-yasg** - Swagger/OpenAPI documentation generator

### Development Tools
- **pytest** - Testing framework
- **black** - Code formatter
- **flake8** - Linting
- **bandit** - Security scanner

---

## 🚀 Quick Start

### Prerequisites
- Docker 20.10+ and Docker Compose 2.0+
- Git

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/blood-donation-backend-django.git
cd blood-donation-backend-django
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Start Services
```bash
docker-compose up --build
```

### 4. Access the Application
- **API Base URL**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin/
- **API Documentation**: http://localhost:8000/doc/
- **Health Check**: http://localhost:8000/health/ready/

### 5. Create Superuser (Optional)
```bash
docker-compose exec backend python manage.py createsuperuser
```

---

## 📁 Project Structure

```
blood-donation-backend-django/
├── backend/
│   ├── project/                      # Django project settings
│   │   ├── settings/
│   │   │   ├── __init__.py
│   │   │   ├── base.py              # Base settings
│   │   │   ├── development.py       # Development settings
│   │   │   ├── staging.py           # Staging settings
│   │   │   └── production.py        # Production settings
│   │   ├── urls.py                  # URL routing
│   │   ├── wsgi.py                  # WSGI configuration
│   │   └── health.py                # Health check endpoints
│   ├── users/                        # User management app
│   │   ├── models.py                # User, Donations, Districts, etc.
│   │   ├── views.py                 # API views
│   │   ├── serializers.py           # DRF serializers with validation
│   │   ├── validators.py            # Custom validators
│   │   ├── middleware.py            # User action logging
│   │   ├── backends.py              # Mobile number authentication
│   │   └── urls.py                  # App URLs
│   ├── sitesetting/                  # Site configuration app
│   │   ├── models.py                # Site settings
│   │   ├── views.py                 # Settings API
│   │   └── serializers.py           # Settings serializers
│   ├── requirements/
│   │   ├── base.txt                 # Core dependencies
│   │   ├── dev.txt                  # Development dependencies
│   │   └── production.txt           # Production dependencies
│   ├── logs/                         # Application logs
│   ├── media/                        # User uploaded files
│   ├── staticfiles/                  # Static files (production)
│   ├── Dockerfile                    # Production Docker image
│   ├── docker-entrypoint.sh         # Container startup script
│   ├── gunicorn_config.py           # Gunicorn configuration
│   └── manage.py                    # Django management script
├── nginx/                            # Nginx configuration
├── docker-compose.yml               # Docker services orchestration
├── .env.example                     # Environment variables template
├── DEPLOYMENT.md                    # Deployment guide
└── README.md                        # This file
```

---

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/register/` | User registration | No |
| POST | `/api/users/login/` | User login | No |
| POST | `/api/users/logout/` | User logout | Yes |
| POST | `/api/users/token/refresh/` | Refresh JWT token | No |

### User Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/users/profile/` | Get user profile | Yes |
| PUT | `/api/users/profile/` | Update profile | Yes |
| GET | `/api/users/` | List all users | Yes |

### Donation Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/users/donate/` | Record donation | Yes |
| GET | `/api/users/donate/` | Get donation history | Yes |
| DELETE | `/api/users/donate/` | Delete donation | Yes |

### Geographic Data
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/area/district/` | Get all districts | No |
| POST | `/api/area/upazila/` | Get upazilas by district | No |

### Health Checks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health/live/` | Liveness probe (app running) |
| GET | `/health/ready/` | Readiness probe (dependencies healthy) |
| GET | `/health/status/` | Detailed system information |

### Interactive Documentation
- **Swagger UI**: http://localhost:8000/doc/
- **ReDoc**: http://localhost:8000/redoc/

---

## 🔒 Security Features

### Implemented Security Measures
- ✅ **Environment-Based Configuration** - No hardcoded secrets
- ✅ **HTTPS Enforcement** - Secure SSL/TLS connections
- ✅ **CORS Whitelisting** - Explicit allowed origins only
- ✅ **Secure Cookies** - HttpOnly, Secure, SameSite attributes
- ✅ **HSTS Headers** - HTTP Strict Transport Security
- ✅ **XSS Protection** - Content Security Policy headers
- ✅ **Rate Limiting** - API throttling (100/hour anon, 1000/hour user)
- ✅ **JWT Token Blacklisting** - Revoked tokens can't be reused
- ✅ **Password Validation** - Strong password requirements
- ✅ **SQL Injection Protection** - Django ORM parameterized queries
- ✅ **CSRF Protection** - Cross-Site Request Forgery tokens
- ✅ **Audit Logging** - User actions tracked with IP addresses

### Password Requirements
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one digit
- At least one special character (@, #, $, %, ^, &, *, (, ), -, +, =)

### Mobile Number Format
- Exactly 11 digits
- Must start with "01" (Bangladesh format)
- Examples: `01712345678`, `01812345678`

---

## ⚙️ Environment Configuration

### Required Environment Variables

Create a `.env` file in the project root:

```bash
# Django Configuration
SECRET_KEY=your-secret-key-here
DEBUG=False
DJANGO_SETTINGS_MODULE=project.settings.production
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

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

# CORS (comma-separated)
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Sentry (optional)
SENTRY_DSN=your_sentry_dsn

# Email (optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your_email@gmail.com
EMAIL_HOST_PASSWORD=your_email_password
```

See [.env.example](.env.example) for complete configuration options.

---

## 💻 Development

### Local Setup (Without Docker)

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements/dev.txt
```

3. **Configure environment:**
```bash
export DJANGO_SETTINGS_MODULE=project.settings.development
```

4. **Run migrations:**
```bash
python manage.py migrate
```

5. **Create superuser:**
```bash
python manage.py createsuperuser
```

6. **Run development server:**
```bash
python manage.py runserver
```

### Running Tests

```bash
# Run all tests
docker-compose exec backend pytest

# Run with coverage
docker-compose exec backend pytest --cov

# Run specific test file
docker-compose exec backend pytest users/tests/test_views.py
```

### Code Quality

```bash
# Format code
docker-compose exec backend black .

# Lint code
docker-compose exec backend flake8

# Security scan
docker-compose exec backend bandit -r .
```

---

## 🚀 Production Deployment

### Pre-Deployment Checklist
- [ ] Generate strong `SECRET_KEY`
- [ ] Set `DEBUG=False`
- [ ] Configure production database credentials
- [ ] Set up Sentry for error monitoring
- [ ] Obtain SSL/TLS certificate
- [ ] Configure email settings
- [ ] Set up database backups
- [ ] Review security settings

### Deployment Steps

See [DEPLOYMENT.md](DEPLOYMENT.md) for comprehensive deployment instructions including:
- Server setup and configuration
- SSL/TLS certificate installation
- Database migration strategies
- Monitoring and logging setup
- Troubleshooting guide
- Rollback procedures

### Quick Production Deployment

```bash
# 1. Configure environment
cp .env.example .env
nano .env  # Edit with production values

# 2. Build and start services
docker-compose up -d

# 3. Check health
curl http://localhost:8000/health/ready/

# 4. View logs
docker-compose logs -f backend
```

---

## 🧪 Testing

### Test Structure
```
backend/users/tests/
├── __init__.py
├── factories.py              # Test data factories
├── test_models.py           # Model tests
├── test_serializers.py      # Serializer tests
├── test_views.py            # API endpoint tests
└── test_authentication.py   # Auth flow tests
```

### Running Tests

```bash
# All tests
pytest

# With coverage report
pytest --cov=users --cov-report=html

# Specific test file
pytest users/tests/test_views.py

# Specific test
pytest users/tests/test_views.py::TestRegistration::test_valid_registration
```

### Test Coverage Goal
Target: **70%+ code coverage**

---

## 📊 Monitoring & Logging

### Log Files
- **Application logs**: `/backend/logs/app.log`
- **Error logs**: `/backend/logs/error.log`
- **Access logs**: Gunicorn stdout

### Log Rotation
- Maximum file size: 10MB
- Backup count: 5 files
- Format: JSON structured logging

### Error Monitoring
If Sentry is configured, all errors are automatically sent to Sentry dashboard for:
- Real-time error alerts
- Stack traces and context
- Performance monitoring
- Release tracking

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Coding Standards
- Follow PEP 8 style guide
- Use `black` for code formatting
- Write tests for new features
- Update documentation as needed
- Add type hints where appropriate

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Authors & Contributors

- **Initial Development** - Blood Donation System Team
- **Production Hardening** - Claude Code (AI Assistant)

---

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/yourusername/blood-donation-backend-django/issues)
- **Email**: admin@yourdomain.com
- **Documentation**: [Full Documentation](https://docs.yourdomain.com)

---

## 🙏 Acknowledgments

- Django Software Foundation
- Django REST Framework community
- All contributors and testers

---

## 📈 Roadmap

### Upcoming Features
- [ ] Email verification during registration
- [ ] Password reset via email
- [ ] Two-factor authentication
- [ ] Blood inventory management
- [ ] Blood request system for seekers
- [ ] Donation camp management
- [ ] SMS notifications
- [ ] Mobile app API endpoints
- [ ] Advanced analytics dashboard
- [ ] Donation certificate generation

### Infrastructure Improvements
- [ ] CI/CD pipeline (GitHub Actions)
- [ ] Kubernetes deployment manifests
- [ ] Automated database backups
- [ ] Performance benchmarking
- [ ] Load testing

---

## 📚 Additional Resources

- [Django Documentation](https://docs.djangoproject.com/)
- [Django REST Framework](https://www.django-rest-framework.org/)
- [Docker Documentation](https://docs.docker.com/)
- [Gunicorn Documentation](https://docs.gunicorn.org/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Built with ❤️ using Django REST Framework**

*Last Updated: February 2026*

---

## 🖥️ Frontend (Next.js)

This project includes a [Next.js](https://nextjs.org) frontend bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

### Running the Frontend

```bash
cd frontend
npm run dev
# or yarn dev / pnpm dev / bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. Edit `app/page.js` to start — the page auto-updates as you save.

### Frontend Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Learn Next.js](https://nextjs.org/learn)
- [Deploy on Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
