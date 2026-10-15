import { Request, Response, NextFunction } from "express";

export function autorizar(rolesPermitidos: string[] = []) {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
        const usuario = req.user;

        if (!usuario) {
            return res.status(401).json({
                success: false,
                message: "No autenticado"
            });
        }

        // Si no se especifican roles requeridos, solo se valida autenticación
        if (rolesPermitidos.length === 0) {
            return next();
        }

        const rolUsuario = usuario.rol || usuario.role;
        const rolesUsuario = Array.isArray(usuario.roles)
            ? usuario.roles
            : rolUsuario
            ? [rolUsuario]
            : [];

        const tienePermiso = rolesPermitidos.some((rol) =>
            rolesUsuario.includes(rol)
        );

        if (!tienePermiso) {
            return res.status(403).json({
                success: false,
                message: "Permisos insuficientes para realizar esta acción"
            });
        }

        next();
    };
}

export default autorizar;