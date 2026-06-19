"""
Запускает все скрипты парсинга и конвертации по порядку.

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/run_all.py
"""

from pathlib import Path
import subprocess
import sys

DIR = Path(__file__).resolve().parent

scripts = [
    {
        "name": "1. Парсинг .docx → cases_parsed.json",
        "cmd": [sys.executable, DIR / "parse_cases.py"],
    },
    {
        "name": "2. Конвертация кейсов → cases_converted.json",
        "cmd": [sys.executable, DIR / "convert_cases.py"],
    },
    {
        "name": "3. Конвертация категорий → categories.json",
        "cmd": [sys.executable, DIR / "convert_categories.py"],
    },
    {
        "name": "4. Конвертация законов → law_references.json",
        "cmd": [sys.executable, DIR / "convert_law_references.py"],
    },
    {
        "name": "5. Конвертация заданий → case_tasks.json",
        "cmd": [sys.executable, DIR / "convert_case_tasks.py"],
    },
    {
        "name": "6. Конвертация вариантов ответа → task_options.json",
        "cmd": [sys.executable, DIR / "convert_task_options.py"],
    },
    {
        "name": "7. Конвертация попыток → case_attempts.json",
        "cmd": [sys.executable, DIR / "convert_case_attempts.py"],
    },
    {
        "name": "8. Конвертация ответов на задания → task_answers.json",
        "cmd": [sys.executable, DIR / "convert_task_answers.py"],
    },
]

for script in scripts:
    print(f"\n{'─' * 50}")
    print(f"▶ {script['name']}")
    print(f"{'─' * 50}")
    result = subprocess.run(script["cmd"])
    if result.returncode != 0:
        print(f"\n✗ Ошибка! Скрипт завершился с кодом {result.returncode}. Остановка.")
        sys.exit(result.returncode)

print(f"\n{'─' * 50}")
print("✓ Все скрипты выполнены успешно!")
print(f"{'─' * 50}")