import { Router } from "express";
import * as controller from "../controllers/funcionario.controller";
import autorizar from "../middleware/autorizacion.middleware";

const router = Router();

// Cualquier usuario SAGI activo (sin restricción de rol)
router.get(
    "/",
    autorizar(),
    controller.obtenerFuncionarios
);

// Solo usuarios con rol ADMIN
router.patch(
    "/correo",
    autorizar(["ADMIN"]),
    controller.actualizarCorreo
);

// Solo usuarios con rol ADMIN
router.put(
    "/:id",
    autorizar(["ADMIN"]),
    controller.actualizarFuncionario
);

export default router;