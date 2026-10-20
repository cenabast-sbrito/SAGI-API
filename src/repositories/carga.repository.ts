import { IProcedureResult } from "mssql";
import { getConnection, sql } from "../config/database";

function normalizarTexto(txt: string): string {
    return txt
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-zA-Z0-9]/g, "")
        .toLowerCase();
}

function obtenerCampo(fila: Record<string, any>, ...posiblesNombres: string[]): any {
    const keys = Object.keys(fila);
    const targets = posiblesNombres.map(n => normalizarTexto(n));

    for (const key of keys) {
        const normKey = normalizarTexto(key);
        if (targets.includes(normKey) && fila[key] !== undefined && fila[key] !== null && fila[key] !== "") {
            return fila[key];
        }
    }
    return null;
}

function parsearFecha(valor: any): Date | null {
    if (!valor) return null;
    if (valor instanceof Date && !isNaN(valor.getTime())) return valor;

    if (typeof valor === "string") {
        const partes = valor.split(/[-/]/);
        if (partes.length === 3 && partes[0].length <= 2 && partes[2].length === 4) {
            const d = new Date(`${partes[2]}-${partes[1]}-${partes[0]}`);
            if (!isNaN(d.getTime())) return d;
        }
    }

    const d = new Date(valor);
    return isNaN(d.getTime()) ? null : d;
}

function parsearEntero(valor: any): number | null {
    if (valor === undefined || valor === null || valor === "") return null;

    const raw = String(valor).trim();

    // Soporte científico (ej: 2E+07)
    const asNumber = Number(raw.replace(",", "."));
    if (!Number.isNaN(asNumber) && Number.isFinite(asNumber)) {
        return Math.trunc(asNumber);
    }

    const limpio = raw.replace(/[^\d-]/g, "");
    const num = parseInt(limpio, 10);
    return isNaN(num) ? null : num;
}

function texto(valor: any, max: number): string | null {
    if (valor === undefined || valor === null || valor === "") return null;
    return String(valor).trim().substring(0, max);
}

function parsearDecimal(valor: any): number | null {
    if (valor === undefined || valor === null || valor === "") return null;
    const normalizado = String(valor).replace(",", ".").replace(/[^\d.-]/g, "");
    const num = parseFloat(normalizado);
    return isNaN(num) ? null : num;
}

function parsearMoney(valor: any): number | null {
    if (valor === undefined || valor === null || valor === "") return null;
    const normalizado = String(valor).replace(/\$/g, "").replace(/\./g, "").replace(",", ".").replace(/[^\d.-]/g, "");
    const num = parseFloat(normalizado);
    return isNaN(num) ? null : num;
}

