# MedLex — Django REST API

The backend is now a **pure JSON REST API**.  No HTML templates are served.
Angular (or any other SPA) talks to it exclusively via HTTP + JWT tokens.

---

## Quick start

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver          # http://127.0.0.1:8000
```

---

## API reference

### 1. Register
```
POST /api/accounts/register/
Content-Type: application/json

{
  "email": "doctor@hospital.kz",
  "name": "Aibek",
  "surname": "Dzhaksybekov",
  "phone_number": "+77001234567",   // optional, must be unique
  "organization": "City Hospital",
  "specialization": "Cardiology",
  "password": "securePass123"
}

→ 201  { "message": "Account created successfully!" }
→ 400  { field: [error, …] }
```

### 2. Login (obtain JWT)
```
POST /api/token/
Content-Type: application/json

{ "email": "doctor@hospital.kz", "password": "securePass123" }

→ 200  { "access": "<JWT>", "refresh": "<JWT>" }
→ 401  { "detail": "No active account found …" }
```

### 3. Refresh access token
```
POST /api/token/refresh/
Content-Type: application/json

{ "refresh": "<refresh JWT>" }

→ 200  { "access": "<new JWT>" }
```

### 4. Google Sign-In (Angular flow)
```
POST /api/accounts/auth/google/
Content-Type: application/json

{ "credential": "<Google ID token from Google Sign-In button>" }

→ 200  {
          "access": "<JWT>",
          "refresh": "<JWT>",
          "created": true,          // false if existing user
          "user": { …profile… }
       }
→ 401  { "error": "Invalid Google token: …" }
```

**Angular integration (one-time setup):**
1. Add the Google Sign-In script or use `@abacritt/angularx-social-login`.
2. On callback, send `credential` (the raw `id_token`) to this endpoint.
3. Store the returned `access` / `refresh` tokens in memory or `localStorage`.
4. Attach `Authorization: Bearer <access>` to every subsequent request.

### 5. Get profile
```
GET /api/accounts/profile/
Authorization: Bearer <access>

→ 200  {
          "email": "…",
          "name": "…",
          "surname": "…",
          "phone_number": "…",
          "organization": "…",
          "specialization": "…"
       }
```

### 6. Update profile
```
PATCH /api/accounts/profile/update/
Authorization: Bearer <access>
Content-Type: application/json

{ "specialization": "Neurology" }   // send only changed fields

→ 200  { …updated profile… }
→ 400  { field: [error, …] }
```

---

## Angular HTTP interceptor (recommended)

```typescript
// auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';

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

## Google OAuth — Django side

The `client_id` and `secret` live in `settings.py` under
`SOCIALACCOUNT_PROVIDERS['google']['APP']`.  Replace them with your own
credentials from **Google Cloud Console → APIs & Services → Credentials**.

Make sure `http://localhost:4200` is listed as an **Authorised JavaScript
origin** in the OAuth client, and `http://127.0.0.1:8000` is listed as an
**Authorised redirect URI** if you ever need the server-side redirect flow.

---

## CORS

`settings.py` allows requests from `http://localhost:4200` (Angular dev server).
To add other origins, extend `CORS_ALLOWED_ORIGINS`.
