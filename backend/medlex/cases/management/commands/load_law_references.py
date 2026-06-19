"""
Django management command для загрузки ссылок на законы из law_references_converted.json в БД.

Использование:
    python manage.py law_references_converted
    python manage.py law_references_converted --json /path/to/law_references_converted.json
    python manage.py law_references_converted --clear
"""

import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cases.models import LawReference


class Command(BaseCommand):
    help = "Загружает ссылки на законы из law_references_converted.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'law_references_converted.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие записи перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} законов из {json_path}...")

        if options['clear']:
            deleted, _ = LawReference.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_count = 0
        skipped_count = 0

        with transaction.atomic():
            for item in data:
                if LawReference.objects.filter(
                    title=item['title'],
                    article_number=item.get('article_number', ''),
                ).exists():
                    skipped_count += 1
                    continue

                LawReference.objects.create(
                    title=item['title'],
                    article_number=item.get('article_number', ''),
                    text=item['text'],
                )
                created_count += 1
                self.stdout.write(f"  ✓ {item['title']} {item.get('article_number', '')}")

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано: {created_count}, пропущено: {skipped_count}."
        ))