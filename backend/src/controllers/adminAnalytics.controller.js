const model = require("../models/adminAnalytics.model");

const fail = (res, e) =>
  res.status(500).json({ success: false, message: e.message });

const cell = (v) => {
  let s =
    v === null || v === undefined
      ? ""
      : v instanceof Date
        ? v.toISOString().slice(0, 10)
        : String(v);
  if (/^[=+\-@]/.test(s)) s = `'${s}`;
  return `"${s.replace(/"/g, '""')}"`;
};

const toCsv = (rows) => {
  if (!rows.length) return "No data\n";
  const cols = Object.keys(rows[0]);
  return [
    cols.join(","),
    ...rows.map((r) => cols.map((c) => cell(r[c])).join(",")),
  ].join("\n");
};

const analytics = async (req, res) => {
  try {
    res
      .status(200)
      .json({ success: true, data: await model.getAnalytics(req.query.days) });
  } catch (e) {
    fail(res, e);
  }
};

const lowStock = async (req, res) => {
  try {
    res.status(200).json({ success: true, data: await model.getLowStock() });
  } catch (e) {
    fail(res, e);
  }
};

const exportCsv = async (req, res) => {
  try {
    const { type } = req.params;
    if (!["inventory", "orders"].includes(type)) {
      return res
        .status(400)
        .json({ success: false, message: "Unknown export type" });
    }
    const rows =
      type === "inventory"
        ? await model.inventoryRows()
        : await model.orderRows();
    res.set("Content-Type", "text/csv; charset=utf-8");
    res.set("Content-Disposition", `attachment; filename="${type}.csv"`);
    res.status(200).send("\uFEFF" + toCsv(rows));
  } catch (e) {
    fail(res, e);
  }
};

module.exports = { analytics, lowStock, exportCsv };
