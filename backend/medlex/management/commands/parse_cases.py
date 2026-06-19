"""
Парсер задач по медицинскому праву (Казахстан).
Входные данные:  Задачи_по_мед_праву_2.docx
Выходные данные: cases_parsed.json

Использование:
    Ввести следующую команду в директории, где расположен manage.py:

    python management/commands/parse_cases.py \
    --input management/metadata/Задачи_по_мед_праву_2.docx \
    --output management/json/parsed_test.json

    python parse_cases.py

Требования:
    pip install extract-text

Каждый объект в JSON:
{
  "id":          int,
  "title":       str,   -- название задачи
  "situation":   str,   -- описание ситуации
  "questions":   list,  -- список вопросов
  "answer":      str,   -- развёрнутый ответ
  "legal_basis": list,  -- нормативная база (список ссылок)
  "conclusion":  str    -- вывод
}
"""

import re, json
from pathlib import Path

DOCX = Path("management/metadata/Задачи_по_мед_праву_2.docx")
OUTPUT = Path("management/json/cases_parsed.json")


# ─────────────────────────────────────────────
# 1. Extract text
# ─────────────────────────────────────────────
def extract_text(path: Path) -> str:
    from docx import Document
    doc = Document(path)
    paragraphs = []
    for para in doc.paragraphs:
        paragraphs.append(para.text)
    return '\n'.join(paragraphs)


# ─────────────────────────────────────────────
# 2. Normalize bold markdown artifacts
# ─────────────────────────────────────────────
def strip_bold(text: str) -> str:
    text = re.sub(r'\*+(\d+)\*+', r'\1', text)   # **13** → 13
    text = re.sub(r'\*{2,}', '', text)             # remaining ** → ''
    text = re.sub(r'\xa0', ' ', text)              # non-breaking spaces
    return text


# ─────────────────────────────────────────────
# 3. Helpers
# ─────────────────────────────────────────────
def clean(s: str) -> str:
    s = re.sub(r'[ \t]+', ' ', s)
    s = re.sub(r'\n{3,}', '\n\n', s)
    return s.strip().strip('«»"')


def split_list(raw: str) -> list:
    """Split numbered or bulleted list into individual strings."""
    parts = re.split(r'(?:^|\n)\s*(?:\d+[.)]\t?\s*|[-–•]\s*)', raw)
    result = [clean(p) for p in parts if len(clean(p)) > 5]
    return result or ([clean(raw)] if clean(raw) else [])


def extract_legal_refs(text: str) -> list:
    """Extract legal references from free text."""
    patterns = [
        r'[•\-]\s*((?:ст(?:атья|\.)|[Пп]риказ|[Кк]одекс|[Сс]татья|п\.|пункт)[^\n]{10,200})',
        r'(статьи?\s+\d+(?:\.\d+)?\s+Кодекса[^;.\n]{0,150})',
        r'([Пп]риказ(?:а)?\s+[^\n;.]{20,200})',
        r'(частью?\s+\d+\s+статьи\s+\d+\s+УК\s+РК[^.]+\.)',
    ]
    refs = []
    for pat in patterns:
        for m in re.finditer(pat, text, re.I):
            r = clean(m.group(1) if m.lastindex else m.group(0))
            if len(r) > 15:
                refs.append(r)
    return list(dict.fromkeys(refs))  # deduplicate preserving order


# ─────────────────────────────────────────────
# 4. Format detectors & parsers
# ─────────────────────────────────────────────
def detect_format(chunk: str) -> str:
    if re.search(r'\nНПА\s*[:\s]', chunk, re.I):
        return 'C'
    if re.search(r'\nСитуация\s*[:\s]', chunk, re.I):
        return 'A'
    return 'B'


