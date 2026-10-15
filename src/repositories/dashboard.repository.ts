import { getConnection } from "../config/database";

export async function obtenerDatosDashboard(): Promise<any> {
    const connection = await getConnection();
    const result = await connection
        .request()
        .execute("SAGI_proc_Dashboard_Obtener");

    return result.recordset || result;
}