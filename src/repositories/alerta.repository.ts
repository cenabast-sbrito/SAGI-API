import { getConnection, sql } from "../config/database";
import { Alerta, AlertaResumen, AlertaViaje } from "../types/alerta";

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

export async function obtenerAlertasViajes(rango?: string): Promise<AlertaViaje[]> {
    const connection = await getConnection();
    const request = connection.request();
    let rows: any[] = [];

    try {
        request.input("Rango", sql.VarChar(50), rango || "TODO");
        const result = await request.execute("dbo.SAGI_proc_AlertasViajes_Obtener");
        rows = result.recordset || [];
    } catch {
        const result = await connection.request().query(`
            SELECT Rut,
                   TNombres,
                   TPaterno,
                   TMaterno,
                   FechaInicio,
                   FechaTermino
              FROM dbo.SAGI_VW_ViajesPendientesPublicacion
             ORDER BY FechaInicio DESC
        `);
        rows = result.recordset || [];
    }

    return rows.map(r => ({
        Rut: r.Rut,
        TNombres: (r.TNombres || "").trim(),
        TPaterno: (r.TPaterno || "").trim(),
        TMaterno: (r.TMaterno || "").trim(),
        NombreCompleto: [r.TNombres, r.TPaterno, r.TMaterno]
            .filter(Boolean)
            .map(s => String(s).trim())
            .join(" "),
        FechaInicio: r.FechaInicio,
        FechaTermino: r.FechaTermino
    }));
}