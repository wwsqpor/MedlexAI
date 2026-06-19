"""
Конвертирует cases_parsed.json в case_tasks.json.

Каждый вопрос из questions становится отдельным CaseTask.
Ответ из answer делится по вопросам как ideal_answer.
law_references привязываются по совпадению текста.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_case_tasks.py \
    --input management/json/cases_parsed.json \
    --law management/json/law_references.json \
    --output management/json/case_tasks.json
"""

import json
import re
import argparse
from pathlib import Path


def split_answer_by_questions(answer: str, num_questions: int) -> list:
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


def find_matching_law_refs(legal_basis: list, law_refs: list) -> list:
    """Находит совпадающие законы по тексту и возвращает их title + article_number."""
    matched = []
    for basis in legal_basis:
        basis_lower = basis.lower()
        for ref in law_refs:
            if ref['text'].lower() in basis_lower or basis_lower in ref['text'].lower():
                matched.append({
                    "title": ref["title"],
                    "article_number": ref["article_number"],
                })
                break
    return matched


def convert(input_path: Path, law_path: Path, output_path: Path):
    data = json.loads(input_path.read_text(encoding='utf-8'))
    law_refs = json.loads(law_path.read_text(encoding='utf-8')) if law_path.exists() else []

    case_tasks = []

    for item in data:
        questions = item.get('questions', [])
        answer = item.get('answer', '')
        legal_basis = item.get('legal_basis', [])
        case_title = item.get('title', f"Задача №{item['id']}")

        answer_parts = split_answer_by_questions(answer, len(questions))
        matched_laws = find_matching_law_refs(legal_basis, law_refs)

        for idx, question in enumerate(questions):
            if not question.strip():
                continue

            ideal = answer_parts[idx] if idx < len(answer_parts) else answer

            case_tasks.append({
                "case":           case_title,
                "title":          f"Вопрос {idx + 1}",
                "instruction":    question.strip(),
                "task_type":      "open",
                "ideal_answer":   ideal.strip(),
                "max_score":      100,
                "law_references": matched_laws,
            })

    output_path.write_text(
        json.dumps(case_tasks, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    print(f"Готово! Создано {len(case_tasks)} заданий → {output_path}")


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--input',  default=str(JSON / 'cases_parsed.json'),      help='Входной JSON файл')
    parser.add_argument('--law',    default=str(JSON / 'law_references.json'),    help='JSON с законами')
    parser.add_argument('--output', default=str(JSON / 'case_tasks.json'),        help='Выходной JSON файл')
    args = parser.parse_args()

    convert(Path(args.input), Path(args.law), Path(args.output))