import { IProcedureResult } from "mssql";
import { getConnection } from "../config/database";

export async function ejecutarCargaSolicitudes(usuarioCarga: string): Promise<IProcedureResult<any>> {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("UsuarioCarga", usuarioCarga)
        .execute("SAGI_proc_CargaSolicitudes_Ejecutar");

    return result;
}

export async function ejecutarCargaAudiencias(usuarioCarga: string): Promise<IProcedureResult<any>> {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("UsuarioCarga", usuarioCarga)
        .execute("SAGI_proc_CargaAudiencias_Ejecutar");

    return result;
}

export async function guardarAudienciasPublicadas(
    cabecera: Record<string, any>,
    detalles: Record<string, any>[]
): Promise<any> {
    const pool = await getConnection();
    const result = await pool
        .request()
        .input("Cabecera", JSON.stringify(cabecera))
        .input("Detalles", JSON.stringify(detalles))
        .execute("SAGI_proc_AudienciasPublicadas_Guardar");

    return result.recordset || result;
}