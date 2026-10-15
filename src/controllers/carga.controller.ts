import { Request, Response, NextFunction } from "express";
import * as service from "../services/carga.service";

export async function cargarSolicitudes(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "") as string;
        await service.cargarSolicitudes(usuarioCarga);

        res.status(200).json({
            success: true,
            message: "Carga de solicitudes ejecutada correctamente"
        });
    } catch (error) {
        next(error);
    }
}

export async function cargarAudiencias(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const usuarioCarga: string = (req.body?.usuarioCarga || req.user?.user || req.usuarioActual || "") as string;
        await service.cargarAudiencias(usuarioCarga);

        res.status(200).json({
            success: true,
            message: "Carga de audiencias ejecutada correctamente"
        });
    } catch (error) {
        next(error);
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