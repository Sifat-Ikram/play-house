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
  "maxPrice": null,
  "search": null,
  "reply_hint": ""
}

Rules:
- Fill every filter that clearly applies (e.g. age AND interest together), but only when
  the user actually mentioned it. Leave the rest null.
- "brand" must exactly match one of: ${brands.length ? brands.join(", ") : "none available"}
- "category" must exactly match one of: ${categories.join(", ")}
- "interest" must exactly match one of: ${KNOWN_INTERESTS.join(", ")}
- "occasion" must exactly match one of: ${KNOWN_OCCASIONS.join(", ")}
- minAge and maxAge must be NUMBERS in years (e.g. "5 year old" -> minAge 4, maxAge 6; "toddler" -> 1 and 3).
- "maxPrice" is a NUMBER in BDT if the user mentions a budget (e.g. "under BDT 2000" -> 2000).
- Put 1-3 short keywords in "search" if the user named a toy type or theme (e.g. "remote control car").
- "reply_hint" is a short note to yourself about what the user wants.
- If the user is just chatting / greeting with no product intent, leave all filters null and set reply_hint to "general_chat".
- Respond with ONLY the JSON object, nothing else.
`;

const toNum = (v) =>
  v === null || v === undefined || v === "" || isNaN(Number(v))
    ? null
    : Number(v);

const pick = (value, list) =>
  list.find(
    (x) =>
      x.toLowerCase() ===
      String(value || "")
        .trim()
        .toLowerCase(),
  ) || null;

const extractFilters = async (userMessage, history, categories, brands) => {
  const messages = [
    { role: "system", content: buildExtractionPrompt(categories, brands) },
    ...history.slice(-4),
    { role: "user", content: userMessage },
  ];

  const raw = await callOpenRouter(messages, {
    temperature: 0.1,
    maxTokens: 400,
    // json: true, // jodi model error/empty dey, eta off rakho
  });

  console.log("RAW EXTRACTION:", raw);

  let parsed = {};
  try {
    const jsonMatch = String(raw || "").match(/\{[\s\S]*\}/);
    parsed = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  } catch (error) {
    console.error("Failed to parse extraction JSON:", raw);
  }

  return {
    brand: pick(parsed.brand, brands),
    category: pick(parsed.category, categories),
    interest: pick(parsed.interest, KNOWN_INTERESTS),
    occasion: pick(parsed.occasion, KNOWN_OCCASIONS),
    minAge: toNum(parsed.minAge),
    maxAge: toNum(parsed.maxAge),
    maxPrice: toNum(parsed.maxPrice),
    search: parsed.search ? String(parsed.search).trim() : null,
    reply_hint: parsed.reply_hint || "",
  };
};

const normalizeList = (result) =>
  Array.isArray(result) ? result : result?.data || result?.products || [];

const fetchProducts = async (filters) => {
  const base = {
    brand: filters.brand || undefined,
    category: filters.category || undefined,
    interest: filters.interest || undefined,
    occasion: filters.occasion || undefined,
    minAge: filters.minAge ?? undefined,
    maxAge: filters.maxAge ?? undefined,
    search: filters.search || undefined,
  };

  // full -> search chara -> age chara -> shudhu search -> shudhu interest/category
  const attempts = [
    base,
    { ...base, search: undefined },
    { ...base, minAge: undefined, maxAge: undefined },
    { search: base.search },
    { interest: base.interest, category: base.category },
  ].filter((a) => Object.values(a).some((v) => v !== undefined));

  for (const params of attempts) {
    const list = normalizeList(
      await productListingService.getProductListing(params),
    );
    if (list.length > 0) return list;
  }
  return [];
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

  const hasFilter =
    filters.brand ||
    filters.category ||
    filters.interest ||
    filters.occasion ||
    filters.minAge !== null ||
    filters.maxAge !== null ||
    filters.search;

  let products = [];

  if (hasFilter) {
    try {
      products = await fetchProducts(filters);
    } catch (error) {
      console.error("Product lookup failed:", error);
    }
  }

  if (filters.maxPrice) {
    products = products.filter(
      (p) => Number(p.selling_price) <= filters.maxPrice,
    );
  }

  console.log("FILTERS:", filters, "PRODUCTS:", products.length);

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
    reply: String(replyText || "").trim(),
    products: uniqueProducts,
  };
};

module.exports = { chat };
