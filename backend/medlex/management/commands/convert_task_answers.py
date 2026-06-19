"""
Генерирует тестовые ответы на задания (TaskAnswer) для тестовых попыток.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_task_answers.py \
    --attempts management/json/case_attempts.json \
    --tasks management/json/case_tasks.json \
    --output management/json/task_answers.json
"""

import json
import random
import argparse
from pathlib import Path


POSITIVE_FEEDBACK = [
    "Студент верно определил правовую основу ситуации.",
    "Ответ содержит правильную ссылку на нормативный акт.",
    "Студент корректно квалифицировал действия врача.",
    "Верно указаны права пациента в данной ситуации.",
    "Студент правильно определил ответственность медицинского работника.",
]

NEGATIVE_FEEDBACK = [
    "Студент не указал конкретную статью закона.",
    "Ответ неполный — не раскрыта правовая ответственность.",
    "Не упомянуты права пациента на информированное согласие.",
    "Студент не указал последствия нарушения медицинской тайны.",
    "Отсутствует ссылка на Кодекс о здоровье народа РК.",
]

WHAT_IS_CORRECT_OPTIONS = [
    "Верно определена правовая норма",
    "Правильно указан субъект ответственности",
    "Корректно описана ситуация нарушения",
    "Верно названы права пациента",
    "Правильно квалифицированы действия врача",
    "Указан соответствующий нормативный акт",
]

WHAT_IS_MISSING_OPTIONS = [
    "Не указан номер статьи закона",
    "Не раскрыта форма ответственности",
    "Пропущены права пациента на обжалование",
    "Не упомянута роль медицинской организации",
    "Отсутствует вывод по ситуации",
    "Не указаны сроки обращения в суд",
]


def generate_open_answer(ideal_answer: str, is_correct: bool) -> str:
    """Генерирует правдоподобный открытый ответ студента."""
    if not ideal_answer:
        return ""
    words = ideal_answer.split()
    if is_correct:
        # Правильный ответ — берём большую часть эталонного ответа
        cutoff = max(int(len(words) * random.uniform(0.7, 1.0)), 5)
        return ' '.join(words[:cutoff])
    else:
        # Неправильный ответ — берём малую часть или перемешиваем
        cutoff = max(int(len(words) * random.uniform(0.1, 0.4)), 3)
        sample = words[:cutoff]
        random.shuffle(sample)
        return ' '.join(sample)


def convert(attempts_path: Path, tasks_path: Path, output_path: Path):
    attempts = json.loads(attempts_path.read_text(encoding='utf-8'))
    tasks = json.loads(tasks_path.read_text(encoding='utf-8'))

    # Индекс задач по (case_title, task_title)
    task_index = {(t['case'], t['title']): t for t in tasks}
    # Все задачи сгруппированные по кейсу
    tasks_by_case = {}
    for t in tasks:
        tasks_by_case.setdefault(t['case'], []).append(t)

    answers = []

    for attempt in attempts:
        # in_progress попытки имеют только часть ответов
        case_tasks = tasks_by_case.get(attempt['case'], [])
        if not case_tasks:
            continue

        if attempt['status'] == 'in_progress':
            # Студент ответил только на часть вопросов
            num_answered = random.randint(1, max(1, len(case_tasks) - 1))
            answered_tasks = case_tasks[:num_answered]
        else:
            answered_tasks = case_tasks

        for task in answered_tasks:
            is_correct = random.random() < 0.65  # 65% вероятность правильного ответа
            score = random.randint(70, 100) if is_correct else random.randint(0, 50)
            ideal = task.get('ideal_answer', '')

            what_is_correct = random.sample(WHAT_IS_CORRECT_OPTIONS, random.randint(1, 3))
            what_is_missing = [] if is_correct else random.sample(WHAT_IS_MISSING_OPTIONS, random.randint(1, 3))

            ai_feedback = (
                random.choice(POSITIVE_FEEDBACK) if is_correct
                else random.choice(NEGATIVE_FEEDBACK)
            )

            answers.append({
                "attempt_user":      attempt['user'],
                "attempt_case":      attempt['case'],
                "attempt_started_at": attempt['started_at'],
                "task_title":        task['title'],
                "task_case":         task['case'],
                "selected_options":  [],
                "open_answer":       generate_open_answer(ideal, is_correct),
                "score":             score,
                "is_correct":        is_correct,
                "ai_feedback":       ai_feedback,
                "ai_correct_answer": ideal[:500] if ideal else '',
                "ai_what_is_correct": what_is_correct,
                "ai_what_is_missing": what_is_missing,
            })

    output_path.write_text(
        json.dumps(answers, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    correct = sum(1 for a in answers if a['is_correct'])
    incorrect = sum(1 for a in answers if not a['is_correct'])

    print(f"Готово! Создано {len(answers)} ответов → {output_path}")
    print(f"  правильных:   {correct}")
    print(f"  неправильных: {incorrect}")


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--attempts', default=str(JSON / 'case_attempts.json'), help='JSON с попытками')
    parser.add_argument('--tasks',    default=str(JSON / 'case_tasks.json'),    help='JSON с заданиями')
    parser.add_argument('--output',   default=str(JSON / 'task_answers.json'),  help='Выходной JSON файл')
    args = parser.parse_args()

    random.seed(42)
    convert(Path(args.attempts), Path(args.tasks), Path(args.output))