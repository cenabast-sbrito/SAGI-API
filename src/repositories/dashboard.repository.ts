import { sql, getConnection } from "../config/database";
import { DashboardResponse, FiltrosDashboard } from "../types/dashboard";

export async function obtenerDatosDashboard(filtros?: FiltrosDashboard): Promise<DashboardResponse> {
    const pool = await getConnection();
    const request = pool.request();

    const rango = filtros?.rango || "TODO";
    const fechaDesde = filtros?.fechaDesde ? new Date(filtros.fechaDesde) : null;
    const fechaHasta = filtros?.fechaHasta ? new Date(filtros.fechaHasta) : null;

    request.input("Rango", sql.VarChar(20), rango);
    request.input("FechaDesde", sql.Date, fechaDesde);
    request.input("FechaHasta", sql.Date, fechaHasta);

    const result = await request.execute("dbo.SAGI_proc_Dashboard_Alertas");

    const recordsets = result.recordsets || [];

    const kpis = recordsets[0]?.[0] || {
        TotalAlertas: 0,
        SolicitudesPendientes: 0,
        AudienciasPendientesPublicacion: 0,
        AlertasCriticas: 0
    };

    const alertasPorColor = recordsets[1] || [];
    const alertasPorTipo = recordsets[2] || [];
    const alertasPorFuncionario = recordsets[3] || [];
    const alertasCriticasPorFuncionario = recordsets[4] || [];
    const alertasPorEstado = recordsets[5] || [];
    const topAlertas = recordsets[6] || [];
    const cumplimiento = recordsets[7]?.[0] || {
        TotalAlertas: 0,
        TotalIncumplidas: 0,
        PorcentajeIncumplimiento: 0
    };

    return {
        kpis,
        alertasPorColor,
        alertasPorTipo,
        alertasPorFuncionario,
        alertasCriticasPorFuncionario,
        alertasPorEstado,
        topAlertas,
        cumplimiento
    };
}