const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";

export async function askBIS(query, language = "en") {
  const response = await fetch(`${API_BASE_URL}/ask`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query,
      language,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Backend request failed (${response.status}): ${errorText}`
    );
  }

  return response.json();
}