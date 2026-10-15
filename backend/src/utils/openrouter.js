const callOpenRouter = async (messages, options = {}) => {
  const body = {
    model:
      process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free",
    messages,
    temperature: options.temperature ?? 0.4,
    max_tokens: options.maxTokens ?? 400,
  };

  if (options.json) {
    body.response_format = { type: "json_object" };
  }

  const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`OpenRouter error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return data?.choices?.[0]?.message?.content || "";
};

module.exports = { callOpenRouter };
