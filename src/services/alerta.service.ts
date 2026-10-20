import * as repository from "../repositories/alerta.repository";
import { Alerta, AlertaResumen } from "../types/alerta";

export async function obtenerAlertas(): Promise<Alerta[]> {
    return await repository.obtenerAlertas();
}

export async function obtenerResumenAlertas(): Promise<AlertaResumen | undefined> {
    return await repository.obtenerResumenAlertas();
}

export async function obtenerAlertasViajes(rango?: string): Promise<any[]> {
    return await repository.obtenerAlertasViajes(rango);
}