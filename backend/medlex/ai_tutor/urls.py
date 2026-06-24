from django.urls import path
from .views import ai_tutor_chat
from .views import ai_tutor_chat, ai_tutor_history

urlpatterns = [
    path("", ai_tutor_chat, name="ai_tutor_chat"),
    path("history/", ai_tutor_history),
]
