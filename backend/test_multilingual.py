import requests

url = "http://localhost:8000/ask"

payload = {
    "query": "BIS प्रमाणन क्या है?",
    "language": "hi",
}

response = requests.post(
    url,
    json=payload,
    timeout=120,
)

print("Status:", response.status_code)
print("Raw response:")
print(response.text)

print("\nParsed response:")
data = response.json()

print("Query:", repr(data.get("query")))
print("Response:", repr(data.get("response")))