import { BarChart3, FileText, TrendingUp, Users, Activity, ClipboardList } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from "recharts";

const PAE_BY_MONTH = [
  { month: "Ene", planes: 12, activos: 8 },
  { month: "Feb", planes: 18, activos: 14 },
  { month: "Mar", planes: 25, activos: 20 },
  { month: "Abr", planes: 30, activos: 22 },
  { month: "May", planes: 38, activos: 28 },
  { month: "Jun", planes: 45, activos: 35 }
];

const BY_DOMAIN = [
  { name: "Seguridad", value: 30, color: "#002D62" },
  { name: "Confort", value: 20, color: "#00A8B5" },
  { name: "Nutrición", value: 15, color: "#16A34A" },
  { name: "Movilidad", value: 25, color: "#F59E0B" },
  { name: "Otros", value: 10, color: "#94a3b8" }
];

const SATISFACTION = [
  { month: "Ene", score: 78 },
  { month: "Feb", score: 82 },
  { month: "Mar", score: 85 },
  { month: "Abr", score: 87 },
  { month: "May", score: 89 },
  { month: "Jun", score: 91 }
];

export default function ReportsPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 15</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Reportes</h2>
        <p className="mt-2 text-slate-600">Generación de reportes en PDF, Word y Excel con paneles gráficos, indicadores e históricos.</p>
      </div>
      <div className="mb-6 flex flex-wrap gap-3">
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#002D62] px-4 py-2 text-sm font-semibold text-white hover:bg-[#001f4d]"><FileText className="h-4 w-4" />Exportar PDF</button>
        <button className="inline-flex items-center gap-2 rounded-lg bg-[#00A8B5] px-4 py-2 text-sm font-semibold text-white hover:bg-[#008f99]"><FileText className="h-4 w-4" />Exportar Word</button>
        <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"><FileText className="h-4 w-4" />Exportar Excel</button>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "PAE totales", value: "168", icon: ClipboardList, color: "bg-sky-50 text-sky-700" },
          { label: "Pacientes activos", value: "42", icon: Users, color: "bg-emerald-50 text-emerald-700" },
          { label: "Tasa de cumplimiento", value: "87%", icon: TrendingUp, color: "bg-violet-50 text-violet-700" },
          { label: "Satisfacción", value: "91%", icon: Activity, color: "bg-amber-50 text-amber-700" }
        ].map((k) => {
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
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><BarChart3 className="h-5 w-5 text-[#002D62]" />PAE por mes</h3>
          <ResponsiveContainer width="100%" height={250}><BarChart data={PAE_BY_MONTH}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 12 }} /><Tooltip /><Bar dataKey="planes" fill="#002D62" radius={[4, 4, 0, 0]} /><Bar dataKey="activos" fill="#00A8B5" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><BarChart3 className="h-5 w-5 text-[#002D62]" />PAE por dominio</h3>
          <ResponsiveContainer width="100%" height={250}><PieChart><Pie data={BY_DOMAIN} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={{ fontSize: 11 }}>{BY_DOMAIN.map((e) => <Cell key={e.name} fill={e.color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900"><TrendingUp className="h-5 w-5 text-[#002D62]" />Tendencia de satisfacción</h3>
          <ResponsiveContainer width="100%" height={250}><LineChart data={SATISFACTION}><CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" /><XAxis dataKey="month" tick={{ fontSize: 12 }} /><YAxis domain={[70, 100]} tick={{ fontSize: 12 }} /><Tooltip /><Line type="monotone" dataKey="score" stroke="#00A8B5" strokeWidth={3} dot={{ r: 5 }} /></LineChart></ResponsiveContainer>
        </div>
      </div>
    </section>
  );
}