import json
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from .models import Case, Category, LawReference, CaseTask, TaskOption, CaseAttempt, TaskAnswer
from .serializers import (
    CaseSerializer, UserCaseSerializer, CategorySerializer,
    LawReferenceSerializer, CaseTaskSerializer, TaskOptionSerializer,
    CaseAttemptSerializer, TaskAnswerSerializer,
)


# ─────────────────────────────────────────────
# Category
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def category_detail(request, pk):
    try:
        category = Category.objects.get(pk=pk)
    except Category.DoesNotExist:
        return Response({'error': 'Категория не найдена'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CategorySerializer(category)
    return Response(serializer.data)


# ─────────────────────────────────────────────
# LawReference
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def law_reference_list(request):
    laws = LawReference.objects.all()
    serializer = LawReferenceSerializer(laws, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def law_reference_detail(request, pk):
    try:
        law = LawReference.objects.get(pk=pk)
    except LawReference.DoesNotExist:
        return Response({'error': 'Закон не найден'}, status=status.HTTP_404_NOT_FOUND)
    serializer = LawReferenceSerializer(law)
    return Response(serializer.data)


# ─────────────────────────────────────────────
# Case
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def case_list(request):
    cases = Case.objects.select_related('category').all()

    category_id = request.query_params.get('category')
    difficulty = request.query_params.get('difficulty')

    if category_id:
        cases = cases.filter(category__id=category_id)
    if difficulty:
        cases = cases.filter(difficulty=difficulty)

    serializer = UserCaseSerializer(cases, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def case_detail(request, pk):
    try:
        case = Case.objects.select_related('category').prefetch_related('tasks__options').get(pk=pk)
    except Case.DoesNotExist:
        return Response({'error': 'Кейс не найден'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CaseSerializer(case)
    return Response(serializer.data)


# ─────────────────────────────────────────────
# CaseTask
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def case_task_list(request, case_pk):
    tasks = CaseTask.objects.filter(case__id=case_pk).prefetch_related('options', 'law_references')
    serializer = CaseTaskSerializer(tasks, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def case_task_detail(request, case_pk, task_pk):
    try:
        task = CaseTask.objects.prefetch_related('options', 'law_references').get(
            pk=task_pk, case__id=case_pk
        )
    except CaseTask.DoesNotExist:
        return Response({'error': 'Задание не найдено'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CaseTaskSerializer(task)
    return Response(serializer.data)


# ─────────────────────────────────────────────
# CaseAttempt
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_list(request):
    attempts = CaseAttempt.objects.filter(user=request.user).select_related('case')
    serializer = CaseAttemptSerializer(attempts, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_detail(request, pk):
    try:
        attempt = CaseAttempt.objects.select_related('case').get(pk=pk, user=request.user)
    except CaseAttempt.DoesNotExist:
        return Response({'error': 'Попытка не найдена'}, status=status.HTTP_404_NOT_FOUND)
    serializer = CaseAttemptSerializer(attempt)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def attempt_start(request):
    case_id = request.data.get('case_id')
    if not case_id:
        return Response({'error': 'case_id обязателен'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        case = Case.objects.get(pk=case_id)
    except Case.DoesNotExist:
        return Response({'error': 'Кейс не найден'}, status=status.HTTP_404_NOT_FOUND)

    # Проверяем нет ли уже активной попытки
    existing = CaseAttempt.objects.filter(
        user=request.user, case=case, status='in_progress'
    ).first()

    if existing:
        serializer = CaseAttemptSerializer(existing)
        return Response(serializer.data, status=status.HTTP_200_OK)

    attempt = CaseAttempt.objects.create(user=request.user, case=case)
    serializer = CaseAttemptSerializer(attempt)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


# ─────────────────────────────────────────────
# TaskAnswer
# ─────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def attempt_answers(request, attempt_pk):
    try:
        attempt = CaseAttempt.objects.get(pk=attempt_pk, user=request.user)
    except CaseAttempt.DoesNotExist:
        return Response({'error': 'Попытка не найдена'}, status=status.HTTP_404_NOT_FOUND)

    answers = TaskAnswer.objects.filter(attempt=attempt).select_related('task')
    serializer = TaskAnswerSerializer(answers, many=True)
    return Response(serializer.data)


# ─────────────────────────────────────────────
# AI Submit & Complete (existing)
# ─────────────────────────────────────────────

def get_law_context(task):
    laws = task.law_references.all()
    if not laws.exists():
        return "К этому вопросу не прикреплены законы."
    law_texts = []
    for law in laws:
        law_texts.append(
            f"\nНазвание: {law.title}\nСтатья: {law.article_number}\nТекст:\n{law.text}\n"
        )
    return "\n".join(law_texts)


def check_open_answer_with_ai(task, student_answer):
    law_context = get_law_context(task)

    prompt = f"""
Ты AI-тьютор MEDLEX AI.
Обращайся к студенту на "ты".
Пиши: "Ты правильно указал...", "Тебе нужно добавить..."

Проверь ответ студента на открытый медицинско-правовой вопрос.

Оцени не совпадение текста, а смысл:
- правильно ли студент понял ситуацию;
- правильно ли применил закон;
- есть ли юридическая логика;
- сделал ли правильный вывод.

Кейс:
{task.case.full_description}

Вопрос:
{task.title}

Инструкция:
{task.instruction}

Ответ студента:
{student_answer}

Законодательная база:
{law_context}

Верни строго JSON:
{{
  "score": от 0 до 100,
  "feedback": "короткий комментарий",
  "correct_answer": "пример правильного ответа",
  "what_is_correct": ["что студент написал правильно"],
  "what_is_missing": ["что студент пропустил"]
}}
"""

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "meta-llama/llama-3.3-70b-instruct",
            "messages": [
                {"role": "system", "content": "Ты юридический AI-экзаменатор. Отвечай только валидным JSON."},
                {"role": "user", "content": prompt}
            ],
            "temperature": 0.2,
        },
        timeout=30,
    )

    result = response.json()
    print(result)
    content = result["choices"][0]["message"]["content"]

    print("AI RAW CONTENT:", content)

    try:
        ai_data = json.loads(content)
    except json.JSONDecodeError:
        start = content.find("{")
        end = content.rfind("}") + 1
        if start == -1 or end == 0:
            return {
                "score": 0,
                "is_correct": False,
                "feedback": "AI не вернул корректный JSON.",
                "correct_answer": "",
                "what_is_correct": [],
                "what_is_missing": ["Ошибка проверки AI"],
            }
        ai_data = json.loads(content[start:end])

    score = int(ai_data.get("score", 0))
    return {
        "score": max(0, min(score, 100)),
        "is_correct": score >= 80,
        "feedback": ai_data.get("feedback", ""),
        "correct_answer": ai_data.get("correct_answer", ""),
        "what_is_correct": ai_data.get("what_is_correct", []),
        "what_is_missing": ai_data.get("what_is_missing", []),
    }


def calculate_task_score(task, selected_option_ids=None, open_answer=""):
    selected_option_ids = selected_option_ids or []

    if task.task_type == "test":
        correct_ids = set(task.options.filter(is_correct=True).values_list("id", flat=True))
        selected_ids = set(map(int, selected_option_ids))
        is_correct = selected_ids == correct_ids
        return {
            "score": 100 if is_correct else 0,
            "is_correct": is_correct,
            "feedback": "Ответ правильный" if is_correct else "Ответ неправильный",
            "correct_answer": "",
            "what_is_correct": [],
            "what_is_missing": [],
        }

    elif task.task_type == "order":
        correct_order_ids = list(task.options.order_by("correct_order").values_list("id", flat=True))
        selected_ids = list(map(int, selected_option_ids))
        if not correct_order_ids:
            return {
                "score": 0, "is_correct": False,
                "feedback": "Для задания не задан правильный порядок",
                "correct_answer": "", "what_is_correct": [], "what_is_missing": [],
            }
        correct_count = sum(
            1 for i, oid in enumerate(selected_ids)
            if i < len(correct_order_ids) and oid == correct_order_ids[i]
        )
        score = round((correct_count / len(correct_order_ids)) * 100)
        return {
            "score": score, "is_correct": score == 100,
            "feedback": f"Правильно расположено {correct_count} из {len(correct_order_ids)} шагов",
            "correct_answer": "", "what_is_correct": [], "what_is_missing": [],
        }

    elif task.task_type == "open":
        if not open_answer.strip():
            return {
                "score": 0, "is_correct": False,
                "feedback": "Открытый ответ пустой", "correct_answer": "",
                "what_is_correct": [], "what_is_missing": ["Ответ не был написан"],
            }
        return check_open_answer_with_ai(task, open_answer)

    return {
        "score": 0, "is_correct": False, "feedback": "Неизвестный тип задания",
        "correct_answer": "", "what_is_correct": [], "what_is_missing": [],
    }


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    attempt_id = request.data.get("attempt_id")
    task_id = request.data.get("task_id")
    selected_option_ids = request.data.get("selected_options", [])
    open_answer = request.data.get("open_answer", "")

    try:
        attempt = CaseAttempt.objects.get(id=attempt_id, user=request.user, status="in_progress")
    except CaseAttempt.DoesNotExist:
        return Response({"error": "Попытка не найдена"}, status=status.HTTP_404_NOT_FOUND)

    try:
        task = CaseTask.objects.get(id=task_id, case=attempt.case)
    except CaseTask.DoesNotExist:
        return Response({"error": "Задание не найдено"}, status=status.HTTP_404_NOT_FOUND)

    result = calculate_task_score(task=task, selected_option_ids=selected_option_ids, open_answer=open_answer)

    answer, created = TaskAnswer.objects.update_or_create(
        attempt=attempt,
        task=task,
        defaults={
            "open_answer": open_answer,
            "score": result["score"],
            "is_correct": result["is_correct"],
            "ai_feedback": result["feedback"],
            "ai_correct_answer": result["correct_answer"],
            "ai_what_is_correct": result["what_is_correct"],
            "ai_what_is_missing": result["what_is_missing"],
        }
    )
    answer.selected_options.set(selected_option_ids)

    return Response({
        "answer_id": answer.id,
        "task": task.id,
        "selected_options": selected_option_ids,
        "score": result["score"],
        "is_correct": result["is_correct"],
        "feedback": result["feedback"],
        "correct_answer": result["correct_answer"],
        "what_is_correct": result["what_is_correct"],
        "what_is_missing": result["what_is_missing"],
    })


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def complete_case(request):
    attempt_id = request.data.get("attempt_id")

    try:
        attempt = CaseAttempt.objects.get(id=attempt_id, user=request.user, status="in_progress")
    except CaseAttempt.DoesNotExist:
        return Response({"error": "Попытка не найдена"}, status=status.HTTP_404_NOT_FOUND)

    answers = attempt.answers.all()
    if not answers.exists():
        return Response({"error": "Нет ответов для подсчёта"}, status=status.HTTP_400_BAD_REQUEST)

    total_score = round(sum(a.score for a in answers) / answers.count())
    attempt.total_score = total_score
    attempt.status = "completed"
    attempt.completed_at = timezone.now()
    attempt.save()

    return Response({
        "attempt_id": attempt.id,
        "case": attempt.case.title,
        "total_score": total_score,
        "status": attempt.status,
        "completed_at": attempt.completed_at,
    })

