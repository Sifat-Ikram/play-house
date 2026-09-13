import app from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const PORT = env.PORT;

async function startServer() {
    try {
        // Neon Driver Adapter ব্যবহারের সময় $connect() বিকল্প হিসেবে দেওয়া হলো
        await (prisma as any).$connect?.();
        console.log("✅ Database connected successfully");

        app.listen(PORT, () => {
            console.log(`🚀 Server running on http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error("❌ Failed to start server:", error);
        process.exit(1);
    }
}

startServer();