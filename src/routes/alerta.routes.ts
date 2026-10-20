import { Router } from "express";
import * as controller from "../controllers/alerta.controller";

const router = Router();

router.get("/", controller.obtenerAlertas);
router.get("/resumen", controller.obtenerResumenAlertas);
router.get("/viajes", controller.obtenerAlertasViajes);

export default router;