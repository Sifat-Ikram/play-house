const { Pool } = require("pg");
const env = require("./env");

const pool = new Pool({
    connectionString: env.databaseUrl,
    ssl: {
        rejectUnauthorized: false,
    },
});

pool.on("error", (error) => {
    console.error("Unexpected PostgreSQL error:", error);
});

const connectDB = async () => {
    try {
        const client = await pool.connect();

        console.log("PostgreSQL connected successfully");

        client.release();
    } catch (error) {
        console.error("PostgreSQL connection failed:", error);
        process.exit(1);
    }
};

module.exports = {
    pool,
    connectDB,
};