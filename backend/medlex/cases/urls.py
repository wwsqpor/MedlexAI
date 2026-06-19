from django.urls import path
from .views import (
    category_list, category_detail,
    law_reference_list, law_reference_detail,
    case_list, case_detail,
    case_task_list, case_task_detail,
    attempt_list, attempt_detail, attempt_start, attempt_answers,
    submit_answer, complete_case,
)

urlpatterns = [
    # Categories
    path('categories/', category_list, name='category_list'),
    path('categories/<int:pk>/', category_detail, name='category_detail'),

    # Law References
    path('laws/', law_reference_list, name='law_reference_list'),
    path('laws/<int:pk>/', law_reference_detail, name='law_reference_detail'),

    # Cases
    path('cases/', case_list, name='case_list'),
    path('cases/<int:pk>/', case_detail, name='case_detail'),

    # Case Tasks
    path('cases/<int:case_pk>/tasks/', case_task_list, name='case_task_list'),
    path('cases/<int:case_pk>/tasks/<int:task_pk>/', case_task_detail, name='case_task_detail'),

    # Attempts
    path('attempts/', attempt_list, name='attempt_list'),
    path('attempts/start/', attempt_start, name='attempt_start'),
    path('attempts/<int:pk>/', attempt_detail, name='attempt_detail'),
    path('attempts/<int:attempt_pk>/answers/', attempt_answers, name='attempt_answers'),

    # AI Submit & Complete
    path('submit-answer/', submit_answer, name='submit_answer'),
    path('complete-case/', complete_case, name='complete_case'),
]