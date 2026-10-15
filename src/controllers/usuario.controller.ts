import { Request, Response } from "express";

export function obtenerUsuarioActual(req: Request, res: Response): Response {
    return res.status(200).json({
        usuario: req.user || req.usuarioActual
    });
}