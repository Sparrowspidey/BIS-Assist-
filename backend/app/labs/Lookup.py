# backend/app/labs/lookup.py

import json
from app.config.Config import PROCESSED_DIR

def search_labs(query: str, top_k: int = 5) -> list[dict]:
    """
    Filters testing_labs.json by state and/or status keywords found in
    the user's query. Plain structured filtering, not semantic search —
    same reasoning as the product-standard recommender.
    """
    path = PROCESSED_DIR / "testing_labs.json"
    with open(path, "r", encoding="utf-8") as f:
        labs = json.load(f)

    text = query.lower()
    matches = []

    for lab in labs:
        state = lab.get("state", "").lower()
        remarks = lab.get("remarks", "").lower()

        if state and state in text:
            # skip suspended/inactive labs unless the user explicitly asked for that
            if "suspend" in remarks and "suspend" not in text:
                continue
            matches.append(lab)

    return matches[:top_k]