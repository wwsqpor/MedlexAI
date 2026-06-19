"""
Django management command для загрузки заданий кейсов из case_tasks.json в БД.

Использование:
    python manage.py load_case_tasks
    python manage.py load_case_tasks --json /path/to/case_tasks.json
    python manage.py load_case_tasks --clear
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cases.models import Case, CaseTask, LawReference


class Command(BaseCommand):
    help = "Загружает задания кейсов из case_tasks.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'case_tasks.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие задания перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} заданий из {json_path}...")

        if options['clear']:
            deleted, _ = CaseTask.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_count = 0
        skipped_count = 0
        error_count = 0

        with transaction.atomic():
            for item in data:
                # Находим кейс
                try:
                    case = Case.objects.get(title=item['case'])
                except Case.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: кейс '{item['case']}' не найден"
                    ))
                    error_count += 1
                    continue

                # Пропускаем если задание уже существует
                if CaseTask.objects.filter(case=case, title=item['title']).exists():
                    skipped_count += 1
                    continue

                # Создаём задание
                task = CaseTask.objects.create(
                    case=case,
                    title=item['title'],
                    instruction=item['instruction'],
                    task_type=item['task_type'],
                    ideal_answer=item.get('ideal_answer', ''),
                    max_score=item.get('max_score', 100),
                )

                # Привязываем законы
                for law_ref in item.get('law_references', []):
                    try:
                        law = LawReference.objects.get(
                            title=law_ref['title'],
                            article_number=law_ref['article_number'],
                        )
                        task.law_references.add(law)
                    except LawReference.DoesNotExist:
                        self.stdout.write(self.style.WARNING(
                            f"  Закон не найден: {law_ref['title']} {law_ref['article_number']}"
                        ))

                created_count += 1
                self.stdout.write(f"  ✓ {case.title[:40]} — {task.title}")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}, ошибок: {error_count}."
        ))