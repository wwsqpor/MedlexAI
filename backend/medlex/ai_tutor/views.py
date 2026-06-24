from django.shortcuts import render
from .rag import search_law
import requests
from django.conf import settings
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from .models import ChatSession, ChatMessage

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def ai_tutor_chat(request):
    message = request.data.get("message", "")
    message_lower = message.strip().lower()

    if not message.strip():
        return Response({"error": "Сообщение пустое"}, status=400)
    session, _ = ChatSession.objects.get_or_create(
        user=request.user,
        title="Мой чат"
)

    ChatMessage.objects.create(
        session=session,
        role="user",
        content=message
) 
    simple_answers = {
        "привет": "Привет! Чем могу помочь?",
        "здравствуй": "Здравствуйте! Чем могу помочь?",
        "как дела": "Все хорошо 😊 А у тебя как?",
        "спасибо": "Пожалуйста! Если появятся вопросы — обращайся.",
        "доброе утро": "Доброе утро! Чем могу помочь?",
        "добрый день": "Добрый день! Чем могу помочь?",
        "добрый вечер": "Добрый вечер! Чем могу помочь?",
    }

    if message_lower in simple_answers:
        answer = simple_answers[message_lower]

        ChatMessage.objects.create(
            session=session,
            role="assistant",
            content=answer
        )

        return Response({
            "answer": answer
        })




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

ВАЖНО:

Если сообщение пользователя НЕ связано с:
- медициной;
- медицинским правом;
- пациентами;
- врачами;
- медицинскими организациями;
- законодательством,

то НЕ используй контекст закона вообще.

Отвечай как обычный дружелюбный помощник.

Примеры:

Пользователь: Привет
Ответ: Привет! Чем могу помочь?

Пользователь: Как дела?
Ответ: Все хорошо 😊 А у тебя как?

Пользователь: Спасибо
Ответ: Пожалуйста! Если появятся вопросы — обращайся.

Пользователь: Что ты умеешь?
Ответ: Я могу помочь с вопросами по медицинскому праву, медицине и обучению, а также ответить на общие вопросы.

Не используй китайские символы.

Не используй - "Похоже, что вы просто сказали "хорошо понятно" и не задали конкретный вопрос. Если так, то я отвечу соответствующим образом:", сразу перейди к сообщения 
"""
    
    history = ChatMessage.objects.filter(
        session=session
).order_by('-created_at')[:10]

    messages = [
    {
        "role": "system",
        "content": "Ты медицинско-правовой AI-Тьютор. Не давай официальную юридическую консультацию, объясняй учебно."
    }
]

    for msg in reversed(history):
        messages.append({
        "role": msg.role,
        "content": msg.content
    })

    messages.append({
    "role": "user",
    "content": prompt
})
    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers={
            "Authorization": f"Bearer {settings.OPENROUTER_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": "meta-llama/llama-3.3-70b-instruct",
            "messages": messages, 
            "temperature": 0.3,
        },
        timeout=30,
    )
    
    result = response.json()
    answer = result["choices"][0]["message"]["content"]
    ChatMessage.objects.create(
    session=session,
    role="assistant",
    content=answer
)

    return Response({
        "answer": answer
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def ai_tutor_history(request):
    session = ChatSession.objects.filter(user=request.user).first()

    if not session:
        return Response({"messages": []})

    messages = ChatMessage.objects.filter(session=session).order_by("created_at")

    return Response({
        "messages": [
            {
                "role": msg.role,
                "content": msg.content,
                "created_at": msg.created_at
            }
            for msg in messages
        ]
    })