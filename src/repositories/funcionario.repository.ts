import { getConnection } from "../config/database";
import { Funcionario } from "../types/funcionario";

export async function obtenerFuncionarios(): Promise<Funcionario[]> {
    const connection = await getConnection();
    const result = await connection
        .request()
        .query<Funcionario>(`
            SELECT
                IdSujetoPasivo,
                NombreSujetoPasivo,
                Correo,
                Activo
            FROM dbo.SAGI_Funcionario
            ORDER BY NombreSujetoPasivo
        `);

    return result.recordset;
}

export async function actualizarFuncionario(
    idSujetoPasivo: number,
    correo: string,
    activo: boolean
): Promise<boolean> {
    const connection = await getConnection();
    await connection
        .request()
        .input("IdSujetoPasivo", idSujetoPasivo)
        .input("Correo", correo)
        .input("Activo", activo)
        .query(`
            UPDATE dbo.SAGI_Funcionario
               SET Correo = @Correo,
                   Activo = @Activo
             WHERE IdSujetoPasivo = @IdSujetoPasivo
        `);

    return true;
}

export async function actualizarCorreoFuncionario(
    nombreSujetoPasivo: string,
    correo: string
): Promise<Funcionario | undefined> {
    const connection = await getConnection();
    const result = await connection
        .request()
        .input("NombreSujetoPasivo", nombreSujetoPasivo)
        .input("Correo", correo)
        .execute<Funcionario>("SAGI_proc_Funcionario_ActualizarCorreo");

    return result.recordset[0];
}