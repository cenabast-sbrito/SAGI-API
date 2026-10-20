import { Router } from "express";
import * as controller from "../controllers/carga.controller";
import * as alertaController from "../controllers/alerta.controller";
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

// Consulta GET solicitada por el front
router.get(
    "/viajes",
    alertaController.obtenerAlertasViajes
);

router.post(
    "/viajes",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarViajes
);

router.post(
    "/viajes/lobby",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarViajesLobby
);

router.post(
    "/viajes/gydp",
    autorizar(["ADMIN", "OPERADOR"]),
    controller.cargarViajesGYDP
);

export default router;