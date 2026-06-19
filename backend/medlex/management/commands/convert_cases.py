"""
Конвертирует cases_parsed.json в новый формат для загрузки через админку.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_cases.py \
    --input management/json/cases_parsed.json \
    --output management/json/cases_converted.json
"""

"""
Каждый объект в JSON:
{
  "title":              str,   -- название задачи
  "short_description":  str,   -- короткое описание ситуации
  "full_description":   str,   -- полное описание ситуации
  "category":           str,   -- категория задачи
  "difficulty":         str,   -- уровень сложности задачи
}

Пример объекта:
{
  "title": "Задача о согласии пациента",
  "short_description": "Врач назначил операцию без...",
  "full_description": "Врач назначил операцию без...\n\nВопросы:\n1. ...\n\nОтвет:\n...\n\nНормативная база:\n• ...",
  "category": "Информированное согласие",
  "difficulty": "medium"
}
"""

import json
import argparse
from pathlib import Path


CATEGORY_KEYWORDS = {
    'Информированное согласие':  ['информированн', 'согласи', 'добровольн'],
    'Медицинская тайна':         ['тайн', 'конфиденциальн', 'персональн'],
    'Права пациента':            ['права пациент', 'право пациент'],
    'Документация':              ['документ', 'запись', 'история болезни', 'карта'],
    'Врачебная ошибка':          ['ошибк', 'ненадлежащ', 'халатн', 'дефект'],
    'Трудовые отношения':        ['трудов', 'увольнен', 'работодател', 'работник'],
    'Уголовная ответственность': ['уголовн', 'преступлен', 'убийств', 'ук рк'],
    'Лекарственное обеспечение': ['препарат', 'лекарств', 'медикамент'],
    'Скорая помощь':             ['скорая', 'неотложн', 'экстренн'],
    'Психиатрия':                ['психиатр', 'психическ', 'дееспособн'],
}


def guess_category(situation: str, answer: str) -> str:
    text = (situation + ' ' + answer).lower()
    for cat_name, keywords in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in keywords):
            return cat_name
    return 'Без категории'


def guess_difficulty(num_questions: int) -> str:
    if num_questions <= 2:
        return 'easy'
    if num_questions <= 4:
        return 'medium'
    return 'hard'


def build_full_description(item: dict) -> str:
    """
    Собирает full_description из situation, questions, answer, legal_basis, conclusion.
    """
    parts = []

    parts.append(item['situation'])

    if item.get('questions'):
        parts.append('\nВопросы:')
        for i, q in enumerate(item['questions'], 1):
            parts.append(f"{i}. {q}")

    if item.get('answer'):
        parts.append(f"\nОтвет:\n{item['answer']}")

    if item.get('legal_basis'):
        legal_text = '\n'.join(f"• {ref}" for ref in item['legal_basis'])
        parts.append(f"\nНормативная база:\n{legal_text}")

    if item.get('conclusion'):
        parts.append(f"\nВывод:\n{item['conclusion']}")

    return '\n'.join(parts)


def convert(input_path: Path, output_path: Path):
    data = json.loads(input_path.read_text(encoding='utf-8'))
    converted = []

    for item in data:
        situation = item.get('situation', '')
        answer = item.get('answer', '')
        questions = item.get('questions', [])

        converted.append({
            'title':             item['title'],
            'short_description': situation[:500],
            'full_description':  build_full_description(item),
            'category':          guess_category(situation, answer),
            'difficulty':        guess_difficulty(len(questions)),
        })

    output_path.write_text(
        json.dumps(converted, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )
    print(f"Готово! Конвертировано {len(converted)} записей → {output_path}")
    print(f"\nДоступные категории в этом файле:")
    for cat in sorted({c['category'] for c in converted}):
        print(f"  • {cat}")


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--input',  default=str(JSON / 'cases_parsed.json'),    help='Входной JSON файл')
    parser.add_argument('--output', default=str(JSON / 'cases_converted.json'), help='Выходной JSON файл')
    args = parser.parse_args()

    convert(Path(args.input), Path(args.output))