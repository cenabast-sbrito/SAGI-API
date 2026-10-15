import * as repository from "../repositories/dashboard.repository";

export async function obtenerDatosDashboard(): Promise<any> {
    return await repository.obtenerDatosDashboard();
}