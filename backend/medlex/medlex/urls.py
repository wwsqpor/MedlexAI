from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),

    # ── JWT auth ──────────────────────────────────────────────────────────────
    # POST /api/token/         → { email, password } → { access, refresh }
    # POST /api/token/refresh/ → { refresh }         → { access }
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),

    # ── Accounts (register, profile, Google OAuth) ────────────────────────────
    path('api/accounts/', include('accounts.urls')),
]
