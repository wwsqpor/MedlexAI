from django.urls import path
from accounts.views import (
    register_view, profile_view, profile_update_view,
    profile_extended_view, completed_cases_view, google_auth_view,
)

urlpatterns = [
    path('register/',               register_view,           name='api_register'),
    path('auth/google/',            google_auth_view,        name='api_google_auth'),
    path('profile/',                profile_view,            name='api_profile'),
    path('profile/update/',         profile_update_view,     name='api_profile_update'),
    path('profile/extended/',       profile_extended_view,   name='api_profile_extended'),
    path('profile/cases/',          completed_cases_view,    name='api_completed_cases'),
]