import json
import requests
from django.conf import settings
from django.utils import timezone
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import CaseTask, CaseAttempt, TaskAnswer


def get_law_context(task):
    laws = task.law_references.all()

    if not laws.exists():
        return "К этому вопросу не прикреплены законы."

    law_texts = []

    for law in laws:
        law_texts.append(
            f"""
Название: {law.title}
Статья: {law.article_number}
Текст:
{law.text}
"""
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
  "score": 0,
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
                {
                    "role": "system",
                    "content": "Ты юридический AI-экзаменатор. Отвечай только валидным JSON."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.2,
        },
        timeout=30,
    )

    result = response.json()
    content = result["choices"][0]["message"]["content"]
    


    result = response.json()
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

        json_part = content[start:end]
        ai_data = json.loads(json_part)


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
        correct_ids = set(
            task.options.filter(is_correct=True).values_list("id", flat=True)
        )
        selected_ids = set(map(int, selected_option_ids))

        is_correct = selected_ids == correct_ids
        score = 100 if is_correct else 0

        return {
            "score": score,
            "is_correct": is_correct,
            "feedback": "Ответ правильный" if is_correct else "Ответ неправильный",
            "correct_answer": "",
            "what_is_correct": [],
            "what_is_missing": [],
        }

    elif task.task_type == "order":
        correct_order_ids = list(
            task.options.order_by("correct_order").values_list("id", flat=True)
        )
        selected_ids = list(map(int, selected_option_ids))

        if not correct_order_ids:
            return {
                "score": 0,
                "is_correct": False,
                "feedback": "Для задания не задан правильный порядок",
                "correct_answer": "",
                "what_is_correct": [],
                "what_is_missing": [],
            }

        correct_count = 0

        for index, option_id in enumerate(selected_ids):
            if index < len(correct_order_ids) and option_id == correct_order_ids[index]:
                correct_count += 1

        score = round((correct_count / len(correct_order_ids)) * 100)

        return {
            "score": score,
            "is_correct": score == 100,
            "feedback": f"Правильно расположено {correct_count} из {len(correct_order_ids)} шагов",
            "correct_answer": "",
            "what_is_correct": [],
            "what_is_missing": [],
        }

    elif task.task_type == "open":
        if not open_answer.strip():
            return {
                "score": 0,
                "is_correct": False,
                "feedback": "Открытый ответ пустой",
                "correct_answer": "",
                "what_is_correct": [],
                "what_is_missing": ["Ответ не был написан"],
            }

        return check_open_answer_with_ai(task, open_answer)

    return {
        "score": 0,
        "is_correct": False,
        "feedback": "Неизвестный тип задания",
        "correct_answer": "",
        "what_is_correct": [],
        "what_is_missing": [],
    }


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def submit_answer(request):
    attempt_id = request.data.get("attempt_id")
    task_id = request.data.get("task_id")
    selected_option_ids = request.data.get("selected_options", [])
    open_answer = request.data.get("open_answer", "")

    try:
        attempt = CaseAttempt.objects.get(
            id=attempt_id,
            user=request.user,
            status="in_progress"
        )
    except CaseAttempt.DoesNotExist:
        return Response(
            {"error": "Попытка не найдена"},
            status=status.HTTP_404_NOT_FOUND
        )

    try:
        task = CaseTask.objects.get(
            id=task_id,
            case=attempt.case
        )
    except CaseTask.DoesNotExist:
        return Response(
            {"error": "Задание не найдено"},
            status=status.HTTP_404_NOT_FOUND
        )

    result = calculate_task_score(
        task=task,
        selected_option_ids=selected_option_ids,
        open_answer=open_answer
    )

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
        "task": task.title,
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
        attempt = CaseAttempt.objects.get(
            id=attempt_id,
            user=request.user,
            status="in_progress"
        )
    except CaseAttempt.DoesNotExist:
        return Response(
            {"error": "Попытка не найдена"},
            status=status.HTTP_404_NOT_FOUND
        )

    answers = attempt.answers.all()

    if not answers.exists():
        return Response(
            {"error": "Нет ответов для подсчёта"},
            status=status.HTTP_400_BAD_REQUEST
        )

    total_score = round(
        sum(answer.score for answer in answers) / answers.count()
    )

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