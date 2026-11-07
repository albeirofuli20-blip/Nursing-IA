import moment from "moment";

export const EVENTOS = ["210 - Dengue", "220 - Dengue grave", "580 - Mortalidad por dengue"];
export const TIPOS_DOCUMENTO = ["RC", "TI", "CC", "CE", "PA", "AS", "MS"];
export const UNIDADES_EDAD = ["Años", "Meses", "Días", "Horas"];
export const SEXOS = ["M", "F", "Indeterminado"];
export const REGIMENES = ["Contributivo", "Subsidiado", "Especial", "No afiliado"];
export const CLASIFICACIONES_INICIALES = ["Sospechoso", "Probable", "Confirmado", "Descartado"];
export const CLASIFICACIONES_FINALES = ["Dengue sin signos de alarma", "Dengue con signos de alarma", "Dengue grave", "No aplica"];
export const RESULTADOS_PRUEBA = ["Negativo", "Positivo", "Pendiente", "No realizada"];
export const RESULTADOS_FINALES = ["Confirmado por laboratorio", "Confirmado por nexo epidemiológico", "Descartado", "En estudio"];
export const ESTADOS = ["Notificado", "En estudio", "Ajustado", "Cerrado"];
export const TIPOS_AJUSTE = ["Sin ajuste", "Confirmado por laboratorio", "Confirmado por nexo", "Descartado", "Cambio de clasificación"];

export const SINTOMAS = [
  ["fiebre", "Fiebre"],
  ["cefalea", "Cefalea"],
  ["dolor_retroocular", "Dolor retroocular"],
  ["mialgia", "Mialgia"],
  ["artralgia", "Artralgia"],
  ["exantema", "Exantema"],
  ["nauseas", "Náuseas"],
  ["vomito", "Vómito"],
];

export const SIGNOS_ALARMA = [
  ["dolor_abdominal_intenso", "Dolor abdominal intenso"],
  ["vomito_persistente", "Vómito persistente"],
  ["sangrado_mucosas", "Sangrado de mucosas"],
  ["letargia", "Letargia"],
  ["hepatomegalia", "Hepatomegalia"],
  ["acumulacion_liquidos", "Acumulación de líquidos"],
  ["lipotimia", "Lipotimia"],
];

export function semanaLabel(fecha) {
  if (!fecha) return "";
  const m = moment(fecha);
  if (!m.isValid()) return "";
  return `SE ${String(m.isoWeek()).padStart(2, "0")} - ${m.isoWeekYear()}`;
}

export function semanaActual(fecha = new Date()) {
  return semanaLabel(moment(fecha).format("YYYY-MM-DD"));
}

export function horasDesdeSintomas(fechaNotificacion, fechaSintomas) {
  if (!fechaNotificacion || !fechaSintomas) return null;
  const a = moment(fechaNotificacion);
  const b = moment(fechaSintomas);
  if (!a.isValid() || !b.isValid()) return null;
  return Math.round((a.diff(b, "hours", true)) * 10) / 10;
}

export function tieneSignosAlarma(ficha) {
  return SIGNOS_ALARMA.some(([key]) => Boolean(ficha?.[key]));
}

export function esGrave(ficha) {
  return String(ficha?.codigo_evento || "").startsWith("220") || ficha?.clasificacion_final === "Dengue grave";
}

export function esOportuna(ficha) {
  const horas = ficha?.horas_hasta_notificacion;
  if (horas === null || horas === undefined || Number.isNaN(horas)) return false;
  if (horas < 0) return false;
  return esGrave(ficha) ? horas <= 24 : horas <= 48;
}

export function esConfirmado(ficha) {
  return String(ficha?.resultado_final || "").startsWith("Confirmado");
}

