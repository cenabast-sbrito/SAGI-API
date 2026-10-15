import { Router } from "express";
import * as controller from "../controllers/usuario.controller";

const router = Router();

router.get("/", controller.obtenerUsuarioActual);

export default router;