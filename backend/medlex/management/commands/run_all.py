"""
Запускает все скрипты парсинга и конвертации по порядку.

Использование:
    python run_all.py
"""

from pathlib import Path
import subprocess
import sys

DIR = Path(__file__).parent

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
]

for script in scripts:
    print(f"\n{'─' * 50}")
    print(f"▶ {script['name']}")
    print(f"{'─' * 50}")
    result = subprocess.run(script["cmd"])
    if result.returncode != 0:
        print(f"\nОшибка! Скрипт завершился с кодом {result.returncode}. Остановка.")
        sys.exit(result.returncode)

print(f"\n{'─' * 50}")
print("Все скрипты выполнены успешно!")
print(f"{'─' * 50}")