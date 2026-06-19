from pathlib import Path
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


BASE_DIR = Path(__file__).resolve().parent
LAW_PATH = BASE_DIR / "knowledge" / "health_code.txt"


def load_law_text():
    return LAW_PATH.read_text(encoding="utf-8")


def split_by_articles(text):
    parts = re.split(r"(?=Статья\s+\d+[-\d]*\.)", text)
    return [p.strip() for p in parts if len(p.strip()) > 100]


def search_law(query, top_k=4):
    text = load_law_text()
    articles = split_by_articles(text)

    if not articles:
        return ""

    vectorizer = TfidfVectorizer()
    matrix = vectorizer.fit_transform(articles + [query])

    similarities = cosine_similarity(matrix[-1], matrix[:-1]).flatten()
    top_indexes = similarities.argsort()[-top_k:][::-1]

    result = []
    for i in top_indexes:
        result.append(articles[i])

    return "\n\n---\n\n".join(result)