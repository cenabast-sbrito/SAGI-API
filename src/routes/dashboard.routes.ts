import { Router } from "express";
import * as controller from "../controllers/dashboard.controller";

const router = Router();

router.get("/", controller.obtenerDashboard);

export default router;