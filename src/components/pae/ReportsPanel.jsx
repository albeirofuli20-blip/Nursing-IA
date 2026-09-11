import { useMemo } from "react";
import { BarChart3, TrendingUp, Users, Activity, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const MONTH_NAMES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
const DOMAIN_COLORS = ["#002D62", "#00A8B5", "#16A34A", "#F59E0B", "#8B5CF6", "#EC4899", "#06B6D4", "#94a3b8"];

export default function ReportsPanel({ plans = [], patients = [] }) {
  const stats = useMemo(() => {
    const total = plans.length;
    const activos = plans.filter((p) => p.status === "activo").length;
    const completados = plans.filter((p) => p.status === "completado").length;
    const completionRate = total > 0 ? Math.round((completados / total) * 100) : 0;
    return { total, activos, completados, completionRate, activePatients: patients.length };
  }, [plans, patients]);

  const byMonth = useMemo(() => {
    const counts = {};
    plans.forEach((p) => {
      const d = p.created_date ? new Date(p.created_date) : null;
      if (d) {
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (!counts[key]) counts[key] = { label: `${MONTH_NAMES[d.getMonth()]} ${String(d.getFullYear()).slice(2)}`, planes: 0, activos: 0 };
        counts[key].planes++;
        if (p.status === "activo") counts[key].activos++;
      }
    });
    return Object.values(counts).sort((a, b) => a.label.localeCompare(b.label)).slice(-6);
  }, [plans]);

  const byDomain = useMemo(() => {
    const counts = {};
    plans.forEach((p) => {
      (p.diagnoses || []).forEach((d) => {
        const domain = d.domain || "Sin dominio";
        counts[domain] = (counts[domain] || 0) + 1;
      });
    });
    return Object.entries(counts)
      .map(([name, value], i) => ({ name, value, color: DOMAIN_COLORS[i % DOMAIN_COLORS.length] }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);
  }, [plans]);

  const byStatus = useMemo(() => {
    const borrador = plans.filter((p) => p.status === "borrador").length;
    const activo = plans.filter((p) => p.status === "activo").length;
    const completado = plans.filter((p) => p.status === "completado").length;
    return { borrador, activo, completado };
  }, [plans]);

  const kpis = [
    { label: "PAE totales", value: stats.total, icon: ClipboardList, color: "bg-sky-50 text-sky-700" },
    { label: "Pacientes activos", value: stats.activePatients, icon: Users, color: "bg-emerald-50 text-emerald-700" },
    { label: "PAE activos", value: stats.activos, icon: Activity, color: "bg-violet-50 text-violet-700" },
    { label: "Tasa de completitud", value: `${stats.completionRate}%`, icon: TrendingUp, color: "bg-amber-50 text-amber-700" }
  ];

  const hasData = plans.length > 0;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Reportes</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Reportes clínicos</h2>
        <p className="mt-2 text-slate-600">Indicadores en tiempo real calculados desde los planes de atención y pacientes registrados.</p>
      </div>

      {!hasData && (
        <div className="mb-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
          <ClipboardList className="mx-auto mb-2 h-8 w-8 text-slate-400" />
          <p className="text-sm text-slate-500">Aún no hay planes de atención registrados. Los reportes se generarán automáticamente cuando crees PAE.</p>
        </div>
      )}

      {hasData && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((k) => {
              const Icon = k.icon;
              return (
                <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <div className={`mb-3 inline-flex rounded-xl p-2.5 ${k.color}`}><Icon className="h-5 w-5" /></div>
                  <p className="text-2xl font-bold text-slate-900">{k.value}</p>
                  <p className="text-sm text-slate-500">{k.label}</p>
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid gap-4 lg:grid-cols-2">
            {byMonth.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><BarChart3 className="h-5 w-5 text-[#002D62]" />PAE por mes</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={byMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis dataKey="label" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="planes" name="Total" fill="#002D62" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="activos" name="Activos" fill="#00A8B5" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {byDomain.length > 0 && (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><BarChart3 className="h-5 w-5 text-[#002D62]" />PAE por dominio NANDA</h3>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie data={byDomain} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11 }}>
                      {byDomain.map((e) => <Cell key={e.name} fill={e.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
              <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><TrendingUp className="h-5 w-5 text-[#002D62]" />Estado de los planes</h3>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-xl bg-slate-50 p-4 text-center">
                  <p className="text-3xl font-bold text-slate-600">{stats.total}</p>
                  <p className="text-sm text-slate-500">Total</p>
                </div>
                <div className="rounded-xl bg-violet-50 p-4 text-center">
                  <p className="text-3xl font-bold text-violet-700">{byStatus.activo}</p>
                  <p className="text-sm text-slate-500">Activos</p>
                </div>
                <div className="rounded-xl bg-green-50 p-4 text-center">
                  <p className="text-3xl font-bold text-green-700">{byStatus.completado}</p>
                  <p className="text-sm text-slate-500">Completados</p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}