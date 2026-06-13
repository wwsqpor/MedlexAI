from django.urls import path
from .views import submit_answer, complete_case

urlpatterns = [
    path("submit-answer/", submit_answer, name="submit_answer"),
    path("complete-case/", complete_case, name="complete_case"),
]