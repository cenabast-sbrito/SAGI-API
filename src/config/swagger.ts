const basePath = process.env.BASE_PATH || "";

export const swaggerSpec = {
    openapi: "3.0.0",
    info: {
        title: "SAGI API",
        version: "1.0.0",
        description: "API del Sistema de Alertas y Gestion Institucional (SAGI)"
    },
    servers: [
        {
            url: `${basePath}/api/sagi/v1`,
            description: "Servidor API actual (v1)"
        }
    ],
    components: {
        securitySchemes: {
            BearerAuth: {
                type: "http",
                scheme: "bearer",
                bearerFormat: "JWT",
                description: "Ingrese el token JWT obtenido del endpoint /ldap/login"
            }
        }
    },
    paths: {
        "/health": {
            get: {
                summary: "Verifica el estado del servicio",
                tags: ["Salud"],
                responses: {
                    200: { description: "API funcionando correctamente" }
                }
            }
        },
        "/ldap/login": {
            post: {
                summary: "Autenticacion LDAP y generacion de token JWT",
                tags: ["Autenticacion LDAP"],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["user", "pass"],
                                properties: {
                                    user: { type: "string", example: "usuarioWindows" },
                                    pass: { type: "string", example: "password123" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Autenticacion exitosa y retorno de JWT" },
                    400: { description: "Datos de entrada invalidos" },
                    401: { description: "Credenciales invalidas" },
                    403: { description: "Usuario no autorizado" }
                }
            }
        },
        "/ldap/config": {
            get: {
                summary: "Verifica la configuracion del servidor LDAP",
                tags: ["Autenticacion LDAP"],
                responses: {
                    200: { description: "Configuracion LDAP valida" },
                    500: { description: "Faltan variables de configuracion" }
                }
            }
        },
        "/ldap/usuarios-autorizados": {
            get: {
                summary: "Lista los usuarios con autorizacion en LDAP",
                tags: ["Autenticacion LDAP"],
                responses: {
                    200: { description: "Listado de usuarios autorizados" }
                }
            }
        },
        "/usuario": {
            get: {
                summary: "Obtiene los datos del usuario autenticado en la sesion",
                tags: ["Usuario"],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: "Informacion del usuario extraida del token" },
                    401: { description: "Token no proporcionado" },
                    403: { description: "Token invalido o expirado" }
                }
            }
        },
        "/funcionarios": {
            get: {
                summary: "Lista de funcionarios",
                tags: ["Funcionarios"],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: "Listado obtenido correctamente" },
                    401: { description: "No autenticado" },
                    403: { description: "Sin permisos" }
                }
            }
        },
        "/funcionarios/correo": {
            patch: {
                summary: "Actualizar correo de funcionario por nombre (Requiere rol ADMIN)",
                tags: ["Funcionarios"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["nombreSujetoPasivo", "correo"],
                                properties: {
                                    nombreSujetoPasivo: { type: "string", example: "JUAN PEREZ" },
                                    correo: { type: "string", example: "juan.perez@institucion.cl" }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Correo de funcionario actualizado exitosamente" },
                    400: { description: "Datos de entrada inválidos o error en el procedimiento" },
                    401: { description: "No autenticado" },
                    403: { description: "Permisos insuficientes" }
                }
            }
        },
        "/funcionarios/{id}": {
            put: {
                summary: "Actualizar funcionario (Requiere rol ADMIN)",
                tags: ["Funcionarios"],
                security: [{ BearerAuth: [] }],
                parameters: [
                    { name: "id", in: "path", required: true, schema: { type: "integer" } }
                ],
                responses: {
                    200: { description: "Funcionario actualizado exitosamente" },
                    401: { description: "No autenticado" },
                    403: { description: "Permisos insuficientes" }
                }
            }
        },
        "/alertas": {
            get: {
                summary: "Obtiene listado de alertas",
                tags: ["Alertas"],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: "Alertas obtenidas con exito" },
                    401: { description: "No autenticado" }
                }
            }
        },
        "/alertas/resumen": {
            get: {
                summary: "Obtiene el resumen consolidado de alertas",
                tags: ["Alertas"],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: "Resumen obtenido con exito" },
                    401: { description: "No autenticado" }
                }
            }
        },
        "/cargas/solicitudes": {
            post: {
                summary: "Ejecuta proceso de carga de solicitudes",
                tags: ["Cargas"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { usuarioCarga: { type: "string", example: "LOC_SBRITO" } }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Carga ejecutada correctamente" }
                }
            }
        },
        "/cargas/audiencias": {
            post: {
                summary: "Ejecuta proceso de carga de audiencias",
                tags: ["Cargas"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                properties: { usuarioCarga: { type: "string", example: "LOC_SBRITO" } }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Carga ejecutada correctamente" }
                }
            }
        },
        "/cargas/audiencias/publicadas": {
            post: {
                summary: "Guarda audiencias publicadas con cabecera y detalle",
                tags: ["Cargas"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["cabecera", "detalles"],
                                properties: {
                                    cabecera: { type: "object" },
                                    detalles: { type: "array", items: { type: "object" } }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Audiencia guardada con exito" }
                }
            }
        },
        "/cargas/audiencias/pendientes-publicacion": {
            post: {
                summary: "Guarda audiencias pendientes de publicacion con cabecera y detalle",
                tags: ["Cargas"],
                security: [{ BearerAuth: [] }],
                requestBody: {
                    required: true,
                    content: {
                        "application/json": {
                            schema: {
                                type: "object",
                                required: ["cabecera", "detalles"],
                                properties: {
                                    cabecera: { type: "object" },
                                    detalles: { type: "array", items: { type: "object" } }
                                }
                            }
                        }
                    }
                },
                responses: {
                    200: { description: "Audiencias guardadas con exito" }
                }
            }
        },
        "/dashboard": {
            get: {
                summary: "Obtiene los indicadores y datos consolidados del dashboard",
                tags: ["Dashboard"],
                security: [{ BearerAuth: [] }],
                responses: {
                    200: { description: "Datos del dashboard obtenidos" },
                    401: { description: "No autenticado" }
                }
            }
        }
    }
};

export default swaggerSpec;