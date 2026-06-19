"""
Запускает все команды загрузки данных в БД по порядку.

Использование:
    python load_all.py
"""

import subprocess
import sys
from pathlib import Path

MANAGE = Path(__file__).resolve().parent.parent.parent / 'manage.py'

commands = [
    {
        "name": "1. Загрузка кейсов",
        "cmd": [sys.executable, MANAGE, 'load_cases'],
    },
    {
        "name": "2. Загрузка законов",
        "cmd": [sys.executable, MANAGE, 'load_law_references'],
    },
    {
        "name": "3. Загрузка заданий",
        "cmd": [sys.executable, MANAGE, 'load_case_tasks'],
    },
    {
        "name": "4. Загрузка вариантов ответа",
        "cmd": [sys.executable, MANAGE, 'load_task_options'],
    },
    {
        "name": "5. Создание тестовых пользователей",
        "cmd": [sys.executable, MANAGE, 'create_test_users'],
    },
    {
        "name": "6. Загрузка попыток прохождения",
        "cmd": [sys.executable, MANAGE, 'load_case_attempts'],
    },
    {
        "name": "7. Загрузка ответов на задания",
        "cmd": [sys.executable, MANAGE, 'load_task_answers'],
    },
]

for command in commands:
    print(f"\n{'─' * 50}")
    print(f"▶ {command['name']}")
    print(f"{'─' * 50}")
    result = subprocess.run(command["cmd"])
    if result.returncode != 0:
        print(f"\n✗ Ошибка! Команда завершилась с кодом {result.returncode}. Остановка.")
        sys.exit(result.returncode)

print(f"\n{'─' * 50}")
print("✓ Все данные успешно загружены в БД!")
print(f"{'─' * 50}")