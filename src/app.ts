import "promise.withresolvers/auto";
import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";

import swaggerSpec from "./config/swagger";
import routes from "./routes";
import errorHandler from "./middleware/errorHandler";

const app: Application = express();

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Documentación Swagger
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Prefijo estándar institucional v1
app.use("/api/sagi/v1", routes);

app.use(errorHandler);

export default app;
servers: [
    {
        url: "/api/sagi/v1",
        description: "Servidor API actual (v1)"
    }
]