import { Request, Response, NextFunction } from "express";
import * as service from "../services/dashboard.service";
import { FiltrosDashboard } from "../types/dashboard";

export async function obtenerDashboard(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const { rango, fechaDesde, fechaHasta } = req.query;

        const filtros: FiltrosDashboard = {
            rango: typeof rango === "string" ? rango : undefined,
            fechaDesde: typeof fechaDesde === "string" ? fechaDesde : undefined,
            fechaHasta: typeof fechaHasta === "string" ? fechaHasta : undefined
        };

        const datos = await service.obtenerDatosDashboard(filtros);
        res.status(200).json(datos);
    } catch (error) {
        next(error);
    }
}