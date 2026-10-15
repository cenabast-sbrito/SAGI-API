import { Request, Response, NextFunction } from "express";
import * as service from "../services/funcionario.service";

export async function obtenerFuncionarios(
    _req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const funcionarios = await service.obtenerFuncionarios();
        res.status(200).json(funcionarios);
    } catch (error) {
        next(error);
    }
}

export async function actualizarFuncionario(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const idSujetoPasivo = parseInt(req.params.id, 10);
        const { correo, activo } = req.body;

        await service.actualizarFuncionario(idSujetoPasivo, correo, activo);

        res.status(200).json({
            success: true
        });
    } catch (error) {
        next(error);
    }
}

export async function actualizarCorreo(
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> {
    try {
        const { nombreSujetoPasivo, correo } = req.body;

        const funcionario = await service.actualizarCorreoFuncionario(
            nombreSujetoPasivo,
            correo
        );

        res.status(200).json({
            success: true,
            data: funcionario
        });
    } catch (error) {
        next(error);
    }
}