"""
Извлекает уникальные категории из cases_parsed.json и создаёт categories.json.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_categories.py \
    --input management/json/cases_parsed.json \
    --output management/json/categories.json
"""

"""
Каждый объект в JSON:
{
  "name":              str,   -- название категории
  "description":  str,        -- описание категории
}

Пример объекта:
{
"name": "Информированное согласие",
"description": "Кейсы по теме получения информированного добровольного согласия пациента."
}
"""


import json
import argparse
from pathlib import Path


CATEGORY_KEYWORDS = {
    'Информированное согласие':  {
        'keywords': ['информированн', 'согласи', 'добровольн'],
        'description': 'Кейсы по теме получения информированного добровольного согласия пациента.',
    },
    'Медицинская тайна': {
        'keywords': ['тайн', 'конфиденциальн', 'персональн'],
        'description': 'Кейсы по теме соблюдения врачебной тайны и защиты персональных данных.',
    },
    'Права пациента': {
        'keywords': ['права пациент', 'право пациент'],
        'description': 'Кейсы по теме прав пациентов при получении медицинской помощи.',
    },
    'Документация': {
        'keywords': ['документ', 'запись', 'история болезни', 'карта'],
        'description': 'Кейсы по теме ведения медицинской документации и историй болезни.',
    },
    'Врачебная ошибка': {
        'keywords': ['ошибк', 'ненадлежащ', 'халатн', 'дефект'],
        'description': 'Кейсы по теме врачебных ошибок, ненадлежащего оказания медицинской помощи.',
    },
    'Трудовые отношения': {
        'keywords': ['трудов', 'увольнен', 'работодател', 'работник'],
        'description': 'Кейсы по теме трудовых отношений медицинского персонала.',
    },
    'Уголовная ответственность': {
        'keywords': ['уголовн', 'преступлен', 'убийств', 'ук рк'],
        'description': 'Кейсы по теме уголовной ответственности медицинских работников.',
    },
    'Лекарственное обеспечение': {
        'keywords': ['препарат', 'лекарств', 'медикамент'],
        'description': 'Кейсы по теме назначения и обеспечения лекарственными препаратами.',
    },
    'Скорая помощь': {
        'keywords': ['скорая', 'неотложн', 'экстренн'],
        'description': 'Кейсы по теме оказания скорой и неотложной медицинской помощи.',
    },
    'Психиатрия': {
        'keywords': ['психиатр', 'психическ', 'дееспособн'],
        'description': 'Кейсы по теме психиатрической помощи и дееспособности пациентов.',
    },
}


def detect_category(situation: str, answer: str) -> str | None:
    text = (situation + ' ' + answer).lower()
    for cat_name, data in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in data['keywords']):
            return cat_name
    return None


def convert(input_path: Path, output_path: Path):
    data = json.loads(input_path.read_text(encoding='utf-8'))

    found_categories = set()
    for item in data:
        cat = detect_category(item.get('situation', ''), item.get('answer', ''))
        if cat:
            found_categories.add(cat)

    # Сохраняем только те категории, которые реально встречаются в данных
    categories = [
        {
            'name': cat_name,
            'description': CATEGORY_KEYWORDS[cat_name]['description'],
        }
        for cat_name in CATEGORY_KEYWORDS
        if cat_name in found_categories
    ]

    output_path.write_text(
        json.dumps(categories, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    print(f"Готово! Найдено {len(categories)} категорий → {output_path}")
    print("\nКатегории:")
    for cat in categories:
        print(f"  • {cat['name']}")


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--input',  default=str(JSON / 'cases_parsed.json'), help='Входной JSON файл')
    parser.add_argument('--output', default=str(JSON / 'categories_converted.json'),   help='Выходной JSON файл')
    args = parser.parse_args()

    convert(Path(args.input), Path(args.output))