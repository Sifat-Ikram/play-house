const mockClient = { query: jest.fn(), release: jest.fn() };
jest.mock("../src/config/db", () => ({
  pool: {
    connect: jest.fn(() => Promise.resolve(mockClient)),
    query: jest.fn(),
  },
}));

const { createOrder, getShippingCost } = require("../src/models/order.model");

const base = {
  cart_token: "t",
  name: "A",
  phone: "017",
  shipping_address: "x",
  city: "Dhaka",
};
const item = (o = {}) => ({
  cart_item_id: 1,
  inventory_id: 9,
  quantity: 2,
  selling_price: 500,
  stock_quantity: 5,
  mark_unavailable: false,
  product_name: "Toy",
  ...o,
});

beforeEach(() => mockClient.query.mockReset());

describe("shipping", () => {
  test("inside Dhaka 60, outside 120, unknown falls back to 120", () => {
    expect(getShippingCost("INSIDE_DHAKA")).toBe(60);
    expect(getShippingCost("OUTSIDE_DHAKA")).toBe(120);
    expect(getShippingCost("X")).toBe(120);
  });
});

describe("createOrder", () => {
  test("rejects an empty cart and rolls back", async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [] });
    await expect(createOrder(base)).rejects.toThrow("Your cart is empty");
    expect(mockClient.query).toHaveBeenCalledWith("ROLLBACK");
  });

  test("rejects insufficient stock", async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [item({ stock_quantity: 1 })] });
    await expect(createOrder(base)).rejects.toThrow(/Insufficient stock/);
  });

  test("rejects unavailable products", async () => {
    mockClient.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [item({ mark_unavailable: true })] });
    await expect(createOrder(base)).rejects.toThrow(/unavailable/);
  });
});
