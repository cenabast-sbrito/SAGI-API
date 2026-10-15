export interface Funcionario {
    IdSujetoPasivo: number;
    NombreSujetoPasivo: string;
    Correo: string | null;
    Activo: boolean;
}

export interface ActualizarCorreoDTO {
    nombreSujetoPasivo: string;
    correo: string;
}

export interface ActualizarFuncionarioDTO {
    correo: string;
    activo: boolean;
}