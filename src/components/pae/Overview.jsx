import { BookOpen, ClipboardList, Users, Sparkles, ShieldCheck, GraduationCap, FileText, Pill, FlaskConical, Stethoscope, MessageSquare, HeartHandshake, Search, BarChart3, Bell, Award, ShoppingBag, CreditCard, Settings, UsersRound, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAppSummaryToWord } from "@/lib/exportAppSummary";

export default function Overview({ patients, guides, plans, onNavigate, role }) {
  const stats = [["Pacientes", patients, Users, "bg-sky-50 text-sky-700"], ["Guías vigentes", guides, BookOpen, "bg-emerald-50 text-emerald-700"], ["Planes PAE", plans, ClipboardList, "bg-violet-50 text-violet-700"]];
  const shortcuts = [
    ["pacientes", "Pacientes y PAE", ClipboardList, "bg-sky-50 text-sky-600 ring-sky-100"],
    ["guias", "Guías", BookOpen, "bg-emerald-50 text-emerald-600 ring-emerald-100"],
    ["medicamentos", "Medicamentos", Pill, "bg-rose-50 text-rose-600 ring-rose-100"],
    ["laboratorios", "Laboratorios", FlaskConical, "bg-violet-50 text-violet-600 ring-violet-100"],
    ["procedimientos", "Procedimientos", Stethoscope, "bg-teal-50 text-teal-600 ring-teal-100"],
    ["chat", "Chat IA", MessageSquare, "bg-indigo-50 text-indigo-600 ring-indigo-100"],
    ["educacion", "Educación", GraduationCap, "bg-amber-50 text-amber-600 ring-amber-100"],
    ["comunidad", "Comunidad y APS", HeartHandshake, "bg-pink-50 text-pink-600 ring-pink-100"],
    ["investigacion", "Investigación", Search, "bg-cyan-50 text-cyan-600 ring-cyan-100"],
    ["reportes", "Reportes", BarChart3, "bg-orange-50 text-orange-600 ring-orange-100"],
    ["notificaciones", "Notificaciones", Bell, "bg-yellow-50 text-yellow-700 ring-yellow-100"],
    ["cursos", "Cursos", Award, "bg-purple-50 text-purple-600 ring-purple-100"],
    ["marketplace", "Marketplace", ShoppingBag, "bg-fuchsia-50 text-fuchsia-600 ring-fuchsia-100"],
    ["suscripciones", "Planes", CreditCard, "bg-green-50 text-green-700 ring-green-100"],
    ["seguridad", "Seguridad", ShieldCheck, "bg-slate-100 text-slate-700 ring-slate-200"],
    ["principios", "Principios", Sparkles, "bg-blue-50 text-blue-600 ring-blue-100"],
    ["ajustes", "Ajustes", Settings, "bg-stone-100 text-stone-700 ring-stone-200"],
    ["ia-ecosistema", "IA Ecosistema", Sparkles, "bg-indigo-50 text-indigo-700 ring-indigo-100"],
    ...(role === "admin" ? [["usuarios", "Usuarios", UsersRound, "bg-sky-50 text-sky-700 ring-sky-100"], ["auditoria", "Auditoría", FileCheck2, "bg-stone-100 text-stone-700 ring-stone-200"], ["negocio", "Negocio", BarChart3, "bg-lime-50 text-lime-700 ring-lime-100"], ["ia-config", "IA Config", Settings, "bg-violet-50 text-violet-700 ring-violet-100"]] : []),
  ];
  return <section>
    <div className="mb-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Nurse Master IA</p>
          <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Tu copiloto inteligente para dominar el PAE</h2>
          <p className="mt-2 max-w-2xl text-slate-600">Centraliza la valoración y construye planes NANDA, NOC y NIC con apoyo de IA, escalas clínicas y revisión profesional.</p>
        </div>
        <Button onClick={exportAppSummaryToWord} className="shrink-0 gap-1.5 bg-[#002D62] hover:bg-[#002D62]/90"><FileText className="h-4 w-4" /> Resumen en Word</Button>
      </div>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(([label, value, Icon, color]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 inline-flex rounded-xl p-2.5 ${color}`}><Icon className="h-5 w-5" /></div><p className="text-3xl font-bold text-slate-900">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}</div>
    <div className="mt-8">
      <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-500">Accesos directos</h3>
      <div className="mt-3 grid gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {shortcuts.map(([id, label, Icon, color]) => <button key={id} type="button" onClick={() => onNavigate?.(id)} className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-[#00A8B5]/50 hover:shadow-md">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ${color}`}><Icon className="h-5 w-5" /></div>
          <span className="text-sm font-medium text-slate-700 group-hover:text-[#002D62]">{label}</span>
        </button>)}
      </div>
    </div>
    <div className="mt-6 rounded-lg bg-[#002D62] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white">Aprende • Aplica • Analiza • Evoluciona</div>
  </section>;
}