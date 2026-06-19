"""
Django management command для загрузки попыток прохождения кейсов из case_attempts.json в БД.

Использование:
    python manage.py load_case_attempts
    python manage.py load_case_attempts --json /path/to/case_attempts.json
    python manage.py load_case_attempts --clear
"""

import json
from pathlib import Path
from datetime import datetime

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction
from django.utils import timezone
import pytz

from cases.models import Case, CaseAttempt
from accounts.models import User


class Command(BaseCommand):
    help = "Загружает попытки прохождения кейсов из case_attempts.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'case_attempts.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие попытки перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} попыток из {json_path}...")

        if options['clear']:
            deleted, _ = CaseAttempt.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_count = 0
        skipped_count = 0
        error_count = 0

        with transaction.atomic():
            for item in data:
                # Находим пользователя
                try:
                    user = User.objects.get(email=item['user'])
                except User.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: пользователь {item['user']} не найден"
                    ))
                    error_count += 1
                    continue

                # Находим кейс
                try:
                    case = Case.objects.get(title=item['case'])
                except Case.DoesNotExist:
                    self.stdout.write(self.style.WARNING(
                        f"  Пропущен: кейс '{item['case']}' не найден"
                    ))
                    error_count += 1
                    continue

                # Пропускаем если попытка уже существует
                if CaseAttempt.objects.filter(
                    user=user,
                    case=case,
                    started_at=item['started_at']
                ).exists():
                    skipped_count += 1
                    continue

                # Парсим даты
                started_at = datetime.strptime(item['started_at'], "%Y-%m-%dT%H:%M:%S")
                completed_at = None
                if item.get('completed_at'):
                    completed_at = timezone.make_aware(datetime.strptime(item['completed_at'], "%Y-%m-%dT%H:%M:%S"))

                CaseAttempt.objects.create(
                    user=user,
                    case=case,
                    status=item['status'],
                    total_score=item['total_score'],
                    started_at=started_at,
                    completed_at=completed_at,
                )
                created_count += 1

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}, ошибок: {error_count}."
        ))