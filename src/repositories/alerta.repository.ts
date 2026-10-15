import { getConnection } from "../config/database";
import { Alerta, AlertaResumen } from "../types/alerta";

export async function obtenerAlertas(): Promise<Alerta[]> {
    const connection = await getConnection();
    const result = await connection
        .request()
        .execute<Alerta>("SAGI_proc_Alertas_Obtener");

    return result.recordset;
}

export async function obtenerResumenAlertas(): Promise<AlertaResumen | undefined> {
    const connection = await getConnection();
    const result = await connection
        .request()
        .execute<AlertaResumen>("SAGI_proc_Alertas_ObtenerResumen");

    return result.recordset[0];
}