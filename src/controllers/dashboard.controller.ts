import { Request, Response, NextFunction } from "express";
import * as service from "../services/dashboard.service";

export async function obtenerDashboard(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const datos = await service.obtenerDatosDashboard();
        res.status(200).json(datos);
    } catch (error) {
        next(error);
    }
}