export async function limpiarEInsertarTmpSolicitudes(filas: Record<string, any>[], usuarioCarga: string): Promise<number> {
    console.log(`[Carga Repo] Procesando ${filas.length} registros para dbo.SAGI_TMP_Solicitudes...`);
    const pool = await getConnection();

    await pool.request().query("TRUNCATE TABLE dbo.SAGI_TMP_Solicitudes");

    const ahora = new Date();
    const CHUNK_SIZE = 100;

    for (let i = 0; i < filas.length; i += CHUNK_SIZE) {
        const chunk = filas.slice(i, i + CHUNK_SIZE);
        const request = pool.request();
        const valueClauses: string[] = [];

        chunk.forEach((fila, idx) => {
            const folio = texto(obtenerCampo(fila, "Folio", "N Solicitud", "NumeroSolicitud", "Solicitud"), 14);
            const fechaIngreso = parsearFecha(obtenerCampo(fila, "FechaIngreso", "Fecha de Ingreso", "Fecha Ingreso"));
            const fechaRespuesta = parsearFecha(obtenerCampo(fila, "FechaRespuesta", "Fecha Respuesta"));
            const fechaAgendada = parsearFecha(obtenerCampo(fila, "FechaAgendada", "Fecha Agendada"));
            const idSujetoPasivo = parsearEntero(obtenerCampo(fila, "IdSujetoPasivo", "Id Sujeto Pasivo", "IdSujeto", "ID"));
            const nombreSujetoPasivo = texto(obtenerCampo(fila, "NombreSujetoPasivo", "Sujeto Pasivo", "Nombre Sujeto Pasivo"), 300);
            const cargo = texto(obtenerCampo(fila, "Cargo", "CargoSujetoPasivo", "Cargo Sujeto Pasivo"), 300);
            const rutSujetoActivo = texto(obtenerCampo(fila, "RutSujetoActivo", "Rut Sujeto Activo", "Rut"), 20);
            const nombreSujetoActivo = texto(obtenerCampo(fila, "NombreSujetoActivo", "Nombre Sujeto Activo"), 500);
            const representado = texto(obtenerCampo(fila, "Representado"), 500);
            const materia = obtenerCampo(fila, "Materia");
            const especificacionMateria = obtenerCampo(fila, "EspecificacionMateria", "EspecificaciónMateria", "Especificacion Materia");
            const estado = texto(obtenerCampo(fila, "Estado", "Estado Solicitud", "EstadoSolicitud"), 50);

            request.input(`Folio_${idx}`, sql.VarChar(14), folio);
            request.input(`FechaIngreso_${idx}`, sql.DateTime, fechaIngreso);
            request.input(`FechaRespuesta_${idx}`, sql.DateTime, fechaRespuesta);
            request.input(`FechaAgendada_${idx}`, sql.DateTime, fechaAgendada);
            request.input(`IdSujetoPasivo_${idx}`, sql.BigInt, idSujetoPasivo);
            request.input(`NombreSujetoPasivo_${idx}`, sql.VarChar(300), nombreSujetoPasivo);
            request.input(`Cargo_${idx}`, sql.VarChar(300), cargo);
            request.input(`RutSujetoActivo_${idx}`, sql.VarChar(20), rutSujetoActivo);
            request.input(`NombreSujetoActivo_${idx}`, sql.VarChar(500), nombreSujetoActivo);
            request.input(`Representado_${idx}`, sql.VarChar(500), representado);
            request.input(`Materia_${idx}`, sql.VarChar(sql.MAX), materia ? String(materia) : null);
            request.input(`EspecificacionMateria_${idx}`, sql.VarChar(sql.MAX), especificacionMateria ? String(especificacionMateria) : null);
            request.input(`Estado_${idx}`, sql.VarChar(50), estado);
            request.input(`UsuarioCarga_${idx}`, sql.VarChar(50), texto(usuarioCarga, 50) || "SISTEMA");
            request.input(`FechaCarga_${idx}`, sql.DateTime, ahora);

            valueClauses.push(`(
                @Folio_${idx},
                @FechaIngreso_${idx},
                @FechaRespuesta_${idx},
                @FechaAgendada_${idx},
                @IdSujetoPasivo_${idx},
                @NombreSujetoPasivo_${idx},
                @Cargo_${idx},
                @RutSujetoActivo_${idx},
                @NombreSujetoActivo_${idx},
                @Representado_${idx},
                @Materia_${idx},
                @EspecificacionMateria_${idx},
                @Estado_${idx},
                @UsuarioCarga_${idx},
                @FechaCarga_${idx}
            )`);
        });

        const insertQuery = `
            INSERT INTO dbo.SAGI_TMP_Solicitudes
            (
                Folio,
                FechaIngreso,
                FechaRespuesta,
                FechaAgendada,
                IdSujetoPasivo,
                NombreSujetoPasivo,
                Cargo,
                RutSujetoActivo,
                NombreSujetoActivo,
                Representado,
                Materia,
                EspecificacionMateria,
                Estado,
                UsuarioCarga,
                FechaCarga
            )
            VALUES
            ${valueClauses.join(",\n")}
        `;

        await request.query(insertQuery);
    }

    console.log(`[Carga Repo] ✅ ${filas.length} registros insertados en dbo.SAGI_TMP_Solicitudes.`);
    return filas.length;
}

