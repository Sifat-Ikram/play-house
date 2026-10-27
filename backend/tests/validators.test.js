const {
  registerSchema,
  loginSchema,
  returnSchema,
  trackSchema,
} = require("../src/utils/validators");

describe("auth validators", () => {
  test("register accepts valid data", () => {
    expect(
      registerSchema.safeParse({
        name: "Sifat",
        email: "a@b.com",
        password: "secret1",
      }).success,
    ).toBe(true);
  });
  test("register rejects bad email, short name and short password", () => {
    expect(
      registerSchema.safeParse({
        name: "Sifat",
        email: "nope",
        password: "secret1",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        name: "S",
        email: "a@b.com",
        password: "secret1",
      }).success,
    ).toBe(false);
    expect(
      registerSchema.safeParse({
        name: "Sifat",
        email: "a@b.com",
        password: "123",
      }).success,
    ).toBe(false);
  });
  test("login requires a valid email", () => {
    expect(loginSchema.safeParse({ email: "x", password: "p" }).success).toBe(
      false,
    );
  });
});

describe("order validators", () => {
  test("return reason must be an allowed value", () => {
    expect(returnSchema.safeParse({ reason: "Damaged" }).success).toBe(true);
    expect(
      returnSchema.safeParse({ reason: "I changed my mind" }).success,
    ).toBe(false);
  });
  test("track coerces order id to a number", () => {
    const r = trackSchema.safeParse({ order_id: "42", phone: "01700000000" });
    expect(r.success).toBe(true);
    expect(r.data.order_id).toBe(42);
  });
});
