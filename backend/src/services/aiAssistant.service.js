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

const STOP_WORDS = new Set([
  "the",
  "and",
  "for",
  "with",
  "that",
  "who",
  "loves",
  "love",
  "like",
  "likes",
  "want",
  "need",
  "gift",
  "toy",
  "toys",
  "kid",
  "kids",
  "child",
  "children",
  "year",
  "years",
  "old",
  "under",
  "below",
  "bdt",
  "taka",
  "some",
  "something",
  "good",
  "best",
  "please",
  "show",
  "find",
  "give",
  "any",
  "have",
  "has",
  "can",
  "you",
  "get",
  "buy",
  "looking",
  "look",
  "within",
  "budget",
  "around",
  "about",
  "boy",
  "girl",
  "baby",
  "birthday",
  "my",
  "his",
  "her",
  "him",
  "she",
  "are",
  "not",
  "too",
  "very",
  "more",
  "less",
  "cheap",
  "cheaper",
]);

// ---------------------------------------------------------------------------
// 1. Extraction prompt
// ---------------------------------------------------------------------------
const buildExtractionPrompt = (categories, brands) => `
You are a filter-extraction assistant for a toy store. Read the user's message
(and recent conversation) and extract search filters as STRICT JSON only.
No markdown, no explanation. Use exactly this shape:

{
  "brand": null,
  "category": null,
  "interest": null,
  "occasion": null,
  "minAge": null,
  "maxAge": null,
  "max_price": null,
  "keywords": [],
  "reply_hint": ""
}

Rules:
- Fill EVERY field that applies to the message. Any field that does not apply MUST stay null (or [] for keywords). Several fields can be filled at once.
- "brand" must exactly match one of: ${brands.length ? brands.join(" | ") : "none available"} (else null).
- "category" must exactly match one of: ${categories.length ? categories.join(" | ") : "none available"} (else null).
- "interest" must exactly match one of: ${KNOWN_INTERESTS.join(" | ")} (else null).
- "occasion" must exactly match one of: ${KNOWN_OCCASIONS.join(" | ")} (else null).
- Age: for "5 year old" set minAge=5 and maxAge=5. For "toddler" use minAge=1, maxAge=3. For "teen" use minAge=12. Otherwise null.
- "max_price": a number in BDT if the user mentions a budget ("under 2000" => 2000), else null.
- "keywords": 1-4 lowercase English words describing the toy type (e.g. ["car","remote"]). Empty array if none.
- "reply_hint": one short note about what the user wants. If the message is only a greeting/chitchat with no product intent, use exactly "general_chat".
- Respond with ONLY the JSON object.
`;

// ---------------------------------------------------------------------------
// 2. Helpers
// ---------------------------------------------------------------------------
const toNum = (v) => {
  if (v === null || v === undefined || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

const cleanStr = (v) => {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t && t.toLowerCase() !== "null" ? t : null;
};

// LLM-এর দেওয়া মান আসল তালিকার সাথে মিলিয়ে নেয়; না মিললে null
const matchFromList = (value, list) => {
  const v = cleanStr(value);
  if (!v) return null;
  const found = list.find((x) => x.toLowerCase() === v.toLowerCase());
  return found || null;
};

const sanitizeFilters = (raw, categories, brands) => {
  const f = raw && typeof raw === "object" ? raw : {};

  let minAge = toNum(f.minAge);
  let maxAge = toNum(f.maxAge);
  if (minAge !== null && maxAge !== null && minAge > maxAge) {
    [minAge, maxAge] = [maxAge, minAge];
  }

  const keywords = (Array.isArray(f.keywords) ? f.keywords : [])
    .map((w) => String(w).toLowerCase().trim())
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w))
    .slice(0, 4);

  return {
    brand: matchFromList(f.brand, brands),
    category: matchFromList(f.category, categories),
    interest: matchFromList(f.interest, KNOWN_INTERESTS),
    occasion: matchFromList(f.occasion, KNOWN_OCCASIONS),
    minAge,
    maxAge,
    max_price: toNum(f.max_price),
    keywords,
    reply_hint: cleanStr(f.reply_hint) || "",
  };
};

