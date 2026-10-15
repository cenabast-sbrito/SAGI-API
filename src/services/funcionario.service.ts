import * as repository from "../repositories/funcionario.repository";
import { Funcionario } from "../types/funcionario";

export async function obtenerFuncionarios(): Promise<Funcionario[]> {
    return await repository.obtenerFuncionarios();
}

export async function actualizarFuncionario(
    idSujetoPasivo: number,
    correo: string,
    activo: boolean
): Promise<boolean> {
    return await repository.actualizarFuncionario(idSujetoPasivo, correo, activo);
}

export async function actualizarCorreoFuncionario(
    nombreSujetoPasivo: string,
    correo: string
): Promise<Funcionario | undefined> {
    return await repository.actualizarCorreoFuncionario(nombreSujetoPasivo, correo);
}