from django.urls import path
from accounts.views import (
    register_view,
    profile_view,
    profile_update_view,
    google_auth_view,
)

urlpatterns = [
    # Auth
    path('register/', register_view, name='api_register'),
    path('auth/google/', google_auth_view, name='api_google_auth'),

    # Profile
    path('profile/', profile_view, name='api_profile'),
    path('profile/update/', profile_update_view, name='api_profile_update'),
]
