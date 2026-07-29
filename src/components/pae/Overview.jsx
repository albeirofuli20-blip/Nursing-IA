import { BookOpen, ClipboardList, Users, Sparkles, ShieldCheck, GraduationCap } from "lucide-react";

export default function Overview({ patients, guides, plans }) {
  const stats = [["Pacientes", patients, Users, "bg-sky-50 text-sky-700"], ["Guías vigentes", guides, BookOpen, "bg-emerald-50 text-emerald-700"], ["Planes PAE", plans, ClipboardList, "bg-violet-50 text-violet-700"]];
  const features = [["Planifica mejor", ClipboardList], ["Inteligencia artificial", Sparkles], ["Cuidado seguro", ShieldCheck], ["Aprende y crece", GraduationCap]];
  return <section>
    <div className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Nurse Master IA</p>
      <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Tu copiloto inteligente para dominar el PAE</h2>
      <p className="mt-2 max-w-2xl text-slate-600">Centraliza la valoración y construye planes NANDA, NOC y NIC con apoyo de IA, escalas clínicas y revisión profesional.</p>
    </div>
    <div className="grid gap-4 sm:grid-cols-3">{stats.map(([label, value, Icon, color]) => <div key={label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className={`mb-4 inline-flex rounded-xl p-2.5 ${color}`}><Icon className="h-5 w-5" /></div><p className="text-3xl font-bold text-slate-900">{value}</p><p className="text-sm text-slate-500">{label}</p></div>)}</div>
    <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{features.map(([label, Icon]) => <div key={label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4"><div className="rounded-lg bg-[#002D62]/10 p-2 text-[#002D62]"><Icon className="h-4 w-4" /></div><span className="text-sm font-medium text-slate-700">{label}</span></div>)}</div>
    <div className="mt-6 rounded-lg bg-[#002D62] px-4 py-2.5 text-center text-xs font-semibold uppercase tracking-widest text-white">Aprende • Aplica • Analiza • Evoluciona</div>
  </section>;
}