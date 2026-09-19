const { pool } = require("../config/db");

// ============================================
// 1. CREATE COMBO
// ============================================
exports.createCombo = async (req, res) => {
    const client = await pool.connect();

    try {
        const {
            title,
            description,
            combo_price,
            banner_image,
            category_id
        } = req.body;

        await client.query("BEGIN");

        // Check category exists
        const categoryResult = await client.query(
            `SELECT category_id, category_name
             FROM categories
             WHERE category_id = $1`,
            [category_id]
        );

        if (categoryResult.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        // One combo per category
        const existingCombo = await client.query(
            `SELECT id
             FROM combos
             WHERE category_id = $1`,
            [category_id]
        );

        if (existingCombo.rows.length > 0) {
            await client.query("ROLLBACK");

            return res.status(409).json({
                success: false,
                message: "A combo already exists for this category"
            });
        }

        // Create combo
        const comboResult = await client.query(
            `INSERT INTO combos
                (title, description, combo_price, banner_image, category_id)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [
                title,
                description,
                combo_price,
                banner_image,
                category_id
            ]
        );

        const comboId = comboResult.rows[0].id;

        // Automatically add ALL inventory items
        // whose products belong to this category
        await client.query(
            `INSERT INTO combo_items
                (combo_id, inventory_id, quantity)
             SELECT
                $1,
                i.id,
                1
             FROM inventory i
             JOIN products p
                ON i.product_id = p.id
             WHERE p.category_id = $2`,
            [comboId, category_id]
        );

        await client.query("COMMIT");

        res.status(201).json({
            success: true,
            combo: comboResult.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};


// ============================================
// 2. GET ALL COMBOS
// ============================================
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
                c.category_id,
                cat.category_name,

                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'inventory_id', ci.inventory_id,
                            'quantity', ci.quantity,
                            'product_id', p.id,
                            'product_name', p.name,
                            'selling_price', i.selling_price,
                            'stock_quantity', i.quantity,
                            'sku', i.sku
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL),
                    '[]'
                ) AS items

            FROM combos c

            JOIN categories cat
                ON c.category_id = cat.category_id

            LEFT JOIN combo_items ci
                ON c.id = ci.combo_id

            LEFT JOIN inventory i
                ON ci.inventory_id = i.id

            LEFT JOIN products p
                ON i.product_id = p.id

            GROUP BY
                c.id,
                cat.category_name

            ORDER BY c.created_at DESC;
        `;

        const result = await pool.query(query);

        res.status(200).json({
            success: true,
            combos: result.rows
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================
// 3. GET SINGLE COMBO
// ============================================
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
                c.category_id,
                cat.category_name,

                COALESCE(
                    JSON_AGG(
                        JSON_BUILD_OBJECT(
                            'inventory_id', ci.inventory_id,
                            'quantity', ci.quantity,
                            'product_id', p.id,
                            'product_name', p.name,
                            'selling_price', i.selling_price,
                            'stock_quantity', i.quantity,
                            'sku', i.sku
                        )
                    ) FILTER (WHERE ci.id IS NOT NULL),
                    '[]'
                ) AS items

            FROM combos c

            JOIN categories cat
                ON c.category_id = cat.category_id

            LEFT JOIN combo_items ci
                ON c.id = ci.combo_id

            LEFT JOIN inventory i
                ON ci.inventory_id = i.id

            LEFT JOIN products p
                ON i.product_id = p.id

            WHERE c.id = $1

            GROUP BY
                c.id,
                cat.category_name;
        `;

        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Combo not found"
            });
        }

        res.status(200).json({
            success: true,
            combo: result.rows[0]
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============================================
// 4. UPDATE COMBO
// ============================================
exports.updateCombo = async (req, res) => {
    const client = await pool.connect();

    try {
        const { id } = req.params;

        const {
            title,
            description,
            combo_price,
            banner_image,
            is_active,
            category_id
        } = req.body;

        await client.query("BEGIN");

        // Check combo exists
        const existingCombo = await client.query(
            `SELECT *
             FROM combos
             WHERE id = $1`,
            [id]
        );

        if (existingCombo.rows.length === 0) {
            await client.query("ROLLBACK");

            return res.status(404).json({
                success: false,
                message: "Combo not found"
            });
        }

        // If category is being changed
        if (
            category_id !== undefined &&
            category_id !== existingCombo.rows[0].category_id
        ) {
            // Check new category exists
            const categoryResult = await client.query(
                `SELECT category_id
                 FROM categories
                 WHERE category_id = $1`,
                [category_id]
            );

            if (categoryResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    success: false,
                    message: "Category not found"
                });
            }

            // Check another combo doesn't already use it
            const duplicateCombo = await client.query(
                `SELECT id
                 FROM combos
                 WHERE category_id = $1
                 AND id != $2`,
                [category_id, id]
            );

            if (duplicateCombo.rows.length > 0) {
                await client.query("ROLLBACK");

                return res.status(409).json({
                    success: false,
                    message: "A combo already exists for this category"
                });
            }
        }

        // Update combo
        const comboResult = await client.query(
            `UPDATE combos
             SET
                title = COALESCE($1, title),
                description = COALESCE($2, description),
                combo_price = COALESCE($3, combo_price),
                banner_image = COALESCE($4, banner_image),
                is_active = COALESCE($5, is_active),
                category_id = COALESCE($6, category_id)
             WHERE id = $7
             RETURNING *`,
            [
                title,
                description,
                combo_price,
                banner_image,
                is_active,
                category_id,
                id
            ]
        );

        // If category changed,
        // rebuild combo items from the new category
        if (
            category_id !== undefined &&
            category_id !== existingCombo.rows[0].category_id
        ) {
            await client.query(
                `DELETE FROM combo_items
                 WHERE combo_id = $1`,
                [id]
            );

            await client.query(
                `INSERT INTO combo_items
                    (combo_id, inventory_id, quantity)
                 SELECT
                    $1,
                    i.id,
                    1
                 FROM inventory i
                 JOIN products p
                    ON i.product_id = p.id
                 WHERE p.category_id = $2`,
                [id, category_id]
            );
        }

        await client.query("COMMIT");

        res.status(200).json({
            success: true,
            combo: comboResult.rows[0]
        });

    } catch (error) {
        await client.query("ROLLBACK");

        res.status(500).json({
            success: false,
            message: error.message
        });
    } finally {
        client.release();
    }
};


// ============================================
// 5. DELETE COMBO
// ============================================
exports.deleteCombo = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            `DELETE FROM combos
             WHERE id = $1
             RETURNING *`,
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Combo not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Combo deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};