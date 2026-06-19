"""
Django management command для загрузки ответов на задания из task_answers.json в БД.

Использование:
    python manage.py load_task_answers
    python manage.py load_task_answers --json /path/to/task_answers.json
    python manage.py load_task_answers --clear
"""

import json
from pathlib import Path
from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
import pytz

from cases.models import Case, CaseTask, CaseAttempt, TaskAnswer, TaskOption


class Command(BaseCommand):
    help = "Загружает ответы на задания из task_answers.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'task_answers.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие ответы перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} ответов из {json_path}...")

        if options['clear']:
            deleted, _ = TaskAnswer.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_count = 0
        skipped_count = 0
        error_count = 0

        with transaction.atomic():
            for item in data:
                try:
                    attempt = CaseAttempt.objects.filter(
                        user__email=item['attempt_user'],
                        case__title=item['attempt_case'],
                    ).first()

                    if attempt is None:
                        self.stdout.write(self.style.WARNING(
                            f"  Пропущен: попытка не найдена для {item['attempt_user']} / {item['attempt_case']}"
                        ))
                        error_count += 1
                        continue
                except CaseAttempt.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: попытка не найдена для {item['attempt_user']} / {item['attempt_case']}"
                    ))
                    error_count += 1
                    continue

                # Находим задание
                try:
                    task = CaseTask.objects.get(
                        case__title=item['task_case'],
                        title=item['task_title'],
                    )
                except CaseTask.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: задание '{item['task_title']}' не найдено в кейсе '{item['task_case']}'"
                    ))
                    error_count += 1
                    continue

                # Пропускаем если ответ уже существует
                if TaskAnswer.objects.filter(attempt=attempt, task=task).exists():
                    skipped_count += 1
                    continue

                # Создаём ответ
                answer = TaskAnswer.objects.create(
                    attempt=attempt,
                    task=task,
                    open_answer=item.get('open_answer', ''),
                    score=item.get('score', 0),
                    is_correct=item.get('is_correct', False),
                    ai_feedback=item.get('ai_feedback', ''),
                    ai_correct_answer=item.get('ai_correct_answer', ''),
                    ai_what_is_correct=item.get('ai_what_is_correct', []),
                    ai_what_is_missing=item.get('ai_what_is_missing', []),
                )

                # Привязываем выбранные варианты ответа (для тестов)
                for option_text in item.get('selected_options', []):
                    try:
                        option = TaskOption.objects.get(task=task, text=option_text)
                        answer.selected_options.add(option)
                    except TaskOption.DoesNotExist:
                        pass

                created_count += 1

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}, ошибок: {error_count}."
        ))