const normalizar = (s: string) =>
  (s || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

const contieneCabecera = (headers: string[], required: string[]) => {
  const h = headers.map(normalizar);
  return required.every(r => h.includes(normalizar(r)));
};

function extraerFilasPorCabecera(
  sheetRows: any[][],
  requiredHeaders: string[],
  nombrePlanilla: string
): Record<string, any>[] {
  const headerIndex = sheetRows.findIndex(r =>
    contieneCabecera((r || []).map(x => String(x ?? "")), requiredHeaders)
  );

  if (headerIndex < 0) {
    throw new Error(`No se encontró la cabecera con las columnas requeridas para ${nombrePlanilla}.`);
  }

  const headers = sheetRows[headerIndex].map((x: any) => String(x ?? "").trim());

  const dataRows = sheetRows
    .slice(headerIndex + 1)
    .filter(r => r && r.some(c => String(c ?? "").trim() !== ""));

      return dataRows.map(r => {
        const obj: Record<string, any> = {};
        headers.forEach((h, i) => {
          obj[h] = r[i] ?? null;
        });
        return obj;
      });
}