// LLM পুরোপুরি ব্যর্থ হলে বাক্য থেকে নিজেই age/budget/keyword বের করা
const regexFallback = (message) => {
  const text = message.toLowerCase();
  const out = {
    brand: null,
    category: null,
    interest: null,
    occasion: null,
    minAge: null,
    maxAge: null,
    max_price: null,
    keywords: [],
    reply_hint: "",
  };

  const age = text.match(/(\d{1,2})\s*[- ]?\s*(?:years?|yrs?|yo|y\/o)/);
  if (age) {
    out.minAge = Number(age[1]);
    out.maxAge = Number(age[1]);
  } else if (/toddler/.test(text)) {
    out.minAge = 1;
    out.maxAge = 3;
  }

  const price = text.match(
    /(?:under|below|within|max|upto|up to|less than)\s*(?:bdt|tk|taka|৳)?\s*(\d[\d,]*)/,
  );
  if (price) out.max_price = Number(price[1].replace(/,/g, ""));

  out.keywords = text
    .split(/[^a-z0-9]+/)
    .filter((w) => w.length > 2 && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
    .slice(0, 4);

  if (
    /^(hi|hello|hey|hola|good (morning|evening|afternoon))[\s!.?]*$/.test(
      text.trim(),
    )
  ) {
    out.reply_hint = "general_chat";
    out.keywords = [];
  }

  return out;
};

// 3. Extraction (JSON mode -> plain mode -> regex)
const extractFilters = async (userMessage, history, categories, brands) => {
  const messages = [
    { role: "system", content: buildExtractionPrompt(categories, brands) },
    ...history.slice(-4),
    { role: "user", content: userMessage },
  ];

  const attempt = async (json) => {
    const raw = await callOpenRouter(messages, {
      temperature: 0.1,
      maxTokens: 300,
      json,
    });
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("No JSON in model output");
    return JSON.parse(match[0]);
  };

  let parsed = null;

  try {
    parsed = await attempt(true);
  } catch (e1) {
    console.error("Extraction (json mode) failed:", e1.message);
    try {
      parsed = await attempt(false);
    } catch (e2) {
      console.error("Extraction (plain) failed:", e2.message);
    }
  }

  if (!parsed) return regexFallback(userMessage);

  const clean = sanitizeFilters(parsed, categories, brands);

  // LLM কিছুই ধরতে না পারলে regex দিয়ে ঘাটতি পূরণ (age/price/keyword)
  const fb = regexFallback(userMessage);
  if (clean.minAge === null && clean.maxAge === null) {
    clean.minAge = fb.minAge;
    clean.maxAge = fb.maxAge;
  }
  if (clean.max_price === null) clean.max_price = fb.max_price;
  if (clean.keywords.length === 0) clean.keywords = fb.keywords;

  return clean;
};

// 4. Product matching: সব filter একসাথে, যেটা null সেটা বাদ
const has = (text, needle) =>
  String(text || "")
    .toLowerCase()
    .includes(String(needle).toLowerCase());

const passesAge = (p, minAge, maxAge) => {
  if (minAge === null && maxAge === null) return true;

  const pMin = p.minimum_age_range;
  const pMax = p.maximum_age_range;

  // product-এ age data না থাকলে সব বয়সের ধরা হয়
  if (
    (pMin === null || pMin === undefined) &&
    (pMax === null || pMax === undefined)
  )
    return true;

  const productMin = pMin ?? 0;
  const productMax = pMax ?? Infinity;
  const wantMin = minAge ?? 0;
  const wantMax = maxAge ?? Infinity;

  return productMin <= wantMax && productMax >= wantMin;
};

const keywordHit = (p, word) =>
  has(p.product_name, word) ||
  has(p.brand_name, word) ||
  has(p.category_name, word) ||
  has(p.interest, word) ||
  has(p.occasion, word);

// active = কোন কোন filter এখন চেক হবে
const matches = (p, f, active) => {
  if (
    active.max_price &&
    f.max_price !== null &&
    Number(p.selling_price) > f.max_price
  )
    return false;
  if (active.age && !passesAge(p, f.minAge, f.maxAge)) return false;
  if (active.brand && f.brand && !has(p.brand_name, f.brand)) return false;
  if (active.category && f.category && !has(p.category_name, f.category))
    return false;
  if (active.interest && f.interest && !has(p.interest, f.interest))
    return false;
  if (active.occasion && f.occasion && !has(p.occasion, f.occasion))
    return false;

  // keywords: অন্তত একটা মিললেই চলবে
  if (active.keywords && f.keywords.length > 0) {
    if (!f.keywords.some((w) => keywordHit(p, w))) return false;
  }
  return true;
};

const rank = (list, f) =>
  list
    .map((p) => {
      let score = 0;
      f.keywords.forEach((w) => keywordHit(p, w) && (score += 1));
      if (f.brand && has(p.brand_name, f.brand)) score += 2;
      if (f.category && has(p.category_name, f.category)) score += 2;
      if (f.interest && has(p.interest, f.interest)) score += 1;
      if (f.occasion && has(p.occasion, f.occasion)) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((x) => x.p);

const dedupe = (list) =>
  Array.from(new Map(list.map((p) => [p.product_id, p])).values());

const hasAnyFilter = (f) =>
  !!(
    f.brand ||
    f.category ||
    f.interest ||
    f.occasion ||
    f.minAge !== null ||
    f.maxAge !== null ||
    f.max_price !== null ||
    f.keywords.length > 0
  );

const findProducts = (all, f) => {
  const full = {
    keywords: true,
    occasion: true,
    interest: true,
    category: true,
    brand: true,
    age: true,
    max_price: true,
  };

  const relaxOrder = ["keywords", "occasion", "interest", "category", "brand"];
  const active = { ...full };
  const dropped = [];

  let result = dedupe(all.filter((p) => matches(p, f, active)));

  for (const key of relaxOrder) {
    if (result.length > 0) break;

    // এই filter আসলে সেট করা না থাকলে ছাড়ার মানে নেই
    const isSet = key === "keywords" ? f.keywords.length > 0 : !!f[key];
    if (!isSet) continue;

    active[key] = false;
    dropped.push(key);
    result = dedupe(all.filter((p) => matches(p, f, active)));
  }

  return { products: rank(result, f).slice(0, 5), dropped };
};

// 5. Reply prompt
const describeFilters = (f) => {
  const parts = [];
  if (f.brand) parts.push(`brand ${f.brand}`);
  if (f.category) parts.push(`category ${f.category}`);
  if (f.interest) parts.push(`interest ${f.interest}`);
  if (f.occasion) parts.push(`occasion ${f.occasion}`);
  if (f.minAge !== null || f.maxAge !== null) {
    parts.push(
      f.minAge === f.maxAge
        ? `age ${f.minAge}`
        : `age ${f.minAge ?? 0}-${f.maxAge ?? "+"}`,
    );
  }
  if (f.max_price !== null) parts.push(`budget up to BDT ${f.max_price}`);
  if (f.keywords.length) parts.push(`keywords ${f.keywords.join(", ")}`);
  return parts.join("; ") || "none";
};

const buildReplyPrompt = (userMessage, products, filters, dropped) => `
You are Play House's friendly AI shopping assistant for a toy store. Be warm, concise,
and playful but not childish. The user asked: "${userMessage}"

What the user wants (understood): ${describeFilters(filters)}.

${
  products.length > 0
    ? `Matching toys from our catalog (use ONLY this data, never invent details):\n${products
        .map(
          (p, i) =>
            `${i + 1}. ${p.product_name} | ${p.brand_name || "Toy Store"} | BDT ${p.selling_price}`,
        )
        .join("\n")}`
    : "No matching toys were found in the catalog."
}

${
  dropped.length > 0 && products.length > 0
    ? `Note: nothing matched every preference exactly, so these are the closest options (relaxed: ${dropped.join(", ")}). Mention this honestly in one short phrase.`
    : ""
}

Write a short, friendly reply of 2-3 sentences. You MUST always write at least one full sentence. Start by acknowledging what the user asked for (age, interest, budget), then say you found some options.
- If toys were found: give a warm intro. Product cards are shown separately below, so do NOT repeat names or prices.
- If none were found: kindly say so and suggest a different age, budget or toy type, or browsing categories.
- If the message is just a greeting/chitchat: greet back and ask what toy, age or occasion they have in mind.
- Never claim a toy exists unless it is listed above.
`;

const buildFallbackReply = (f, products, dropped = []) => {
  const bits = [];

  if (f.minAge !== null && f.maxAge !== null) {
    bits.push(
      f.minAge === f.maxAge
        ? `a ${f.minAge}-year-old`
        : `kids aged ${f.minAge}-${f.maxAge}`,
    );
  } else if (f.minAge !== null) {
    bits.push(`kids ${f.minAge}+ years old`);
  }
  if (f.interest) bits.push(`who love ${f.interest.toLowerCase()}`);
  if (f.occasion) bits.push(`for ${f.occasion.toLowerCase()}`);
  if (f.brand) bits.push(`from ${f.brand}`);
  if (f.max_price !== null)
    bits.push(`within BDT ${f.max_price.toLocaleString()}`);

  const about = bits.length ? ` for ${bits.join(" ")}` : "";
  const relaxed = dropped.length
    ? " I couldn't match everything exactly, so these are the closest options."
    : "";

  return `Here's what I found${about}! 🧸 I picked ${products.length} toy${products.length > 1 ? "s" : ""} you might like.${relaxed} Tap any card to see details.`;
};

// 6. Main
// ---------------------------------------------------------------------------
const chat = async (userMessage, history = []) => {
  const [categoriesResult, brandsResult] = await Promise.all([
    categoryModel.getCategories(),
    brandModel.getBrands(),
  ]);

  const categoryNames = categoriesResult.map((c) => c.category_name);
  const brandNames = brandsResult.map((b) => b.brand_name);

  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            (m.role === "user" || m.role === "assistant") &&
            typeof m.content === "string",
        )
        .map((m) => ({ role: m.role, content: m.content }))
    : [];

  const filters = await extractFilters(
    userMessage,
    safeHistory,
    categoryNames,
    brandNames,
  );

  let products = [];
  let dropped = [];

  const isChitchat =
    filters.reply_hint === "general_chat" && !hasAnyFilter(filters);

  if (!isChitchat && hasAnyFilter(filters)) {
    try {
      const all = await productListingService.getProductListing({});
      const found = findProducts(all || [], filters);
      products = found.products;
      dropped = found.dropped;
    } catch (error) {
      console.error("Product lookup failed:", error);
    }
  }

  let replyText;
  try {
    replyText = await callOpenRouter(
      [
        {
          role: "system",
          content: buildReplyPrompt(userMessage, products, filters, dropped),
        },
      ],
      { temperature: 0.6, maxTokens: 220 },
    );
  } catch (error) {
    console.error("Reply generation failed:", error.message);
    replyText = products.length
      ? "Here are some toys I think you'll love! 🧸"
      : isChitchat
        ? "Hi! Tell me the child's age, interests or the occasion, and I'll find the perfect toy. 🎁"
        : "I couldn't find an exact match. Try a different age, budget or toy type, or browse our categories.";
  }

  let finalReply = (replyText || "").trim();
  if (finalReply.length < 5) {
    finalReply = products.length
      ? buildFallbackReply(filters, products, dropped)
      : isChitchat
        ? "Hi! Tell me the child's age, interests or the occasion, and I'll find the perfect toy. 🎁"
        : "I couldn't find an exact match. Try a different age, budget or toy type, or browse our categories.";
  }

  return { reply: finalReply, products };
};

module.exports = {
  chat,
  __test: { sanitizeFilters, regexFallback, findProducts },
};