def parse_A(chunk):
    """Standard: Ситуация / Вопрос(ы) / Ответ / Нормативная база / Вывод"""
    sit_m = re.search(r'\nСитуация\s*[:\s]+(.+?)(?=\nВопрос|\Z)', chunk, re.S|re.I)
    q_m   = re.search(r'\nВопрос(?:ы)?\s*[:\s.]+(.+?)(?=\nОтвет|\Z)', chunk, re.S|re.I)
    ans_m = re.search(r'\nОтвет(?:ы)?\s*[:\s«]+(.+?)(?=\nНормативная|\nВывод|\Z)', chunk, re.S|re.I)
    leg_m = re.search(r'\nНормативная\s+база\s*[:\s]+(.+?)(?=\nВывод|\Z)', chunk, re.S|re.I)
    con_m = re.search(r'\nВывод\s*[:\s]+(.+?)(?=\Z)', chunk, re.S|re.I)

    # Fallback: tab-indented answer
    if not ans_m:
        ans_m = re.search(r'\t\s*Ответ\s*[:\s]+(.+?)(?=\nНормативная|\nВывод|\Z)', chunk, re.S|re.I)

    situation  = clean(sit_m.group(1)) if sit_m else ''
    questions  = split_list(clean(q_m.group(1))) if q_m else []
    answer     = clean(ans_m.group(1)) if ans_m else ''
    legal_raw  = clean(leg_m.group(1)) if leg_m else ''
    legal_basis = split_list(legal_raw) if legal_raw else extract_legal_refs(answer)
    conclusion  = clean(con_m.group(1)) if con_m else ''

    return situation, questions, answer, legal_basis, conclusion


def parse_B(chunk):
    """Free text + Вопросы: + Ответы:/Решение:"""
    q_start = re.search(r'\nВопрос(?:ы)?\s*[:\s]', chunk, re.I)
    situation = clean(chunk[chunk.find('\n'):q_start.start()]) if q_start else ''

    q_m = re.search(r'\nВопрос(?:ы)?\s*[:\s]+(.+?)(?=\nОтвет(?:ы)?|\nРешение|\Z)', chunk, re.S|re.I)
    questions = split_list(clean(q_m.group(1))) if q_m else []

    ans_m = re.search(
        r'\n(?:Ответ(?:ы)?|Решение(?:\s+ситуационной\s+задачи)?)\s*[:\s]+(.+?)(?=\nНормативная|\nВывод|\Z)',
        chunk, re.S|re.I
    )
    answer = clean(ans_m.group(1)) if ans_m else ''

    leg_m = re.search(r'\nНормативная\s+база\s*[:\s]+(.+?)(?=\nВывод|\Z)', chunk, re.S|re.I)
    con_m = re.search(r'\nВывод\s*[:\s]+(.+?)(?=\Z)', chunk, re.S|re.I)

    legal_raw   = clean(leg_m.group(1)) if leg_m else ''
    legal_basis = split_list(legal_raw) if legal_raw else extract_legal_refs(answer)

    conclusion = clean(con_m.group(1)) if con_m else ''
    if not conclusion and answer:
        paragraphs = [p.strip() for p in answer.split('\n\n') if p.strip()]
        conclusion = paragraphs[-1] if paragraphs else ''

    return situation, questions, answer, legal_basis, conclusion


def parse_C(chunk):
    """НПА format: Вопрос N / НПА / Применение / Вывод"""
    q_start = re.search(r'\nВопрос', chunk, re.I)
    situation = clean(chunk[chunk.find('\n'):q_start.start()]) if q_start else ''

    blocks = re.split(r'\nВопрос\s+\d+[.:\s]+', chunk, flags=re.I)
    questions, answer_parts, legal_parts = [], [], []

    for block in blocks[1:]:
        lines = block.strip().split('\n')
        q_text = clean(lines[0])
        if q_text:
            questions.append(q_text)
        npa_m = re.search(r'НПА\s*[:\s]+(.+?)(?=Применение|Статья|Пункт|\Z)', block, re.S|re.I)
        app_m = re.search(r'(?:Применение[^:]*|Вывод)\s*[:\s]+(.+?)(?=\Z)', block, re.S|re.I)
        if npa_m:
            legal_parts.append(clean(npa_m.group(1)))
        if app_m:
            answer_parts.append(clean(app_m.group(1)))

    con_m = re.search(r'\nВывод\s*[:\s]+(.+?)(?=\Z)', chunk, re.S|re.I)
    conclusion = clean(con_m.group(1)) if con_m else ''

    answer = '\n\n'.join(answer_parts)
    legal_basis = legal_parts or extract_legal_refs(answer)

    return situation, questions, answer, legal_basis, conclusion


