"""
Конвертирует cases_parsed.json в task_options.json.

Поскольку в исходных данных нет готовых вариантов ответа (все вопросы открытые),
скрипт генерирует варианты следующим образом:
- 1 правильный вариант — из текста answer для данного вопроса
- 3 неправильных варианта — из ответов других случайных кейсов

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_task_options.py \
    --input management/json/cases_parsed.json \
    --output management/json/task_options.json
"""

import json
import re
import random
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


def convert(input_path: Path, output_path: Path):
    data = json.loads(input_path.read_text(encoding='utf-8'))

    # Собираем все ответы из всех кейсов для генерации неправильных вариантов
    all_answers = []
    for item in data:
        parts = split_answer_by_questions(item.get('answer', ''), len(item.get('questions', [])))
        for part in parts:
            if part and len(part) > 20:
                all_answers.append(part.strip()[:300])

    task_options = []

    for item in data:
        questions = item.get('questions', [])
        answer = item.get('answer', '')
        case_title = item.get('title', f"Задача №{item['id']}")
        answer_parts = split_answer_by_questions(answer, len(questions))

        for idx, question in enumerate(questions):
            if not question.strip():
                continue

            task_title = f"Вопрос {idx + 1}"
            correct_text = (answer_parts[idx] if idx < len(answer_parts) else answer).strip()[:300]

            if not correct_text:
                continue

            # Правильный вариант
            task_options.append({
                "case":          case_title,
                "task_title":    task_title,
                "text":          correct_text,
                "is_correct":    True,
                "correct_order": None,
            })

            # 3 неправильных варианта из других ответов
            wrong_pool = [a for a in all_answers if a != correct_text]
            wrong_choices = random.sample(wrong_pool, min(3, len(wrong_pool)))
            for wrong in wrong_choices:
                task_options.append({
                    "case":          case_title,
                    "task_title":    task_title,
                    "text":          wrong,
                    "is_correct":    False,
                    "correct_order": None,
                })

    output_path.write_text(
        json.dumps(task_options, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    print(f"Готово! Создано {len(task_options)} вариантов ответа → {output_path}")


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--input',  default=str(JSON / 'cases_parsed.json'), help='Входной JSON файл')
    parser.add_argument('--output', default=str(JSON / 'task_options.json'), help='Выходной JSON файл')
    args = parser.parse_args()

    random.seed(42)
    convert(Path(args.input), Path(args.output))