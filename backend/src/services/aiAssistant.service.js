const { callOpenRouter } = require("../utils/openrouter");
const productListingService = require("./productListing.service");
const categoryModel = require("../models/category.model");
const brandModel = require("../models/brand.model");

const KNOWN_INTERESTS = [
  "Cars & Vehicles",
  "Puzzles & Games",
  "Arts & Creativity",
  "Robots & Tech",
  "Building & Blocks",
  "Books & Stories",
];

const KNOWN_OCCASIONS = [
  "Birthday Fun",
  "Gift for Kids",
  "Party & Fun",
  "Holiday Gifts",
  "Back to School",
  "Just Because",
];

const buildExtractionPrompt = (categories, brands) => `
You are a filter-extraction assistant for a toy store. Given the user's message
(and recent conversation), extract search filters as STRICT JSON only, no markdown,
no explanation. Use this exact shape:

{
  "brand": null,
  "category": null,
  "interest": null,
  "occasion": null,
  "minAge": null,
  "maxAge": null,
  "search": null,
  "reply_hint": ""
}

Rules:
- Only fill ONE of: brand, category, interest, occasion, (minAge/maxAge), search — pick the single
  most relevant filter based on what the user asked. Leave the rest null.
- "brand" must exactly match one of: ${brands.length ? brands.join(", ") : "none available"}
- "category" must exactly match one of: ${categories.join(", ")}
- "interest" must exactly match one of: ${KNOWN_INTERESTS.join(", ")}
- "occasion" must exactly match one of: ${KNOWN_OCCASIONS.join(", ")}
- If the user mentions an age (e.g. "5 year old", "toddler"), set minAge/maxAge as a reasonable range.
- If nothing structured matches but the user named a toy type (e.g. "remote control car"), put keywords in "search".
- "reply_hint" is a short note to yourself (not shown to user) about what the user wants.
- If the user is just chatting / greeting with no product intent, leave all filter fields null and set reply_hint to "general_chat".
- Respond with ONLY the JSON object, nothing else.
`;

const extractFilters = async (userMessage, history, categories, brands) => {
  const messages = [
    { role: "system", content: buildExtractionPrompt(categories, brands) },
    ...history.slice(-4),
    { role: "user", content: userMessage },
  ];

  const raw = await callOpenRouter(messages, {
    temperature: 0.1,
    maxTokens: 250,
    json: true,
  });

  try {
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch (error) {
    console.error("Failed to parse extraction JSON:", raw);
    return {};
  }
};

const buildReplyPrompt = (userMessage, products, replyHint) => `
You are Play House's friendly AI shopping assistant for a toy store. Be warm, concise,
and playful but not childish. The user asked: "${userMessage}"

${
  products.length > 0
    ? `Here are matching toys from our catalog (use ONLY this data, do not invent details):\n${products
        .map(
          (p, i) =>
            `${i + 1}. ${p.product_name} — ${p.brand_name || "Toy Store"} — BDT ${p.selling_price}`,
        )
        .join("\n")}`
    : "No matching toys were found in the catalog for this request."
}

Write a short, friendly reply (2-4 sentences) recommending these toys (if any) or,
if none were found, kindly say so and suggest the user try different keywords or
browse categories. Do not list raw prices/names again if products exist — the product
cards will be shown separately below your message. Just give a warm, helpful intro.
Context note: ${replyHint || "none"}.
`;

const chat = async (userMessage, history = []) => {
  const [categoriesResult, brandsResult] = await Promise.all([
    categoryModel.getCategories(),
    brandModel.getBrands(),
  ]);

  const categoryNames = categoriesResult.map((c) => c.category_name);
  const brandNames = brandsResult.map((b) => b.brand_name);

  const filters = await extractFilters(
    userMessage,
    history,
    categoryNames,
    brandNames,
  );

  let products = [];

  const hasFilter =
    filters.brand ||
    filters.category ||
    filters.interest ||
    filters.occasion ||
    filters.minAge ||
    filters.search;

  if (hasFilter) {
    try {
      products = await productListingService.getProductListing({
        brand: filters.brand || undefined,
        category: filters.category || undefined,
        interest: filters.interest || undefined,
        occasion: filters.occasion || undefined,
        minAge: filters.minAge ?? undefined,
        maxAge: filters.maxAge ?? undefined,
        search: filters.search || undefined,
      });
    } catch (error) {
      console.error("Product lookup failed:", error);
      products = [];
    }
  }

  // product_id দিয়ে duplicate বাদ, chat UI-র জন্য সর্বোচ্চ ৫টা
  const uniqueProducts = Array.from(
    new Map(products.map((p) => [p.product_id, p])).values(),
  ).slice(0, 5);

  const replyText = await callOpenRouter(
    [
      {
        role: "system",
        content: buildReplyPrompt(
          userMessage,
          uniqueProducts,
          filters.reply_hint,
        ),
      },
    ],
    { temperature: 0.6, maxTokens: 220 },
  );

  return {
    reply: replyText.trim(),
    products: uniqueProducts,
  };
};

module.exports = { chat };
