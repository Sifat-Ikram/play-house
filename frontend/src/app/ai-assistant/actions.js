"use server";

const API_URL = "https://play-house-backend.vercel.app/api";

export async function sendChat(message, history) {
  try {
    const res = await fetch(`${API_URL}/ai-assistant/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history }),
      cache: "no-store",
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        ok: false,
        message:
          data.message || "Sorry, something went wrong. Please try again.",
      };
    }

    return {
      ok: true,
      reply: data.data.reply,
      products: data.data.products || [],
    };
  } catch (error) {
    return {
      ok: false,
      message:
        "Hmm, I couldn't connect right now. Please try again in a moment.",
    };
  }
}
