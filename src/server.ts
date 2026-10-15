import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(__dirname, "../.env") });

import app from "./app";
import { getConnection } from "./config/database";

const PORT: number | string = process.env.PORT || 5630;

async function start(): Promise<void> {
    try {
        await getConnection();
        console.log("✅ Conexión SQL Server OK");

        app.listen(PORT, () => {
            console.log(`SAGI API ejecutándose en puerto ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error SQL Server");
        console.error(error);
        process.exit(1);
    }
}

start();