from datetime import timedelta

from django.db.models import Avg
from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from cases.models import CaseAttempt


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_view(request):
    user = request.user

    completed_attempts = CaseAttempt.objects.filter(
        user=user,
        status='completed'
    )

    completed_cases = completed_attempts.count()

    average_score = completed_attempts.aggregate(
        avg_score=Avg('total_score')
    )['avg_score'] or 0

    week_ago = timezone.now() - timedelta(days=7)

    completed_this_week = completed_attempts.filter(
        completed_at__gte=week_ago
    ).count()

    current_week_avg = completed_attempts.filter(
        completed_at__gte=week_ago
    ).aggregate(avg=Avg('total_score'))['avg'] or 0

    previous_avg = completed_attempts.filter(
        completed_at__lt=week_ago
    ).aggregate(avg=Avg('total_score'))['avg'] or 0

    if previous_avg == 0:
        score_change = 0
    else:
        score_change = round(current_week_avg - previous_avg)

    last_attempt = completed_attempts.order_by('-completed_at').first()
    best_attempt = completed_attempts.order_by('-total_score').first()

    last_in_progress = CaseAttempt.objects.filter(
        user=user,
        status='in_progress'
    ).order_by('-started_at').first()

    topic_stats = completed_attempts.values(
    'case__category__name'
).annotate(
    avg_score=Avg('total_score')
).order_by('-avg_score')

    strong_topics = [
        {
            "topic": item['case__category__name'],
            "score": round(item['avg_score'])
        }
        for item in topic_stats[:3]
    ]

    weak_topics = [
        {
            "topic": item['case__category__name'],
            "score": round(item['avg_score'])
        }
        for item in topic_stats.order_by('avg_score')[:3]
    ]

    data = {
        "user": {
            "name": getattr(user, "name", ""),
            "surname": getattr(user, "surname", ""),
            "role": "Студент"
        },
        "stats": {
            "completed_cases": completed_cases,
            "completed_this_week": completed_this_week,
            "average_score": round(average_score),
            "score_change": score_change,
            "last_case": {
                "title": last_attempt.case.title if last_attempt else None,
                "score": last_attempt.total_score if last_attempt else None,
            },
            "best_result": {
                "title": best_attempt.case.title if best_attempt else None,
                "score": best_attempt.total_score if best_attempt else None,
            }
        },
        "continue_case": {
            "attempt_id": last_in_progress.id if last_in_progress else None,
            "case_id": last_in_progress.case.id if last_in_progress else None,
            "title": last_in_progress.case.title if last_in_progress else None,
        },
        "progress": {
            "legal_rating": round(average_score),
            "max_rating": 100
        },
        "strong_topics": strong_topics,
        "weak_topics": weak_topics
    }

    return Response(data)