export async function limpiarEInsertarTmpAudiencias(filas: Record<string, any>[], usuarioCarga: string): Promise<number> {
    console.log(`[Carga Repo] Procesando ${filas.length} registros para dbo.SAGI_TMP_Audiencias...`);
    const pool = await getConnection();

    await pool.request().query("TRUNCATE TABLE dbo.SAGI_TMP_Audiencias");

    const ahora = new Date();
    const CHUNK_SIZE = 100;

    for (let i = 0; i < filas.length; i += CHUNK_SIZE) {
        const chunk = filas.slice(i, i + CHUNK_SIZE);
        const request = pool.request();
        const valueClauses: string[] = [];

        chunk.forEach((fila, idx) => {
            const folio = texto(obtenerCampo(fila, "Folio", "N Audiencia", "NumeroAudiencia", "Audiencia"), 14);
            const formaAsistencia = texto(obtenerCampo(fila, "FormaAsistencia", "Forma Asistencia"), 100);
            const nombreSujetoPasivo = texto(obtenerCampo(fila, "NombreSujetoPasivo", "Sujeto Pasivo", "Nombre Sujeto Pasivo"), 300);
            const cargo = texto(obtenerCampo(fila, "Cargo", "CargoSujetoPasivo", "Cargo Sujeto Pasivo"), 300);
            const rutSujetoActivo = texto(obtenerCampo(fila, "RutSujetoActivo", "Rut Sujeto Activo", "Rut"), 20);
            const nombreSujetoActivo = texto(obtenerCampo(fila, "NombreSujetoActivo", "Nombre Sujeto Activo"), 300);
            const representado = texto(obtenerCampo(fila, "Representado"), 500);
            const fechaInicio = parsearFecha(obtenerCampo(fila, "FechaInicio", "Fecha Inicio"));
            const fechaTermino = parsearFecha(obtenerCampo(fila, "FechaTermino", "Fecha Término", "Fecha Termino"));
            const lugar = texto(obtenerCampo(fila, "Lugar"), 500);
            const comuna = texto(obtenerCampo(fila, "Comuna"), 100);
            const duracionMinutos = parsearEntero(obtenerCampo(fila, "DuracionMinutos", "DuraciónMinutos", "Duracion Minutos"));
            const materia = obtenerCampo(fila, "Materia");
            const especificacionMateriaTratada = obtenerCampo(
                fila,
                "EspecificacionMateriaTratada",
                "EspecificaciónMateriaTratada",
                "Especificacion Materia Tratada"
            );
            const estado = texto(obtenerCampo(fila, "Estado", "Estado Audiencia", "EstadoAudiencia"), 50);

            request.input(`Folio_${idx}`, sql.VarChar(14), folio);
            request.input(`FormaAsistencia_${idx}`, sql.VarChar(100), formaAsistencia);
            request.input(`NombreSujetoPasivo_${idx}`, sql.VarChar(300), nombreSujetoPasivo);
            request.input(`Cargo_${idx}`, sql.VarChar(300), cargo);
            request.input(`RutSujetoActivo_${idx}`, sql.VarChar(20), rutSujetoActivo);
            request.input(`NombreSujetoActivo_${idx}`, sql.VarChar(300), nombreSujetoActivo);
            request.input(`Representado_${idx}`, sql.VarChar(500), representado);
            request.input(`FechaInicio_${idx}`, sql.DateTime, fechaInicio);
            request.input(`FechaTermino_${idx}`, sql.DateTime, fechaTermino);
            request.input(`Lugar_${idx}`, sql.VarChar(500), lugar);
            request.input(`Comuna_${idx}`, sql.VarChar(100), comuna);
            request.input(`DuracionMinutos_${idx}`, sql.Int, duracionMinutos);
            request.input(`Materia_${idx}`, sql.VarChar(sql.MAX), materia ? String(materia) : null);
            request.input(`EspecificacionMateriaTratada_${idx}`, sql.VarChar(sql.MAX), especificacionMateriaTratada ? String(especificacionMateriaTratada) : null);
            request.input(`Estado_${idx}`, sql.VarChar(50), estado);
            request.input(`UsuarioCarga_${idx}`, sql.VarChar(50), texto(usuarioCarga, 50) || "SISTEMA");
            request.input(`FechaCarga_${idx}`, sql.DateTime, ahora);

            valueClauses.push(`(
                @Folio_${idx},
                @FormaAsistencia_${idx},
                @NombreSujetoPasivo_${idx},
                @Cargo_${idx},
                @RutSujetoActivo_${idx},
                @NombreSujetoActivo_${idx},
                @Representado_${idx},
                @FechaInicio_${idx},
                @FechaTermino_${idx},
                @Lugar_${idx},
                @Comuna_${idx},
                @DuracionMinutos_${idx},
                @Materia_${idx},
                @EspecificacionMateriaTratada_${idx},
                @Estado_${idx},
                @UsuarioCarga_${idx},
                @FechaCarga_${idx}
            )`);
        });

        const insertQuery = `
            INSERT INTO dbo.SAGI_TMP_Audiencias
            (
                Folio,
                FormaAsistencia,
                NombreSujetoPasivo,
                Cargo,
                RutSujetoActivo,
                NombreSujetoActivo,
                Representado,
                FechaInicio,
                FechaTermino,
                Lugar,
                Comuna,
                DuracionMinutos,
                Materia,
                EspecificacionMateriaTratada,
                Estado,
                UsuarioCarga,
                FechaCarga
            )
            VALUES
            ${valueClauses.join(",\n")}
        `;

        await request.query(insertQuery);
    }

    console.log(`[Carga Repo] ✅ ${filas.length} registros insertados en dbo.SAGI_TMP_Audiencias.`);
    return filas.length;
}

