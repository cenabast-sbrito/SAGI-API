import { Router } from "express";
import * as controller from "../controllers/ldap.controller";

const router = Router();

router.post("/login", controller.login);
router.get("/config", controller.verificarConfiguracion);
router.get("/usuarios-autorizados", controller.obtenerUsuariosAutorizados);

export default router;