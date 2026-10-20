export interface Alerta {
    IdAlerta?: number;
    TipoAlerta: string;
    Descripcion: string;
    Fecha?: Date;
    [key: string]: unknown;
}

export interface AlertaResumen {
    TotalAlertas: number;
    AlertasCriticas: number;
    AlertasPendientes: number;
    [key: string]: unknown;
}

export interface AlertaViaje {
    Rut: number;
    TNombres: string;
    TPaterno: string;
    TMaterno: string;
    FechaInicio: string | Date;
    FechaTermino: string | Date;
    NombreCompleto?: string;
    [key: string]: unknown;
}