export async function limpiarEInsertarTmpViajesGYDP(filas: Record<string, any>[], _usuarioCarga?: string): Promise<number> {
    console.log(`[Carga Repo] Procesando ${filas.length} registros para dbo.SAGI_TMP_ViajesGYDP...`);
    const pool = await getConnection();

    await pool.request().query("TRUNCATE TABLE dbo.SAGI_TMP_ViajesGYDP");

    const CHUNK_SIZE = 100;

    for (let i = 0; i < filas.length; i += CHUNK_SIZE) {
        const chunk = filas.slice(i, i + CHUNK_SIZE);
        const request = pool.request();
        const valueClauses: string[] = [];

        chunk.forEach((fila, idx) => {
            const rutRaw = obtenerCampo(fila, "Rut", "RUT", "RutDv", "RUT/DV", "Rut-DV");
            let rut = parsearEntero(rutRaw);
            let dv = texto(obtenerCampo(fila, "DV", "Dv"), 2);

            // Si RUT viene formateado con DV (ej: 18334-4)
            if ((rut === null || !dv) && typeof rutRaw === "string" && rutRaw.includes("-")) {
                const [rutPart, dvPart] = rutRaw.split("-");
                rut = parsearEntero(rutPart);
                dv = dv || texto(dvPart, 2);
            }

            const nombreFuncionario = texto(obtenerCampo(fila, "NombreFuncionario", "Nombre Funcionario", "NOMBRES"), 300);
            const fechaInicio = parsearFecha(obtenerCampo(fila, "FechaInicio", "Fecha Inicio", "FECHA_INI"));
            const fechaTermino = parsearFecha(obtenerCampo(fila, "FechaTermino", "Fecha Término", "Fecha Termino", "FECHA_TER"));
            const totalDias = parsearDecimal(obtenerCampo(fila, "TotalDias", "Total Días", "Total Dias", "TOTAL_DIA", "TOTAL_DIAS", "JORNADA"));
            const tipoResolucion = texto(obtenerCampo(fila, "TipoResolucion", "Tipo Resolución", "Tipo Resolucion", "TIPO_RESOLUC"), 100);
            const numeroResolucion = texto(obtenerCampo(fila, "NumeroResolucion", "Número Resolución", "Numero Resolucion", "NUMERO_RESOLU"), 50);
            const fechaResolucion = parsearFecha(obtenerCampo(fila, "FechaResolucion", "Fecha Resolución", "Fecha Resolucion", "FECHA_RESOLU"));
            const lugarDestino = texto(obtenerCampo(fila, "LugarDestino", "Lugar Destino", "LUGAR_DESTI", "LUGAR"), 500);
            const tipoComision = texto(obtenerCampo(fila, "TipoComision", "Tipo Comisión", "Tipo Comision", "TIPO_COMISI"), 200);
            const motivo = obtenerCampo(fila, "Motivo", "MOTIVO");
            const valorViatico = parsearMoney(obtenerCampo(fila, "ValorViatico", "Valor Viático", "Valor Viatico", "VALOR_VIA"));
            const observacion = obtenerCampo(fila, "Observacion", "Observación", "OBSERVACION");

            request.input(`Rut_${idx}`, sql.Int, rut);
            request.input(`DV_${idx}`, sql.VarChar(2), dv);
            request.input(`NombreFuncionario_${idx}`, sql.VarChar(300), nombreFuncionario);
            request.input(`FechaInicio_${idx}`, sql.Date, fechaInicio);
            request.input(`FechaTermino_${idx}`, sql.Date, fechaTermino);
            request.input(`TotalDias_${idx}`, sql.Decimal(10, 2), totalDias);
            request.input(`TipoResolucion_${idx}`, sql.VarChar(100), tipoResolucion);
            request.input(`NumeroResolucion_${idx}`, sql.VarChar(50), numeroResolucion);
            request.input(`FechaResolucion_${idx}`, sql.Date, fechaResolucion);
            request.input(`LugarDestino_${idx}`, sql.VarChar(500), lugarDestino);
            request.input(`TipoComision_${idx}`, sql.VarChar(200), tipoComision);
            request.input(`Motivo_${idx}`, sql.VarChar(sql.MAX), motivo ? String(motivo) : null);
            request.input(`ValorViatico_${idx}`, sql.Money, valorViatico);
            request.input(`Observacion_${idx}`, sql.VarChar(sql.MAX), observacion ? String(observacion) : null);

            valueClauses.push(`(
                @Rut_${idx},
                @DV_${idx},
                @NombreFuncionario_${idx},
                @FechaInicio_${idx},
                @FechaTermino_${idx},
                @TotalDias_${idx},
                @TipoResolucion_${idx},
                @NumeroResolucion_${idx},
                @FechaResolucion_${idx},
                @LugarDestino_${idx},
                @TipoComision_${idx},
                @Motivo_${idx},
                @ValorViatico_${idx},
                @Observacion_${idx}
            )`);
        });

        const insertQuery = `
            INSERT INTO dbo.SAGI_TMP_ViajesGYDP
            (
                Rut,
                DV,
                NombreFuncionario,
                FechaInicio,
                FechaTermino,
                TotalDias,
                TipoResolucion,
                NumeroResolucion,
                FechaResolucion,
                LugarDestino,
                TipoComision,
                Motivo,
                ValorViatico,
                Observacion
            )
            VALUES
            ${valueClauses.join(",\n")}
        `;

        await request.query(insertQuery);
    }

    console.log(`[Carga Repo] ✅ ${filas.length} registros insertados en dbo.SAGI_TMP_ViajesGYDP.`);
    return filas.length;
}

