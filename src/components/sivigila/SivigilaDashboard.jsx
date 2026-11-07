import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { BellRing, BadgeCheck, Activity, Skull, Clock } from "lucide-react";
import { agruparPorMunicipio, agruparPorSemana, esConfirmado, esGrave, semanaActual } from "@/lib/sivigila";

function Kpi({ label, value, hint, Icon, tone }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className={`mb-3 inline-flex rounded-xl p-2 ${tone}`}><Icon className="h-4 w-4" /></div>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
      <p className="text-sm font-medium text-slate-600">{label}</p>
      {hint && <p className="mt-0.5 text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

export default function SivigilaDashboard({ fichas, municipio }) {
  const semanaRef = useMemo(() => {
    const actual = semanaActual();
    if (fichas.some((f) => f.semana_epidemiologica === actual)) return actual;
    const semanas = agruparPorSemana(fichas);
    return semanas.length ? semanas[semanas.length - 1].semana : actual;
  }, [fichas]);

  const semanaFichas = useMemo(() => fichas.filter((f) => f.semana_epidemiologica === semanaRef), [fichas, semanaRef]);
  const oportunas = semanaFichas.filter((f) => f.notificado_oportunamente).length;
  const oportunidad = semanaFichas.length ? Math.round((oportunas / semanaFichas.length) * 100) : 0;

  const porSemana = agruparPorSemana(fichas);
  const porMunicipio = agruparPorMunicipio(fichas);

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Semana epidemiológica actual</h2>
          <p className="text-sm text-slate-500">{semanaRef} · {municipio ? `Municipio de ${municipio}` : "Todos los municipios"}</p>
        </div>
        <p className="text-xs text-slate-400">Fuente: fichas de notificación SIVIGILA</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <Kpi label="Casos notificados" value={semanaFichas.length} Icon={BellRing} tone="bg-sky-50 text-sky-600" />
        <Kpi label="Casos confirmados" value={semanaFichas.filter(esConfirmado).length} Icon={BadgeCheck} tone="bg-emerald-50 text-emerald-600" hint="Por laboratorio o nexo" />
        <Kpi label="Casos graves" value={semanaFichas.filter(esGrave).length} Icon={Activity} tone="bg-red-50 text-red-600" hint="Evento 220" />
        <Kpi label="Muertes" value={semanaFichas.filter((f) => String(f.codigo_evento).startsWith("580")).length} Icon={Skull} tone="bg-purple-50 text-purple-600" hint="Evento 580" />
        <Kpi label="Notificación oportuna" value={`${oportunidad}%`} Icon={Clock} tone="bg-amber-50 text-amber-600" hint={`${oportunas} de ${semanaFichas.length} fichas`} />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Casos por semana epidemiológica</h3>
          {porSemana.length === 0 ? <p className="py-16 text-center text-sm text-slate-400">Sin datos para graficar.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={porSemana} margin={{ top: 4, right: 8, left: -18, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="semana" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={54} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, "Casos"]} />
                <Bar dataKey="casos" fill="#00A8B5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500">Casos por municipio</h3>
          {porMunicipio.length === 0 ? <p className="py-16 text-center text-sm text-slate-400">Sin datos para graficar.</p> : (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={porMunicipio} layout="vertical" margin={{ top: 4, right: 16, left: 8, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" horizontal={false} />
                <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="municipio" width={110} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [v, "Casos"]} />
                <Bar dataKey="casos" fill="#002D62" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </section>
  );
}