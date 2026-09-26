const { pool } = require("../config/db");

const SHIPPING_COST = {
  INSIDE_DHAKA: 60,
  OUTSIDE_DHAKA: 120,
};

const getShippingCost = (deliveryOption) => {
  return SHIPPING_COST[deliveryOption] ?? SHIPPING_COST.OUTSIDE_DHAKA;
};

const getCartItemsWithStock = async (client, { cartToken, userId }) => {
  const whereClause = userId
    ? `ci.user_id = $1`
    : `ci.cart_token = $1 AND ci.user_id IS NULL`;
  const param = userId || cartToken;

  const query = `
    SELECT
      ci.id AS cart_item_id,
      ci.inventory_id,
      ci.quantity,
      inv.selling_price,
      inv.stock_quantity,
      inv.mark_unavailable,
      p.name AS product_name
    FROM cart_items ci
    JOIN inventory inv ON inv.id = ci.inventory_id
    JOIN products p ON p.id = inv.product_id
    WHERE ${whereClause};
  `;

  const result = await client.query(query, [param]);
  return result.rows;
};

const createOrder = async (data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const cartItems = await getCartItemsWithStock(client, {
      cartToken: data.cart_token,
      userId: data.user_id,
    });

    if (cartItems.length === 0) {
      const error = new Error("Your cart is empty");
      error.statusCode = 400;
      throw error;
    }

    // Validate stock for every item
    for (const item of cartItems) {
      if (item.mark_unavailable) {
        const error = new Error(
          `${item.product_name} is currently unavailable`,
        );
        error.statusCode = 400;
        throw error;
      }

      if (item.stock_quantity < item.quantity) {
        const error = new Error(
          `Insufficient stock for ${item.product_name}. Only ${item.stock_quantity} left.`,
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const subtotal = cartItems.reduce(
      (sum, item) => sum + Number(item.selling_price) * item.quantity,
      0,
    );

    const shippingCost = getShippingCost(data.delivery_option);
    const total = subtotal + shippingCost;

    const orderResult = await client.query(
      `INSERT INTO orders (
        user_id, cart_token, name, email, phone,
        shipping_address, city, delivery_option, payment_method,
        subtotal, shipping_cost, total, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
      RETURNING *;`,
      [
        data.user_id ?? null,
        data.cart_token,
        data.name,
        data.email ?? null,
        data.phone,
        data.shipping_address,
        data.city,
        data.delivery_option,
        data.payment_method ?? "cod",
        subtotal,
        shippingCost,
        total,
      ],
    );

    const order = orderResult.rows[0];

    // Insert order items with price snapshot
    for (const item of cartItems) {
      await client.query(
        `INSERT INTO order_items (order_id, inventory_id, quantity, unit_price)
         VALUES ($1, $2, $3, $4);`,
        [order.id, item.inventory_id, item.quantity, item.selling_price],
      );

      // Deduct stock
      await client.query(
        `UPDATE inventory SET stock_quantity = stock_quantity - $1 WHERE id = $2;`,
        [item.quantity, item.inventory_id],
      );
    }

    if (data.user_id) {
      await client.query(`DELETE FROM cart_items WHERE user_id = $1;`, [
        data.user_id,
      ]);
    } else {
      await client.query(
        `DELETE FROM cart_items WHERE cart_token = $1 AND user_id IS NULL;`,
        [data.cart_token],
      );
    }

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const getOrderById = async (id) => {
  const orderQuery = `SELECT * FROM orders WHERE id = $1;`;
  const orderResult = await pool.query(orderQuery, [id]);
  const order = orderResult.rows[0];

  if (!order) return null;

  const itemsQuery = `
    SELECT
      oi.*,
      p.name AS product_name,
      col.color_name,
      img.image_url AS display_image_url
    FROM order_items oi
    JOIN inventory inv ON inv.id = oi.inventory_id
    JOIN products p ON p.id = inv.product_id
    LEFT JOIN colors col ON col.color_id = inv.color_id
    LEFT JOIN LATERAL (
      SELECT image_url
      FROM inventory_images
      WHERE inventory_images.inventory_id = inv.id
        AND inventory_images.is_display_image = true
      ORDER BY created_at ASC
      LIMIT 1
    ) img ON true
    WHERE oi.order_id = $1;
  `;

  const itemsResult = await pool.query(itemsQuery, [id]);

  return { ...order, items: itemsResult.rows };
};

const getOrdersByUserId = async (userId) => {
  const query = `
    SELECT id, name, total, status, payment_method, created_at
    FROM orders
    WHERE user_id = $1
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [userId]);
  return result.rows;
};

module.exports = {
  createOrder,
  getOrderById,
  getShippingCost,
  getOrdersByUserId,
};
