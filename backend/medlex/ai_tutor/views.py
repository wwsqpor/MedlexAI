from django.shortcuts import render
from .rag import search_law
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_tutor_chat(request):
    message = request.data.get("message", "")

    if not message.strip():
        return Response({"error": "Сообщение пустое"}, status=400)
    law_context = search_law(message)

    prompt = f"""
Ты AI-Тьютор MEDLEX AI.

Отвечай только на основе найденных норм закона ниже.
Если информации недостаточно, скажи, что в найденном фрагменте закона нет точного ответа.

Контекст из закона:
{law_context}

Ситуация пользователя:
{message}

Объясни простым языком:
1. правомерна ли ситуация;
2. какие права/обязанности есть;
3. какие статьи закона подходят;
4. как правильно поступить.
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
                    "content": "Ты медицинско-правовой AI-Тьютор. Не давай официальную юридическую консультацию, объясняй учебно."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.3,
        },
        timeout=30,
    )
    
    result = response.json()
    answer = result["choices"][0]["message"]["content"]

    return Response({
        "answer": answer
    })