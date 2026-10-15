import { Router, Request, Response, NextFunction } from "express";
import funcionarioRoutes from "./funcionario.routes";
import cargaRoutes from "./carga.routes";
import alertaRoutes from "./alerta.routes";
import dashboardRoutes from "./dashboard.routes";
import usuarioRoutes from "./usuario.routes";
import ldapRoutes from "./ldap.routes";
import autenticarToken from "../middleware/auth.middleware";

const router = Router();

// Rutas públicas
router.get("/health", (_req: Request, res: Response) => {
    res.json({
        success: true,
        message: "SAGI API funcionando"
    });
});

router.use("/ldap", ldapRoutes);

// Middleware de autenticación para rutas protegidas
router.use(autenticarToken);

router.use((req: Request, _res: Response, next: NextFunction) => {
    req.usuarioActual =
        req.user?.user ||
        req.user?.username ||
        req.user?.nombre ||
        null;

    next();
});

// Rutas protegidas
router.use("/funcionarios", funcionarioRoutes);
router.use("/cargas", cargaRoutes);
router.use("/alertas", alertaRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/usuario", usuarioRoutes);

export default router;

export interface Alerta {
    IdAlerta?: number;
    TipoAlerta: string;
    Descripcion: string;
    Fecha?: Date;
    [key: string]: unknown;
}

export interface AlertaResumen {
    TotalAlertas: number;
    AlertasCriticas: number;
    AlertasPendientes: number;
    [key: string]: unknown;
}