export async function limpiarEInsertarTmpViajesLobby(filas: Record<string, any>[], _usuarioCarga?: string): Promise<number> {
    console.log(`[Carga Repo] Procesando ${filas.length} registros para dbo.SAGI_TMP_ViajesLobby...`);
    const pool = await getConnection();

    await pool.request().query("TRUNCATE TABLE dbo.SAGI_TMP_ViajesLobby");

    const CHUNK_SIZE = 100;

    for (let i = 0; i < filas.length; i += CHUNK_SIZE) {
        const chunk = filas.slice(i, i + CHUNK_SIZE);
        const request = pool.request();
        const valueClauses: string[] = [];

        chunk.forEach((fila, idx) => {
            const idSujetoPasivo = parsearEntero(
                obtenerCampo(
                    fila,
                    "ID sujeto pasivo",
                    "Id sujeto pasivo",
                    "ID sujeto pasi",
                    "IdSujetoPasivo",
                    "ID"
                )
            );

            const nombreSujetoPasivo = texto(
                obtenerCampo(fila, "Sujeto pasivo", "NombreSujetoPasivo", "Nombre Sujeto Pasivo"),
                300
            );

            const cargo = texto(obtenerCampo(fila, "Cargo"), 300);
            const fechaInicio = parsearFecha(obtenerCampo(fila, "Fecha inicio", "FechaInicio", "Fecha Inicio"));
            const fechaTermino = parsearFecha(obtenerCampo(fila, "Fecha término", "Fecha Término", "Fecha Termino", "FechaTermino"));
            const destino = texto(obtenerCampo(fila, "Destino"), 500);
            const objeto = obtenerCampo(fila, "Objeto");
            const tipoViaje = texto(obtenerCampo(fila, "Tipo", "TipoViaje", "Tipo Viaje"), 200);
            const costoTotal = parsearMoney(obtenerCampo(fila, "Costo Total", "CostoTotal", "Costo total"));
            const financiadoPor = texto(obtenerCampo(fila, "Financiado por", "FinanciadoPor", "Financiado Por"), 300);

            const fechaUltimaModificacion = parsearFecha(
                obtenerCampo(
                    fila,
                    "Fecha última modificación",
                    "Fecha Última Modificación",
                    "FechaUltimaModificacion",
                    "Fecha Ultima Modificacion",
                    "Fecha última modificaci"
                )
            );

            request.input(`IdSujetoPasivo_${idx}`, sql.Int, idSujetoPasivo);
            request.input(`NombreSujetoPasivo_${idx}`, sql.VarChar(300), nombreSujetoPasivo);
            request.input(`Cargo_${idx}`, sql.VarChar(300), cargo);
            request.input(`FechaInicio_${idx}`, sql.Date, fechaInicio);
            request.input(`FechaTermino_${idx}`, sql.Date, fechaTermino);
            request.input(`Destino_${idx}`, sql.VarChar(500), destino);
            request.input(`Objeto_${idx}`, sql.VarChar(sql.MAX), objeto ? String(objeto) : null);
            request.input(`TipoViaje_${idx}`, sql.VarChar(200), tipoViaje);
            request.input(`CostoTotal_${idx}`, sql.Money, costoTotal);
            request.input(`FinanciadoPor_${idx}`, sql.VarChar(300), financiadoPor);
            request.input(`FechaUltimaModificacion_${idx}`, sql.Date, fechaUltimaModificacion);

            valueClauses.push(`(
                @IdSujetoPasivo_${idx},
                @NombreSujetoPasivo_${idx},
                @Cargo_${idx},
                @FechaInicio_${idx},
                @FechaTermino_${idx},
                @Destino_${idx},
                @Objeto_${idx},
                @TipoViaje_${idx},
                @CostoTotal_${idx},
                @FinanciadoPor_${idx},
                @FechaUltimaModificacion_${idx}
            )`);
        });

        const insertQuery = `
            INSERT INTO dbo.SAGI_TMP_ViajesLobby
            (
                IdSujetoPasivo,
                NombreSujetoPasivo,
                Cargo,
                FechaInicio,
                FechaTermino,
                Destino,
                Objeto,
                TipoViaje,
                CostoTotal,
                FinanciadoPor,
                FechaUltimaModificacion
            )
            VALUES
            ${valueClauses.join(",\n")}
        `;

        await request.query(insertQuery);
    }

    console.log(`[Carga Repo] ✅ ${filas.length} registros insertados en dbo.SAGI_TMP_ViajesLobby.`);
    return filas.length;
}

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

//export async function ejecutarCargaViajesLobby(usuarioCarga: string): Promise<IProcedureResult<any>> {
//    const pool = await getConnection();
//    const result = await pool
//        .request()
//        .input("UsuarioCarga", usuarioCarga)
//        .execute("SAGI_proc_CargaViajesLobby");

//    return result;
//}

//export async function ejecutarCargaViajesGydp(usuarioCarga: string): Promise<IProcedureResult<any>> {
//    const pool = await getConnection();
//    const result = await pool
//        .request()
//        .input("UsuarioCarga", usuarioCarga)
//        .execute("SAGI_proc_CargaViajesGydp");

//    return result;
//}

export async function ejecutarConsolidacionViajes(): Promise<IProcedureResult<any>> {
    const pool = await getConnection();
    const result = await pool
        .request()
        .execute("SAGI_proc_Viajes_Consolidar");

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