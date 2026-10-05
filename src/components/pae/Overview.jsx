import { BookOpen, ClipboardList, Users, Sparkles, ShieldCheck, GraduationCap, FileText, Pill, FlaskConical, Stethoscope, MessageSquare, HeartHandshake, Search, BarChart3, Bell, Award, ShoppingBag, CreditCard, Settings, UsersRound, FileCheck2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportAppSummaryToWord } from "@/lib/exportAppSummary";

export default function Overview({ patients, guides, plans, onNavigate, role }) {
  const stats = [["Pacientes", patients, Users, "bg-sky-50 text-sky-700"], ["Guías vigentes", guides, BookOpen, "bg-emerald-50 text-emerald-700"], ["Planes PAE", plans, ClipboardList, "bg-violet-50 text-violet-700"]];
  const shortcuts = [
    ["pacientes", "Pacientes y PAE", ClipboardList],
    ["guias", "Guías", BookOpen],
    ["medicamentos", "Medicamentos", Pill],
    ["laboratorios", "Laboratorios", FlaskConical],
    ["procedimientos", "Procedimientos", Stethoscope],
    ["chat", "Chat IA", MessageSquare],
    ["educacion", "Educación", GraduationCap],
    ["comunidad", "Comunidad y APS", HeartHandshake],
    ["investigacion", "Investigación", Search],
    ["reportes", "Reportes", BarChart3],
    ["notificaciones", "Notificaciones", Bell],
    ["cursos", "Cursos", Award],
    ["marketplace", "Marketplace", ShoppingBag],
    ["suscripciones", "Planes", CreditCard],
    ["seguridad", "Seguridad", ShieldCheck],
    ["principios", "Principios", Sparkles],
    ["ajustes", "Ajustes", Settings],
    ["ia-ecosistema", "IA Ecosistema", Sparkles],
    ...(role === "admin" ? [["usuarios", "Usuarios", UsersRound], ["auditoria", "Auditoría", FileCheck2], ["negocio", "Negocio", BarChart3], ["ia-config", "IA Config", Settings]] : []),
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
        {shortcuts.map(([id, label, Icon]) => <button key={id} type="button" onClick={() => onNavigate?.(id)} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left transition hover:border-[#00A8B5]/60 hover:bg-[#00A8B5]/5">
          <div className="rounded-lg bg-[#002D62]/10 p-2 text-[#002D62]"><Icon className="h-4 w-4" /></div>
          <span className="text-sm font-medium text-slate-700">{label}</span>
        </button>)}
      </div>
    </div>
    <div className="mt-6 rounded-lg bg-[#002D62] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white">Aprende • Aplica • Analiza • Evoluciona</div>
  </section>;
}