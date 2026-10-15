import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JwtPayloadUsuario } from "../types/express";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export function autenticarToken(req: Request, res: Response, next: NextFunction): void | Response {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Acceso denegado: Token no proporcionado"
        });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({
                success: false,
                message: "Token inválido o expirado",
                error: err.message
            });
        }

        req.user = decoded as JwtPayloadUsuario;
        next();
    });
}

export default autenticarToken;