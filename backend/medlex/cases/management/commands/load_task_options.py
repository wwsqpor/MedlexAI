"""
Django management command для загрузки вариантов ответа из task_options.json в БД.

Использование:
    python manage.py load_task_options
    python manage.py load_task_options --json /path/to/task_options.json
    python manage.py load_task_options --clear
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cases.models import CaseTask, TaskOption


class Command(BaseCommand):
    help = "Загружает варианты ответа из task_options.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'task_options.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие варианты перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} вариантов из {json_path}...")

        if options['clear']:
            deleted, _ = TaskOption.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_count = 0
        skipped_count = 0
        error_count = 0

        with transaction.atomic():
            for item in data:
                # Находим задание
                task = CaseTask.objects.filter(
                    case__title=item['case'],
                    title=item['task_title'],
                ).first()

                if task is None:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: задание '{item['task_title']}' не найдено в кейсе '{item['case']}'"
                    ))
                    error_count += 1
                    continue

                # Пропускаем если вариант уже существует
                if TaskOption.objects.filter(task=task, text=item['text']).exists():
                    skipped_count += 1
                    continue

                TaskOption.objects.create(
                    task=task,
                    text=item['text'],
                    is_correct=item.get('is_correct', False),
                    correct_order=item.get('correct_order'),
                )
                created_count += 1

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}, ошибок: {error_count}."
        ))