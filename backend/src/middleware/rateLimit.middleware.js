const { pool } = require("../config/db");

const rateLimit =
  ({ name, max, windowMinutes }) =>
  async (req, res, next) => {
    try {
      const key = `${name}:${req.ip}`;

      const result = await pool.query(
        `INSERT INTO rate_limits (key, count, reset_at)
       VALUES ($1, 1, NOW() + $2::interval)
       ON CONFLICT (key) DO UPDATE SET
         count = CASE WHEN rate_limits.reset_at < NOW() THEN 1 ELSE rate_limits.count + 1 END,
         reset_at = CASE WHEN rate_limits.reset_at < NOW() THEN NOW() + $2::interval ELSE rate_limits.reset_at END
       RETURNING count, reset_at;`,
        [key, `${windowMinutes} minutes`],
      );

      const { count, reset_at } = result.rows[0];

      if (count > max) {
        const retrySec = Math.max(
          1,
          Math.ceil((new Date(reset_at) - Date.now()) / 1000),
        );
        res.set("Retry-After", String(retrySec));
        return res.status(429).json({
          success: false,
          message: `Too many requests. Please try again in ${Math.ceil(retrySec / 60)} minute(s).`,
        });
      }

      if (Math.random() < 0.01) {
        pool
          .query(
            `DELETE FROM rate_limits WHERE reset_at < NOW() - INTERVAL '1 day'`,
          )
          .catch(() => {});
      }
    } catch (error) {
      console.error("Rate limit error:", error.message);
    }
    next();
  };

module.exports = { rateLimit };
