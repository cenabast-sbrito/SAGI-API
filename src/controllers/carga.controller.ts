import { Request, Response, NextFunction } from "express";
import * as service from "../services/carga.service";
import { getConnection } from "../config/database";

export async function cargarSolicitudes(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "SISTEMA") as string;

        // Log del usuario real conectado a SQL Server (opcional)
        const cn = await getConnection();
        const who = await cn.request().query("SELECT SUSER_SNAME() AS DbUser, ORIGINAL_LOGIN() AS OriginalLogin, DB_NAME() AS DatabaseName");
        console.log("[DB USER]", who.recordset?.[0]);

        let filas: any[] | null = null;
        if (Array.isArray(req.body)) filas = req.body;
        else if (Array.isArray(req.body?.filas)) filas = req.body.filas;
        else if (Array.isArray(req.body?.data)) filas = req.body.data;
        else if (Array.isArray(req.body?.detalles)) filas = req.body.detalles;

        if (filas && filas.length > 0) {
            const resultado = await service.procesarJSONYCargarSolicitudes(filas, usuarioCarga);
            return res.status(200).json({ success: true, message: "Solicitudes cargadas correctamente", data: resultado });
        }

        await service.cargarSolicitudes(usuarioCarga);
        return res.status(200).json({ success: true, message: "Carga de solicitudes ejecutada correctamente" });
    } catch (error: any) {
        console.error("[Carga Controller] Error en cargarSolicitudes:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al procesar las solicitudes",
            sqlError: error.originalError?.message || error.code || null
        });
    }
}

export async function cargarAudiencias(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "SISTEMA") as string;
        
        let filas: any[] | null = null;
        if (Array.isArray(req.body)) {
            filas = req.body;
        } else if (Array.isArray(req.body?.filas)) {
            filas = req.body.filas;
        } else if (Array.isArray(req.body?.data)) {
            filas = req.body.data;
        } else if (Array.isArray(req.body?.detalles)) {
            filas = req.body.detalles;
        }

        if (filas && filas.length > 0) {
            const resultado = await service.procesarJSONYCargarAudiencias(filas, usuarioCarga);
            return res.status(200).json({
                success: true,
                message: "Audiencias cargadas correctamente",
                data: resultado
            });
        }

        await service.cargarAudiencias(usuarioCarga);
        return res.status(200).json({
            success: true,
            message: "Carga de audiencias ejecutada correctamente"
        });
    } catch (error: any) {
        console.error("[Carga Controller] Error en cargarAudiencias:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al procesar las audiencias",
            sqlError: error.originalError?.message || error.code || null
        });
    }
}

export async function guardarAudienciasPublicadas(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const { cabecera, detalles } = req.body;

        if (!cabecera || !Array.isArray(detalles) || detalles.length === 0) {
            return res.status(400).json({
                error: "cabecera y detalles son requeridos, detalles debe ser un array con al menos un elemento."
            });
        }

        const data = await service.guardarAudienciasPublicadas(cabecera, detalles);

        return res.status(200).json({
            message: "Audiencia publicada guardada correctamente",
            data
        });
    } catch (err: any) {
        if (err?.number || err?.errorNumber) {
            return res.status(500).json({
                ErrorNumber: err.number || err.errorNumber,
                ErrorSeverity: err.class || err.errorSeverity,
                ErrorState: err.state || err.errorState,
                ErrorProcedure: err.procName || err.errorProcedure,
                ErrorLine: err.lineNumber || err.errorLine,
                ErrorMessage: err.message || err.errorMessage
            });
        }

        next(err);
    }
}

export async function cargarViajes(req: Request, res: Response, _next: NextFunction): Promise<void | Response> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "SISTEMA") as string;

        const filasGYDP: Record<string, any>[] =
            Array.isArray(req.body?.viajesGYDP) ? req.body.viajesGYDP :
            Array.isArray(req.body?.gydp) ? req.body.gydp :
            [];

        const filasLobby: Record<string, any>[] =
            Array.isArray(req.body?.viajesLobby) ? req.body.viajesLobby :
            Array.isArray(req.body?.lobby) ? req.body.lobby :
            [];

        if (filasGYDP.length === 0 && filasLobby.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Debe enviar al menos un arreglo: viajesGYDP o viajesLobby."
            });
        }

        const resultado = await service.procesarJSONYCargarViajes(filasGYDP, filasLobby, usuarioCarga);

        return res.status(200).json({
            success: true,
            message: "Carga de viajes ejecutada correctamente",
            data: resultado
        });
    } catch (error: any) {
        console.error("[Carga Controller] Error en cargarViajes:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al procesar los viajes",
            sqlError: error.originalError?.message || error.code || null
        });
    }
}

export async function cargarViajesLobby(req: Request, res: Response, _next: NextFunction): Promise<void | Response> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "SISTEMA") as string;

        let filas: any[] | null = null;
        if (Array.isArray(req.body)) filas = req.body;
        else if (Array.isArray(req.body?.filas)) filas = req.body.filas;
        else if (Array.isArray(req.body?.data)) filas = req.body.data;
        else if (Array.isArray(req.body?.detalles)) filas = req.body.detalles;

        if (filas && filas.length > 0) {
            const resultado = await service.procesarJSONYCargarViajesLobby(filas, usuarioCarga);
            return res.status(200).json({
                success: true,
                message: "Viajes Lobby cargados correctamente",
                data: resultado
            });
        }

        await service.cargarViajes();
        return res.status(200).json({
            success: true,
            message: "Consolidación de viajes ejecutada correctamente"
        });
    } catch (error: any) {
        console.error("[Carga Controller] Error en cargarViajesLobby:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al procesar los viajes Lobby",
            sqlError: error.originalError?.message || error.code || null
        });
    }
}

export async function cargarViajesGYDP(req: Request, res: Response, _next: NextFunction): Promise<void | Response> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "SISTEMA") as string;

        let filas: any[] | null = null;
        if (Array.isArray(req.body)) filas = req.body;
        else if (Array.isArray(req.body?.filas)) filas = req.body.filas;
        else if (Array.isArray(req.body?.data)) filas = req.body.data;
        else if (Array.isArray(req.body?.detalles)) filas = req.body.detalles;

        if (filas && filas.length > 0) {
            const resultado = await service.procesarJSONYCargarViajesGYDP(filas, usuarioCarga);
            return res.status(200).json({
                success: true,
                message: "Viajes GYDP cargados correctamente",
                data: resultado
            });
        }

        await service.cargarViajes();
        return res.status(200).json({
            success: true,
            message: "Consolidación de viajes ejecutada correctamente"
        });
    } catch (error: any) {
        console.error("[Carga Controller] Error en cargarViajesGYDP:", error);
        return res.status(500).json({
            success: false,
            message: error.message || "Error al procesar los viajes GYDP",
            sqlError: error.originalError?.message || error.code || null
        });
    }
}