jest.mock("../src/config/db", () => ({ pool: { query: jest.fn() } }));

const { pool } = require("../src/config/db");
const { rateLimit } = require("../src/middleware/rateLimit.middleware");

const makeRes = () => {
  const res = { statusCode: 200, headers: {} };
  res.set = (k, v) => {
    res.headers[k] = v;
    return res;
  };
  res.status = (c) => {
    res.statusCode = c;
    return res;
  };
  res.json = (b) => {
    res.body = b;
    return res;
  };
  return res;
};

describe("rateLimit middleware", () => {
  const limiter = rateLimit({ name: "t", max: 10, windowMinutes: 15 });

  test("allows requests under the limit", async () => {
    pool.query.mockResolvedValue({
      rows: [{ count: 3, reset_at: new Date(Date.now() + 60000) }],
    });
    const next = jest.fn();
    await limiter({ ip: "1.1.1.1" }, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });

  test("blocks with 429 over the limit", async () => {
    pool.query.mockResolvedValue({
      rows: [{ count: 11, reset_at: new Date(Date.now() + 60000) }],
    });
    const next = jest.fn();
    const res = makeRes();
    await limiter({ ip: "1.1.1.1" }, res, next);
    expect(res.statusCode).toBe(429);
    expect(res.headers["Retry-After"]).toBeDefined();
    expect(next).not.toHaveBeenCalled();
  });

  test("fails open if the database errors", async () => {
    pool.query.mockRejectedValue(new Error("db down"));
    const next = jest.fn();
    await limiter({ ip: "1.1.1.1" }, makeRes(), next);
    expect(next).toHaveBeenCalled();
  });
});
