import { Request, Response, NextFunction } from "express";
import * as service from "../services/ldap.service";

export async function login(req: Request, res: Response, next: NextFunction): Promise<void | Response> {
    try {
        const { user, pass } = req.body;

        if (!user || !pass) {
            return res.status(400).json({
                success: false,
                message: "Usuario y contraseña requeridos"
            });
        }

        const resultado = await service.autenticarUsuario({ user, pass });

        if (!resultado) {
            return res.status(401).json({
                success: false,
                message: "Credenciales inválidas o usuario no autorizado"
            });
        }

        return res.status(200).json({
            success: true,
            token: resultado.token,
            data: resultado.usuario
        });
    } catch (error) {
        next(error);
    }
}

export async function obtenerUsuariosAutorizados(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
        const usuarios = await service.obtenerUsuariosAutorizados();
        res.status(200).json({
            success: true,
            data: usuarios
        });
    } catch (error) {
        next(error);
    }
}

export function verificarConfiguracion(_req: Request, res: Response): Response {
    const config = service.verificarConfiguracion();
    return res.status(200).json({
        success: true,
        data: config
    });
}