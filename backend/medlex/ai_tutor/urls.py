from django.urls import path
from .views import ai_tutor_chat

urlpatterns = [
    path("", ai_tutor_chat, name="ai_tutor_chat"),
]