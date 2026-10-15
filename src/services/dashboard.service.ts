import * as repository from "../repositories/dashboard.repository";
import { DashboardResponse, FiltrosDashboard } from "../types/dashboard";

export async function obtenerDatosDashboard(filtros?: FiltrosDashboard): Promise<DashboardResponse> {
    return await repository.obtenerDatosDashboard(filtros);
}