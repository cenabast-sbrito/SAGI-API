import * as repository from "../repositories/carga.repository";

export async function cargarSolicitudes(usuarioCarga: string) {
    return await repository.ejecutarCargaSolicitudes(usuarioCarga);
}

export async function cargarAudiencias(usuarioCarga: string) {
    return await repository.ejecutarCargaAudiencias(usuarioCarga);
}

export async function guardarAudienciasPublicadas(
    cabecera: Record<string, any>,
    detalles: Record<string, any>[]
) {
    return await repository.guardarAudienciasPublicadas(cabecera, detalles);
}