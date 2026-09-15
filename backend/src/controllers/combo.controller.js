const { pool } = require("../config/db");

// 1. CREATE Combo
exports.createCombo = async (req, res) => {
    const client = await pool.connect();
    try {
        const { title, description, combo_price, banner_image, items } = req.body;

        await client.query("BEGIN");

        const comboResult = await client.query(
            `INSERT INTO combos (title, description, combo_price, banner_image) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description, combo_price, banner_image]
        );

        const comboId = comboResult.rows[0].id;

        if (items && items.length > 0) {
            for (const item of items) {
                await client.query(
                    `INSERT INTO combo_items (combo_id, inventory_id, quantity) 
           VALUES ($1, $2, $3)`,
                    [comboId, item.inventory_id, item.quantity || 1]
                );
            }
        }

        await client.query("COMMIT");
        res.status(201).json({ success: true, combo: comboResult.rows[0] });
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

// 2. GET ALL Combos
exports.getAllCombos = async (req, res) => {
    try {
        const query = `
      SELECT 
        c.id AS combo_id,
        c.title,
        c.description,
        c.combo_price,
        c.banner_image,
        c.is_active,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'inventory_id', ci.inventory_id,
            'quantity', ci.quantity,
            'product_name', p.name,
            'regular_price', i.selling_price
          )
        ) FILTER (WHERE ci.id IS NOT NULL) AS items
      FROM combos c
      LEFT JOIN combo_items ci ON c.id = ci.combo_id
      LEFT JOIN inventory i ON ci.inventory_id = i.id
      LEFT JOIN products p ON i.product_id = p.id
      GROUP BY c.id
      ORDER BY c.created_at DESC;
    `;
        const result = await pool.query(query);
        res.status(200).json({ success: true, combos: result.rows });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 3. GET SINGLE Combo by ID
exports.getComboById = async (req, res) => {
    try {
        const { id } = req.params;
        const query = `
      SELECT 
        c.id AS combo_id,
        c.title,
        c.description,
        c.combo_price,
        c.banner_image,
        c.is_active,
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'inventory_id', ci.inventory_id,
            'quantity', ci.quantity,
            'product_name', p.name,
            'regular_price', i.selling_price
          )
        ) FILTER (WHERE ci.id IS NOT NULL) AS items
      FROM combos c
      LEFT JOIN combo_items ci ON c.id = ci.combo_id
      LEFT JOIN inventory i ON ci.inventory_id = i.id
      LEFT JOIN products p ON i.product_id = p.id
      WHERE c.id = $1
      GROUP BY c.id;
    `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Combo not found" });
        }

        res.status(200).json({ success: true, combo: result.rows[0] });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 4. UPDATE Combo
exports.updateCombo = async (req, res) => {
    const client = await pool.connect();
    try {
        const { id } = req.params;
        const { title, description, combo_price, banner_image, is_active, items } = req.body;

        await client.query("BEGIN");

        const comboResult = await client.query(
            `UPDATE combos 
       SET title = COALESCE($1, title),
           description = COALESCE($2, description),
           combo_price = COALESCE($3, combo_price),
           banner_image = COALESCE($4, banner_image),
           is_active = COALESCE($5, is_active)
       WHERE id = $6 RETURNING *`,
            [title, description, combo_price, banner_image, is_active, id]
        );

        if (comboResult.rows.length === 0) {
            await client.query("ROLLBACK");
            return res.status(404).json({ success: false, message: "Combo not found" });
        }

        if (items) {
            await client.query(`DELETE FROM combo_items WHERE combo_id = $1`, [id]);
            for (const item of items) {
                await client.query(
                    `INSERT INTO combo_items (combo_id, inventory_id, quantity) 
           VALUES ($1, $2, $3)`,
                    [id, item.inventory_id, item.quantity || 1]
                );
            }
        }

        await client.query("COMMIT");
        res.status(200).json({ success: true, combo: comboResult.rows[0] });
    } catch (error) {
        await client.query("ROLLBACK");
        res.status(500).json({ success: false, message: error.message });
    } finally {
        client.release();
    }
};

// 5. DELETE Combo
exports.deleteCombo = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(`DELETE FROM combos WHERE id = $1 RETURNING *`, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ success: false, message: "Combo not found" });
        }

        res.status(200).json({ success: true, message: "Combo deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};