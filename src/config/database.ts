import sql, { ConnectionPool, config as SqlConfig } from "mssql";

const dbConfig: SqlConfig = {
    user: process.env.DB_USER || "sa",
    password: process.env.DB_PASSWORD || "",
    server: process.env.DB_SERVER || "localhost",
    database: process.env.DB_NAME || "SAGI_DB",
    options: {
        encrypt: process.env.DB_ENCRYPT === "true",
        trustServerCertificate: true
    },
    pool: {
        max: 10,
        min: 0,
        idleTimeoutMillis: 30000
    }
};

let pool: ConnectionPool | null = null;

export async function getConnection(): Promise<ConnectionPool> {
    if (!pool) {
        pool = await new sql.ConnectionPool(dbConfig).connect();
    }
    return pool;
}

export { sql };