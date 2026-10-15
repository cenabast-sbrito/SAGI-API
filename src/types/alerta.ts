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