export function nombreCompleto(ficha) {
  return [ficha?.primer_nombre, ficha?.segundo_nombre, ficha?.primer_apellido, ficha?.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

export function diasDesde(fecha) {
  if (!fecha) return null;
  const m = moment(fecha);
  return m.isValid() ? moment().startOf("day").diff(m.startOf("day"), "days") : null;
}

export function agruparPorSemana(fichas) {
  const map = {};
  fichas.forEach((f) => {
    const key = f.semana_epidemiologica || "Sin semana";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([semana, casos]) => ({ semana, casos }))
    .sort((a, b) => {
      const pa = /SE\s+(\d+)\s*-\s*(\d+)/.exec(a.semana);
      const pb = /SE\s+(\d+)\s*-\s*(\d+)/.exec(b.semana);
      if (!pa || !pb) return a.semana.localeCompare(b.semana);
      return Number(pa[2]) - Number(pb[2]) || Number(pa[1]) - Number(pb[1]);
    })
    .slice(-10);
}

export function agruparPorMunicipio(fichas) {
  const map = {};
  fichas.forEach((f) => {
    const key = f.municipio || "Sin municipio";
    map[key] = (map[key] || 0) + 1;
  });
  return Object.entries(map)
    .map(([municipio, casos]) => ({ municipio, casos }))
    .sort((a, b) => b.casos - a.casos)
    .slice(0, 8);
}

export function siguienteConsecutivo(fichas) {
  const anio = moment().year();
  const max = fichas.reduce((acc, f) => {
    const m = /(\d+)\s*$/.exec(f.consecutivo || "");
    return m ? Math.max(acc, Number(m[1])) : acc;
  }, 0);
  return `SIV-${anio}-${String(max + 1).padStart(4, "0")}`;
}

const csvCell = (value) => {
  const text = value === null || value === undefined ? "" : String(value);
  return `"${text.replace(/"/g, '""')}"`;
};

export function construirCsvSivigila(fichas) {
  const headers = [
    "Codigo de evento",
    "Consecutivo",
    "Semana epidemiologica",
    "Fecha de notificacion",
    "UPGD",
    "Departamento",
    "Municipio",
    "Tipo de documento",
    "Numero de documento",
    "Nombres",
    "Apellidos",
    "Edad",
    "Unidad de medida",
    "Sexo",
    "Gestante",
    "Regimen",
    "EPS",
    "Hospitalizado",
    "Fecha de inicio de sintomas",
    "Clasificacion inicial",
    "Clasificacion final",
    "NS1",
    "IgM",
    "Resultado final",
    "Estado",
    "Tipo de ajuste",
  ];
  const rows = fichas.map((f) => [
    f.codigo_evento,
    f.consecutivo,
    f.semana_epidemiologica,
    f.fecha_notificacion,
    f.upgd,
    f.departamento,
    f.municipio,
    f.tipo_documento,
    f.numero_documento,
    [f.primer_nombre, f.segundo_nombre].filter(Boolean).join(" "),
    [f.primer_apellido, f.segundo_apellido].filter(Boolean).join(" "),
    f.edad,
    f.unidad_medida_edad,
    f.sexo,
    f.gestante ? "SI" : "NO",
    f.regimen,
    f.eps,
    f.paciente_hospitalizado ? "SI" : "NO",
    f.fecha_inicio_sintomas,
    f.clasificacion_inicial,
    f.clasificacion_final,
    f.ns1,
    f.igm,
    f.resultado_final,
    f.estado_notificacion,
    f.tipo_ajuste,
  ]);
  return [headers, ...rows].map((row) => row.map(csvCell).join(";")).join("\r\n");
}

export function exportarSivigilaCsv(fichas) {
  const hoy = moment();
  const nombre = `sivigila_dengue_${hoy.isoWeekYear()}_SE${String(hoy.isoWeek()).padStart(2, "0")}.csv`;
  const blob = new Blob([`\uFEFF${construirCsvSivigila(fichas)}`], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = nombre;
  link.click();
  URL.revokeObjectURL(link.href);
  return nombre;
}