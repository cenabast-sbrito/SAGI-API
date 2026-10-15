export interface DashboardKPI {
    TotalAlertas: number;
    SolicitudesPendientes: number;
    AudienciasPendientesPublicacion: number;
    AlertasCriticas: number;
}

export interface AlertaPorColor {
    EstadoPlazoRespuesta: string;
    Cantidad: number;
}

export interface AlertaPorTipo {
    TipoAlerta: string;
    Cantidad: number;
}

export interface AlertaPorFuncionario {
    IdSujetoPasivo: number;
    NombreSujetoPasivo: string;
    TotalAlertas: number;
}

export interface AlertaCriticaFuncionario {
    IdSujetoPasivo: number;
    NombreSujetoPasivo: string;
    TotalCriticas: number;
}

export interface AlertaPorEstado {
    Estado: string;
    Cantidad: number;
}

export interface TopAlerta {
    Folio: string;
    NombreSujetoPasivo: string;
    Estado: string;
    TipoAlerta: string;
    DiasEnEsperaHabiles: number;
    EstadoPlazoRespuesta: string;
    NivelAlerta: number;
}

export interface CumplimientoDashboard {
    TotalAlertas: number;
    TotalIncumplidas: number;
    PorcentajeIncumplimiento: number;
}

export interface DashboardResponse {
    kpis: DashboardKPI;
    alertasPorColor: AlertaPorColor[];
    alertasPorTipo: AlertaPorTipo[];
    alertasPorFuncionario: AlertaPorFuncionario[];
    alertasCriticasPorFuncionario: AlertaCriticaFuncionario[];
    alertasPorEstado: AlertaPorEstado[];
    topAlertas: TopAlerta[];
    cumplimiento: CumplimientoDashboard;
}

export interface FiltrosDashboard {
    rango?: string;
    fechaDesde?: string;
    fechaHasta?: string;
}