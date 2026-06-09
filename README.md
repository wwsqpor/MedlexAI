# MedLex

A Django REST API backend for medical professionals. Built to serve Angular (or any SPA) frontend — no HTML templates, pure JSON over HTTP with JWT authentication.

---

## Features

- **Email/password registration and login** with JWT tokens
- **Google Sign-In** — exchange a Google ID token for a JWT pair; auto-creates account on first sign-in
- **Profile management** — view and update professional details
- **CORS-ready** for Angular dev server out of the box
- **Token rotation** — refresh tokens are cycled on every use

---

## Requirements

- Python 3.10+
- pip

---

## Quick Start

```bash
# 1. Clone the repository
git clone <repo-url>
cd medlex

# 2. Install dependencies
pip install -r requirements.txt

# 3. Apply database migrations
python manage.py migrate

# 4. Start the development server
python manage.py runserver
```

The API will be available at `http://127.0.0.1:8000`.

---

## Project Structure

```
medlex/
├── manage.py
├── requirements.txt
├── db.sqlite3
├── medlex/                   # Project configuration
│   ├── settings.py
│   ├── urls.py
│   ├── asgi.py
│   └── wsgi.py
└── accounts/                 # User accounts app
    ├── models.py             # Custom User model
    ├── serializers.py        # RegisterSerializer, ProfileSerializer
    ├── urls.py               # Account-specific routes
    ├── admin.py
    └── views/
        └── views.py          # register, profile, google_auth
```

---

## API Overview

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/accounts/register/` | None | Create a new account |
| `POST` | `/api/token/` | None | Login — returns JWT pair |
| `POST` | `/api/token/refresh/` | None | Refresh access token |
| `POST` | `/api/accounts/auth/google/` | None | Google Sign-In |
| `GET` | `/api/accounts/profile/` | Bearer | Get current user profile |
| `PATCH` | `/api/accounts/profile/update/` | Bearer | Partial profile update |
| `PUT` | `/api/accounts/profile/update/` | Bearer | Full profile update |

All protected endpoints require:
```
Authorization: Bearer <access_token>
```

For full request/response examples, see [MedLex_API_Documentation.md](./MedLex_API_Documentation.md).

---

## Configuration

### Google OAuth

Replace the placeholder credentials in `medlex/settings.py` with your own from [Google Cloud Console](https://console.cloud.google.com/):

```python
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        'APP': {
            'client_id': 'YOUR_CLIENT_ID.apps.googleusercontent.com',
            'secret': 'YOUR_CLIENT_SECRET',
        }
    }
}
```

Make sure `http://localhost:4200` is listed as an **Authorised JavaScript origin** in your OAuth client settings.

### CORS

By default, requests from `http://localhost:4200` (Angular dev server) are allowed. To add other origins, edit `CORS_ALLOWED_ORIGINS` in `settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    'http://localhost:4200',
    'https://your-production-frontend.com',
]
```

### JWT Token Lifetimes

Configured in `settings.py` under `SIMPLE_JWT`:

| Token | Lifetime |
|-------|----------|
| Access | 60 minutes |
| Refresh | 7 days (rotates on use) |

---

## Frontend Integration (Angular)

Add an HTTP interceptor to attach the token to every request:

```typescript
// auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getAccessToken();
  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }
  return next(req);
};
```

Register it in `app.config.ts`:

```typescript
provideHttpClient(withInterceptors([authInterceptor]))
```

---

## Production Checklist

- [ ] Replace `SECRET_KEY` in `settings.py` with a strong, randomly generated value
- [ ] Set `DEBUG = False`
- [ ] Update `ALLOWED_HOSTS` with your domain
- [ ] Switch to a production database (PostgreSQL recommended)
- [ ] Configure SMTP email backend (see commented block in `settings.py`)
- [ ] Replace Google OAuth credentials with production values
- [ ] Serve with Gunicorn + Nginx (or similar)
- [ ] Enable HTTPS and update `CORS_ALLOWED_ORIGINS` accordingly

---

## Dependencies

```
Django>=5.0
djangorestframework>=3.15
djangorestframework-simplejwt>=5.3
django-cors-headers>=4.3
django-allauth>=0.63
google-auth>=2.29
```
