import * as repository from "../repositories/alerta.repository";
import { Alerta, AlertaResumen } from "../types/alerta";

export async function obtenerAlertas(): Promise<Alerta[]> {
    return await repository.obtenerAlertas();
}

export async function obtenerResumenAlertas(): Promise<AlertaResumen | undefined> {
    return await repository.obtenerResumenAlertas();
}