"""
Django management command для загрузки задач из cases_parsed.json в БД.

Использование:
    python manage.py load_cases
    python manage.py load_cases --json /path/to/cases_parsed.json
    python manage.py load_cases --clear   # очистить перед загрузкой

Разместить по пути:
    cases/management/commands/load_cases.py
"""

import re
import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cases.models import Case, Category, CaseTask, TaskOption, LawReference


def guess_difficulty(num_questions: int) -> str:
    if num_questions <= 2:
        return 'easy'
    if num_questions <= 4:
        return 'medium'
    return 'hard'


CATEGORY_KEYWORDS = {
    'Информированное согласие':  ['информированн', 'согласи', 'добровольн'],
    'Медицинская тайна':         ['тайн', 'конфиденциальн', 'персональн'],
    'Права пациента':            ['права пациент', 'право пациент'],
    'Документация':              ['документ', 'история болезни', 'медицинская карта'],
    'Врачебная ошибка':          ['ошибк', 'ненадлежащ', 'халатн', 'дефект'],
    'Трудовые отношения':        ['трудов', 'увольнен', 'работодател'],
    'Уголовная ответственность': ['уголовн', 'преступлен', 'ук рк'],
    'Лекарственное обеспечение': ['препарат', 'лекарств', 'медикамент'],
    'Скорая помощь':             ['скорая', 'неотложн', 'экстренн'],
    'Психиатрия':                ['психиатр', 'психическ', 'дееспособн'],
}

def detect_category(situation: str, answer: str):
    text = (situation + ' ' + answer).lower()
    for cat_name, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return cat_name
    return None


def split_answer(answer: str, num_questions: int) -> list:
    if not answer or num_questions == 0:
        return []
    if num_questions == 1:
        return [answer]

    parts = re.split(r'(?:^|\n)\s*\d+[.)]\s+', answer)
    parts = [p.strip() for p in parts if p.strip()]
    if len(parts) >= num_questions:
        return parts[:num_questions]

    paragraphs = [p.strip() for p in answer.split('\n\n') if p.strip()]
    if len(paragraphs) >= num_questions:
        return paragraphs[:num_questions]

    return [answer] * num_questions


class Command(BaseCommand):
    help = "Загружает задачи из cases_parsed.json в базу данных"

    def add_arguments(self, parser):
        parser.add_argument('--json', type=str, default='cases_parsed.json',
                             help='Путь к JSON-файлу')
        parser.add_argument('--clear', action='store_true',
                             help='Удалить все существующие кейсы перед загрузкой')

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} задач из {json_path}...\n")

        if options['clear']:
            deleted, _ = Case.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей.\n"))

        created_cases = 0
        created_tasks = 0
        skipped = 0

        with transaction.atomic():
            for item in data:
                case_id    = item['id']
                title      = item.get('title') or f"Задача № {case_id}"
                situation  = item.get('situation', '')
                questions  = item.get('questions', [])
                answer     = item.get('answer', '')
                legal      = item.get('legal_basis', [])
                conclusion = item.get('conclusion', '')

                if Case.objects.filter(title=title).exists():
                    self.stdout.write(f"  Пропущен (уже есть): #{case_id} {title[:55]}")
                    skipped += 1
                    continue

                category = None
                cat_name = detect_category(situation, answer)
                if cat_name:
                    category, _ = Category.objects.get_or_create(
                        name=cat_name,
                        defaults={'description': f'Задачи по теме: {cat_name}'}
                    )

                case = Case.objects.create(
                    title=title,
                    short_description=situation[:500] if situation else '',
                    full_description=situation,
                    category=category,
                    difficulty=guess_difficulty(len(questions)),
                )
                created_cases += 1

                law_refs = []
                for ref_text in legal:
                    if not ref_text.strip():
                        continue
                    art_m = re.search(r'(?:ст(?:атья|\.)\s*)(\d+(?:\.\d+)?)', ref_text, re.I)
                    article_number = art_m.group(1) if art_m else ''

                    law_ref, _ = LawReference.objects.get_or_create(
                        title=ref_text[:255],
                        defaults={'article_number': article_number, 'text': ref_text}
                    )
                    law_refs.append(law_ref)

                answer_parts = split_answer(answer, len(questions))

                for q_idx, q_text in enumerate(questions):
                    if not q_text.strip():
                        continue

                    explanation = answer_parts[q_idx] if q_idx < len(answer_parts) else answer

                    if q_idx == 0 and legal:
                        legal_block = '\n\nНормативная база:\n' + '\n'.join(f'• {r}' for r in legal)
                        explanation = (explanation or '') + legal_block

                    if q_idx == len(questions) - 1 and conclusion:
                        explanation = (explanation or '') + f'\n\nВывод: {conclusion}'

                    task = CaseTask.objects.create(
                        case=case,
                        title=q_text[:255],
                        instruction=q_text,
                        task_type='open',
                        ideal_answer=explanation,
                        max_score=round(100 / len(questions)),
                    )

                    if law_refs:
                        task.law_references.set(law_refs)

                    created_tasks += 1

                self.stdout.write(
                    f"  ✓ #{case_id:02d} {title[:55]:<55} "
                    f"[{len(questions)} вопр., {case.difficulty}]"
                )

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано кейсов: {created_cases}, "
            f"заданий: {created_tasks}, пропущено: {skipped}."
        ))