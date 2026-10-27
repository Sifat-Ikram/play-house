jest.mock("../src/config/db", () => ({ pool: { query: jest.fn() } }));
jest.mock("../src/utils/openrouter", () => ({ callOpenRouter: jest.fn() }));

const { __test } = require("../src/services/aiAssistant.service");
const { sanitizeFilters, regexFallback, findProducts } = __test;

const base = {
  brand: null,
  category: null,
  interest: null,
  occasion: null,
  minAge: null,
  maxAge: null,
  max_price: null,
  keywords: [],
};

const catalog = [
  {
    product_id: 1,
    product_name: "Remote Car",
    brand_name: "Hot Wheels",
    category_name: "Vehicles",
    interest: "Cars & Vehicles",
    occasion: null,
    selling_price: 1500,
    minimum_age_range: 4,
    maximum_age_range: 8,
  },
  {
    product_id: 2,
    product_name: "Baby Rattle",
    brand_name: "Fisher-Price",
    category_name: "Baby",
    interest: null,
    occasion: null,
    selling_price: 300,
    minimum_age_range: 0,
    maximum_age_range: 2,
  },
  {
    product_id: 3,
    product_name: "Ride-On Jeep",
    brand_name: "LEGO",
    category_name: "Vehicles",
    interest: "Cars & Vehicles",
    occasion: null,
    selling_price: 85000,
    minimum_age_range: 3,
    maximum_age_range: 10,
  },
];

describe("sanitizeFilters", () => {
  test("matches brand case-insensitively and drops unknown values", () => {
    const f = sanitizeFilters(
      { brand: "lego", category: "Made Up", interest: "Cars & Vehicles" },
      ["Vehicles"],
      ["LEGO"],
    );
    expect(f.brand).toBe("LEGO");
    expect(f.category).toBeNull();
    expect(f.interest).toBe("Cars & Vehicles");
  });
  test("swaps reversed ages and strips stop words from keywords", () => {
    const f = sanitizeFilters(
      { minAge: 8, maxAge: 3, keywords: ["the", "car", "x"] },
      [],
      [],
    );
    expect([f.minAge, f.maxAge]).toEqual([3, 8]);
    expect(f.keywords).toEqual(["car"]);
  });
  test("handles garbage input", () => {
    expect(() => sanitizeFilters(null, [], [])).not.toThrow();
  });
});

describe("regexFallback", () => {
  test("extracts age and budget", () => {
    const f = regexFallback("a toy under 2000 for a 5 year old");
    expect(f.minAge).toBe(5);
    expect(f.maxAge).toBe(5);
    expect(f.max_price).toBe(2000);
  });
  test("detects a greeting", () => {
    expect(regexFallback("hello").reply_hint).toBe("general_chat");
  });
});

describe("findProducts", () => {
  test("applies every active filter together", () => {
    const { products } = findProducts(catalog, {
      ...base,
      minAge: 5,
      maxAge: 5,
      max_price: 2000,
      keywords: ["car"],
    });
    expect(products.map((p) => p.product_id)).toEqual([1]);
  });

  test("relaxes keywords when nothing matches but never drops age", () => {
    const { products, dropped } = findProducts(catalog, {
      ...base,
      minAge: 5,
      maxAge: 5,
      keywords: ["unicorn"],
    });
    expect(dropped).toContain("keywords");
    expect(products.map((p) => p.product_id).sort()).toEqual([1, 3]);
    expect(products.find((p) => p.product_id === 2)).toBeUndefined();
  });

  test("never drops the budget", () => {
    const { products } = findProducts(catalog, {
      ...base,
      max_price: 100,
      keywords: ["car"],
    });
    expect(products).toEqual([]);
  });

  test("returns at most 5 products", () => {
    const many = Array.from({ length: 12 }, (_, i) => ({
      ...catalog[0],
      product_id: 100 + i,
    }));
    expect(
      findProducts(many, { ...base, keywords: ["car"] }).products.length,
    ).toBe(5);
  });
});
