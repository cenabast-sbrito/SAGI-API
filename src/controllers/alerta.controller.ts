import { Request, Response, NextFunction } from "express";
import * as service from "../services/alerta.service";

export async function obtenerAlertas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const alertas = await service.obtenerAlertas();
        res.status(200).json(alertas);
    } catch (error) {
        next(error);
    }
}

export async function obtenerResumenAlertas(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const resumen = await service.obtenerResumenAlertas();
        res.status(200).json(resumen);
    } catch (error) {
        next(error);
    }
}