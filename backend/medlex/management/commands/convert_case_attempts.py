"""
Генерирует тестовые попытки прохождения кейсов (CaseAttempt) для тестовых пользователей.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/convert_case_attempts.py \
    --cases management/json/cases_converted.json \
    --output management/json/case_attempts.json
"""

import json
import random
import argparse
from pathlib import Path
from datetime import datetime, timedelta


TEST_USERS = [
    "aibek.dzhaksybekov@test.kz",
    "dana.seitkali@test.kz",
    "marat.akhmetov@test.kz",
    "ainur.bekova@test.kz",
    "timur.nursultanov@test.kz",
    "gulnara.ospanova@test.kz",
    "ruslan.karimov@test.kz",
    "zarina.mukhanova@test.kz",
    "arman.seilov@test.kz",
    "madina.tulegenova@test.kz",
]


def random_datetime(start_days_ago=30, end_days_ago=0) -> str:
    now = datetime.now()
    delta = random.randint(end_days_ago, start_days_ago)
    minutes = random.randint(0, 60 * 24)
    dt = now - timedelta(days=delta, minutes=minutes)
    return dt.strftime("%Y-%m-%dT%H:%M:%S")


def convert(cases_path: Path, output_path: Path):
    cases = json.loads(cases_path.read_text(encoding='utf-8'))
    case_titles = [c['title'] for c in cases]

    attempts = []

    for user_email in TEST_USERS:
        # Каждый пользователь проходит от 3 до 8 случайных кейсов
        num_attempts = random.randint(3, 8)
        selected_cases = random.sample(case_titles, min(num_attempts, len(case_titles)))

        for case_title in selected_cases:
            status = random.choice(['in_progress', 'in_progress', 'completed', 'completed', 'completed'])
            started_at = random_datetime(start_days_ago=30, end_days_ago=1)

            if status == 'completed':
                # Завершённые попытки заканчиваются через 10–60 минут после начала
                started_dt = datetime.strptime(started_at, "%Y-%m-%dT%H:%M:%S")
                completed_dt = started_dt + timedelta(minutes=random.randint(10, 60))
                completed_at = completed_dt.strftime("%Y-%m-%dT%H:%M:%S")
                total_score = random.randint(40, 100)
            else:
                completed_at = None
                total_score = 0

            attempts.append({
                "user":         user_email,
                "case":         case_title,
                "status":       status,
                "total_score":  total_score,
                "started_at":   started_at,
                "completed_at": completed_at,
            })

    output_path.write_text(
        json.dumps(attempts, ensure_ascii=False, indent=2),
        encoding='utf-8'
    )

    completed = sum(1 for a in attempts if a['status'] == 'completed')
    in_progress = sum(1 for a in attempts if a['status'] == 'in_progress')

    print(f"Готово! Создано {len(attempts)} попыток → {output_path}")
    print(f"  completed:   {completed}")
    print(f"  in_progress: {in_progress}")


#if __name__ == '__main__':
#    parser = argparse.ArgumentParser()
#    parser.add_argument('--cases',  default='cases_converted.json', help='JSON с кейсами')
#    parser.add_argument('--output', default='case_attempts.json',   help='Выходной JSON файл')
#    args = parser.parse_args()
#
#    random.seed(42)
#    convert(Path(args.cases), Path(args.output))


if __name__ == '__main__':
    DIR = Path(__file__).parent
    JSON = DIR.parent / 'json'

    parser = argparse.ArgumentParser()
    parser.add_argument('--cases',  default=str(JSON / 'cases_converted.json'), help='JSON с кейсами')
    parser.add_argument('--output', default=str(JSON / 'case_attempts.json'),   help='Выходной JSON файл')
    args = parser.parse_args()

    random.seed(42)
    convert(Path(args.cases), Path(args.output))