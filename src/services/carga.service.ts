import * as xlsx from "xlsx";
import * as repository from "../repositories/carga.repository";

function parsearExcelABuffer(buffer: Buffer): Record<string, any>[] {
    const workbook = xlsx.read(buffer, { type: "buffer", cellDates: true });
    const sheetName = workbook.SheetNames[0];
    console.log(`[Carga Service] Leyendo hoja Excel: "${sheetName}"`);
    const sheet = workbook.Sheets[sheetName];

    if (!sheet) {
        throw new Error("La planilla Excel no contiene hojas válidas");
    }

    const filas: Record<string, any>[] = xlsx.utils.sheet_to_json(sheet, { defval: null });
    console.log(`[Carga Service] Total de filas leídas del Excel: ${filas.length}`);

    if (filas.length === 0) {
        throw new Error("La planilla Excel está vacía");
    }

    console.log("[Carga Service] Columnas detectadas en el Excel:", Object.keys(filas[0]));
    return filas;
}

export async function procesarExcelYCargarSolicitudes(buffer: Buffer, usuarioCarga: string) {
    const filas = parsearExcelABuffer(buffer);
    const totalInsertados = await repository.limpiarEInsertarTmpSolicitudes(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarCargaSolicitudes(usuarioCarga);

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarExcelYCargarAudiencias(buffer: Buffer, usuarioCarga: string) {
    const filas = parsearExcelABuffer(buffer);
    const totalInsertados = await repository.limpiarEInsertarTmpAudiencias(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarCargaAudiencias(usuarioCarga);

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarJSONYCargarSolicitudes(filas: Record<string, any>[], usuarioCarga: string) {
    const totalInsertados = await repository.limpiarEInsertarTmpSolicitudes(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarCargaSolicitudes(usuarioCarga);

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarJSONYCargarAudiencias(filas: Record<string, any>[], usuarioCarga: string) {
    const totalInsertados = await repository.limpiarEInsertarTmpAudiencias(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarCargaAudiencias(usuarioCarga);

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarJSONYCargarViajes(
    filasGYDP: Record<string, any>[],
    filasLobby: Record<string, any>[],
    usuarioCarga: string
) {
    const totalGYDP = await repository.limpiarEInsertarTmpViajesGYDP(filasGYDP, usuarioCarga);
    const totalLobby = await repository.limpiarEInsertarTmpViajesLobby(filasLobby, usuarioCarga);
    const resultadoSP = await repository.ejecutarConsolidacionViajes();

    return {
        totalGYDP,
        totalLobby,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarJSONYCargarViajesLobby(filas: Record<string, any>[], usuarioCarga: string) {
    const totalInsertados = await repository.limpiarEInsertarTmpViajesLobby(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarConsolidacionViajes();

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function procesarJSONYCargarViajesGYDP(filas: Record<string, any>[], usuarioCarga: string) {
    const totalInsertados = await repository.limpiarEInsertarTmpViajesGYDP(filas, usuarioCarga);
    const resultadoSP = await repository.ejecutarConsolidacionViajes();

    return {
        totalLeidos: totalInsertados,
        resultadoSP: resultadoSP.recordset || resultadoSP
    };
}

export async function cargarSolicitudes(usuarioCarga: string) {
    return await repository.ejecutarCargaSolicitudes(usuarioCarga);
}

export async function cargarAudiencias(usuarioCarga: string) {
    return await repository.ejecutarCargaAudiencias(usuarioCarga);
}

export async function cargarViajes() {
    return await repository.ejecutarConsolidacionViajes();
}

export async function guardarAudienciasPublicadas(
    cabecera: Record<string, any>,
    detalles: Record<string, any>[]
) {
    return await repository.guardarAudienciasPublicadas(cabecera, detalles);
}