import re
from app.llm import default_llm
from app.llm.functions.detect_filters import generate_filters  # Assuming generate_filters is a function

def detect_filters(query: str):
    query_lower = query.lower()
    # print(query_lower)
    result = generate_filters(query_lower)
    print(result)
    return result