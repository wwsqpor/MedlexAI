"""
Извлекает уникальные ссылки на законы из cases_parsed.json и создаёт law_references.json.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_law_references.py \
    --input management/json/cases_parsed.json \
    --output management/json/law_references.json
"""

"""
Каждый объект в JSON:
{
  "title":              str,   -- название закона
  "article_number":  str,      -- номер статьи
  "text":  str,                -- текст статьи
}

Пример объекта:
{
  "title": "Кодекс о здоровье народа и системе здравоохранения",
  "article_number": "ст. 134",
  "text": "Кодекс о здоровье народа и системе здравоохранения РК, ст. 134 — право пациента на информацию"
}
"""


import json
import re
import argparse
from pathlib import Path


# Известные законодательные акты РК для определения title
LAW_TITLES = [
    'Кодекс РК об административных правонарушениях',
    'Уголовный кодекс РК',
    'Уголовно-процессуальный кодекс РК',
    'Гражданский кодекс РК',
    'Гражданский процессуальный кодекс РК',
    'Трудовой кодекс РК',
    'Кодекс о здоровье народа и системе здравоохранения',
    'Кодекс о здоровье',
    'Закон РК об охране здоровья граждан',
    'Закон РК о психиатрической помощи',
    'Закон РК о персональных данных',
    'Закон РК о медицинском страховании',
    'Закон РК о лекарственных средствах',
    'Закон РК о правах пациентов',
    'Закон РК о донорстве крови',
    'Закон РК о трансплантации',
    'Конституция Республики Казахстан',
    'Конституция РК',
]

# Паттерны для извлечения номера статьи
ARTICLE_PATTERNS = [
    r'(ст(?:атья|\.)\s*\d+(?:\.\d+)?(?:\s*п(?:ункт|\.)\s*\d+)?)',
    r'(п(?:ункт|\.)\s*\d+\s+ст(?:атьи|\.)\s*\d+)',
    r'(\d+\s+ст(?:атья|атьи|\.)\s*\d+)',
]


def find_title(text: str) -> str:
    text_lower = text.lower()
    for title in LAW_TITLES:
        if title.lower() in text_lower:
            return title
    # Если не нашли точного совпадения — берём первые 80 символов как title
    return text[:80].strip()


def find_article_number(text: str) -> str:
    for pattern in ARTICLE_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)
        if match:
            return match.group(1).strip()
    return ''


def convert(input_path: Path, output_path: Path):
    data = json.loads(input_path.read_text(encoding='utf-8'))

    seen = set()
    law_references = []

    for item in data:
        legal_basis = item.get('legal_basis', [])
        for ref in legal_basis:
            ref = ref.strip()
            if not ref or ref in seen:
                continue
            seen.add(ref)

            law_references.append({
                'title':          find_title(ref),
                'article_number': find_article_number(ref),
                'text':           ref,
            })

    output_path.write_text(
        json.dumps(law_references, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    print(f"Готово! Найдено {len(law_references)} уникальных ссылок на законы → {output_path}")
    print("\nПримеры:")
    for ref in law_references[:5]:
        print(f"  title:          {ref['title']}")
        print(f"  article_number: {ref['article_number']}")
        print(f"  text:           {ref['text']}")
        print()


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--input',  default='../json/cases_parsed.json',   help='Входной JSON файл')
    parser.add_argument('--output', default='../json/law_references_converted.json', help='Выходной JSON файл')
    args = parser.parse_args()

    convert(Path(args.input), Path(args.output))