import { Request } from "express";

export interface JwtPayloadUsuario {
    user?: string;
    username?: string;
    nombre?: string;
    rol?: string;
    roles?: string[];
    [key: string]: unknown;
}

declare global {
    namespace Express {
        interface Request {
            user?: JwtPayloadUsuario;
            usuarioActual?: string | null;
        }
    }
}