from django.urls import path
from accounts.views.views import (
    register_view, profile_view, profile_extended_view, google_auth_view
)

urlpatterns = [
    path('register/',               register_view,          name='api_register'),
    path('profile/',                profile_view,           name='api_profile'),
    path('profile/extended/',       profile_extended_view,  name='api_profile_extended'),
    path('auth/google/',            google_auth_view,       name='api_google_auth'),
]