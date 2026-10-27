jest.mock("../src/config/db", () => ({
  pool: { query: jest.fn(), connect: jest.fn() },
}));

const { can } = require("../src/middleware/admin.middleware");

describe("role permissions", () => {
  test("admin can do everything", () => {
    expect(can("admin", "orders:write")).toBe(true);
    expect(can("admin", "*")).toBe(true);
  });
  test("staff can manage orders but not admin-only actions", () => {
    expect(can("staff", "orders:write")).toBe(true);
    expect(can("staff", "*")).toBe(false);
  });
  test("viewer is read-only", () => {
    expect(can("viewer", "read")).toBe(true);
    expect(can("viewer", "orders:write")).toBe(false);
    expect(can("viewer", "catalog:write")).toBe(false);
  });
  test("unknown role gets nothing", () => {
    expect(can("hacker", "read")).toBe(false);
  });
});