# ─────────────────────────────────────────────
# 5. Main parse loop
# ─────────────────────────────────────────────
def parse(docx_path: Path) -> list:
    raw = extract_text(docx_path)
    text = strip_bold(raw)

    HEADER_RE = re.compile(
        r'(?:(?:Сит)[^\n]*?задача|[Зз]адача)\s*(?:№|#|N)?\s*(\d+)',
        re.IGNORECASE
    )
    matches = list(HEADER_RE.finditer(text))

    cases = []
    seen = set()

    for idx, m in enumerate(matches):
        num = int(m.group(1))
        if num in seen:
            continue
        seen.add(num)

        chunk_start = m.start()
        chunk_end = matches[idx + 1].start() if idx + 1 < len(matches) else len(text)
        chunk = '\n' + text[chunk_start:chunk_end]

        # ── Title ──
        title_m = re.search(r'[«"]([^»"]{5,150})[»"]', chunk[:300])
        if title_m:
            title = title_m.group(1).strip()
        else:
            title = ''
            for line in chunk.split('\n')[1:5]:
                t = re.sub(r'^.*?\d+\s*[.:\s]*', '', line, count=1).strip().strip('«»".')
                t = clean(t)
                if len(t) > 5 and not re.match(r'(?:Ситуация|Вопрос|Ответ)', t, re.I):
                    title = t
                    break

        fmt = detect_format(chunk)
        if fmt == 'A':
            situation, questions, answer, legal_basis, conclusion = parse_A(chunk)
        elif fmt == 'B':
            situation, questions, answer, legal_basis, conclusion = parse_B(chunk)
        else:
            situation, questions, answer, legal_basis, conclusion = parse_C(chunk)

        # ── Fallback: if situation still empty, grab text before first section ──
        if not situation:
            first_sec = re.search(
                r'\n\s*(?:Ситуация|Вопрос(?:ы)?|Ответ(?:ы)?|НПА|Решение)\s*[:\s]',
                chunk, re.I
            )
            if first_sec:
                candidate = clean(chunk[len(title)+5:first_sec.start()])
                if len(candidate) > 20:
                    situation = candidate

        cases.append({
            "id":          num,
            "title":       title,
            "situation":   situation,
            "questions":   questions,
            "answer":      answer,
            "legal_basis": legal_basis,
            "conclusion":  conclusion,
        })

    cases.sort(key=lambda c: c['id'])
    return cases


# ─────────────────────────────────────────────
# 6. Run
# ─────────────────────────────────────────────
if __name__ == '__main__':
    cases = parse(DOCX)

    OUTPUT.write_text(json.dumps(cases, ensure_ascii=False, indent=2), encoding='utf-8')

    def report(field):
        bad = [c['id'] for c in cases if not c[field]]
        return f"✓ все заполнены" if not bad else f"{len(bad)} пустых: {bad}"

    print(f"Всего задач:  {len(cases)}/45")
    print(f"situation:    {report('situation')}")
    print(f"questions:    {report('questions')}")
    print(f"answer:       {report('answer')}")
    print(f"legal_basis:  {report('legal_basis')}")
    print(f"conclusion:   {report('conclusion')}")
    print(f"\nРезультат → {OUTPUT}")
