import { Router } from "express";
import * as controller from "../controllers/carga.controller";
import autorizar from "../middleware/autorizacion.middleware";

const router = Router();

router.post(
    "/solicitudes",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarSolicitudes
);

router.post(
    "/audiencias",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarAudiencias
);

router.post(
    "/audiencias/pendientes-publicacion",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarAudiencias
);

router.post(
    "/audiencias/publicadas",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.guardarAudienciasPublicadas
);

export default router;