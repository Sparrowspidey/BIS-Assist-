from enum import Enum


class Intent(str, Enum):
    BIS_INFORMATION = "bis_information"
    STANDARD_INFORMATION = "standard_information"
    PRODUCT_INFORMATION = "product_information"
    RECOMMENDATION = "recommendation"
    TRANSLATION = "translation"
    GENERAL_CHAT = "general_chat"
    UNKNOWN = "unknown"


def detect_intent(query: str) -> Intent:
    text = query.lower().strip()

    if not text:
        return Intent.UNKNOWN

    if any(word in text for word in [
        "translate",
        "translation",
        "meaning in",
        "translate to hindi",
        "translate to malayalam",
        "translate to tamil",
        "translate to kannada"
    ]):
        return Intent.TRANSLATION

    if any(word in text for word in [
        "recommend",
        "recommendation",
        "suggest",
        "best product",
        "which product",
        "what should i buy"
    ]):
        return Intent.RECOMMENDATION

    if any(word in text for word in [
        "bis",
        "bureau of indian standards",
        "bis registration",
        "bis certification",
        "bis license",
        "bis mark",
        "how can i get bis",
        "how to get bis"
    ]):
        return Intent.BIS_INFORMATION

    if any(word in text for word in [
        "standard",
        "is code",
        "is number",
        "is no",
        "is number for",
        "specification",
        "specifications",
        "standard number",
        "bis standard"
    ]):
        return Intent.STANDARD_INFORMATION

    if any(word in text for word in [
        "product",
        "isi mark",
        "hallmark",
        "certified product"
    ]):
        return Intent.PRODUCT_INFORMATION

    if any(word in text for word in [
        "hello",
        "hi",
        "hey",
        "who are you",
        "what can you do"
    ]):
        return Intent.GENERAL_CHAT

    return Intent.UNKNOWN