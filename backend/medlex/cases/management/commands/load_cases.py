import json
import re
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError
from django.db import transaction

from cases.models import Case, Category, Question, AnswerOption


def guess_difficulty(num_questions: int) -> str:
    if num_questions <= 2:
        return 'easy'
    if num_questions <= 4:
        return 'medium'
    return 'hard'


class Command(BaseCommand):
    help = "Загружает задачи из cases_parsed.json в базу данных"

    def add_arguments(self, parser):
        DIR = Path(__file__).resolve().parent
        JSON = DIR.parent.parent.parent / 'management' / 'json'

        parser.add_argument(
            '--json',
            type=str,
            default=str(JSON / 'cases_parsed.json'),
            help='Путь к JSON-файлу',
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Удалить все существующие кейсы перед загрузкой',
        )

    def handle(self, *args, **options):
        json_path = Path(options['json'])
        if not json_path.exists():
            raise CommandError(f"Файл не найден: {json_path}")

        data = json.loads(json_path.read_text(encoding='utf-8'))
        self.stdout.write(f"Загружаю {len(data)} задач из {json_path}...")

        if options['clear']:
            deleted, _ = Case.objects.all().delete()
            self.stdout.write(self.style.WARNING(f"Удалено {deleted} существующих записей."))

        created_cases = 0
        created_questions = 0
        skipped = 0

        with transaction.atomic():
            for item in data:
                case_id = item['id']

                if Case.objects.filter(title=item['title']).exists():
                    self.stdout.write(f"  Пропущен (уже есть): #{case_id} {item['title'][:50]}")
                    skipped += 1
                    continue

                text_for_category = (item['situation'] + ' ' + item.get('answer', '')).lower()
                category_keywords = {
                    'Информированное согласие':  ['информированн', 'согласи', 'добровольн'],
                    'Медицинская тайна':          ['тайн', 'конфиденциальн', 'персональн'],
                    'Права пациента':             ['права пациент', 'право пациент'],
                    'Документация':               ['документ', 'запись', 'история болезни', 'карта'],
                    'Врачебная ошибка':           ['ошибк', 'ненадлежащ', 'халатн', 'дефект'],
                    'Трудовые отношения':         ['трудов', 'увольнен', 'работодател', 'работник'],
                    'Уголовная ответственность':  ['уголовн', 'преступлен', 'убийств', 'ук рк'],
                    'Лекарственное обеспечение':  ['препарат', 'лекарств', 'медикамент'],
                    'Скорая помощь':              ['скорая', 'неотложн', 'экстренн'],
                    'Психиатрия':                 ['психиатр', 'психическ', 'дееспособн'],
                }

                matched_category = None
                for cat_name, keywords in category_keywords.items():
                    if any(kw in text_for_category for kw in keywords):
                        matched_category, _ = Category.objects.get_or_create(
                            name=cat_name,
                            defaults={'description': f'Задачи по теме: {cat_name}'}
                        )
                        break

                questions_list = item.get('questions', [])
                case = Case.objects.create(
                    title=item['title'] or f"Задача № {case_id}",
                    short_description=item['situation'][:500],
                    full_description=item['situation'],
                    category=matched_category,
                    difficulty=guess_difficulty(len(questions_list)),
                )
                created_cases += 1

                answer_text = item.get('answer', '')
                legal_basis = item.get('legal_basis', [])
                answer_parts = _split_answer_by_questions(answer_text, len(questions_list))

                for q_idx, q_text in enumerate(questions_list):
                    if not q_text.strip():
                        continue

                    explanation = answer_parts[q_idx] if q_idx < len(answer_parts) else ''

                    if q_idx == 0 and legal_basis:
                        legal_text = '\n'.join(f"• {ref}" for ref in legal_basis)
                        explanation = (explanation + f"\n\nНормативная база:\n{legal_text}").strip()

                    question = Question.objects.create(
                        case=case,
                        text=q_text,
                        order=q_idx + 1,
                        explanation=explanation,
                    )
                    created_questions += 1

                    correct_text = answer_parts[q_idx] if q_idx < len(answer_parts) else answer_text
                    if correct_text:
                        AnswerOption.objects.create(
                            question=question,
                            text=correct_text[:500],
                            is_correct=True,
                        )

                self.stdout.write(
                    f"  ✓ #{case_id:02d} {case.title[:55]:<55} "
                    f"[{len(questions_list)} вопр., {case.difficulty}]"
                )

        self.stdout.write("")
        self.stdout.write(self.style.SUCCESS(
            f"Готово! Создано кейсов: {created_cases}, "
            f"вопросов: {created_questions}, пропущено: {skipped}."
        ))


def _split_answer_by_questions(answer: str, num_questions: int) -> list:
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
