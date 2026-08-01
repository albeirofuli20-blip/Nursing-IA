import { BookOpen, Search, FileText, FolderKanban } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const REFERENCES = [
  { title: "Effectiveness of NANDA-I taxonomy in nursing care plans", authors: "Müller-Staub et al.", journal: "Journal of Advanced Nursing", year: 2024, tags: ["NANDA-I", "PAE"] },
  { title: "AI-assisted clinical decision support in nursing: a systematic review", authors: "Chen, L. et al.", journal: "JAMIA", year: 2025, tags: ["IA", "Enfermería"] },
  { title: "Rutas Integrales de Atención en Salud: evaluación de implementación", authors: "Restrepo, A. et al.", journal: "Revista de Salud Pública", year: 2023, tags: ["APS", "RIAS"] },
  { title: "Validation of the Braden Scale for pressure ulcer risk in ICU patients", authors: "García, M. et al.", journal: "Intensive & Critical Care Nursing", year: 2024, tags: ["Escalas", "Braden"] },
  { title: "Nursing interventions (NIC) effectiveness in wound care management", authors: "Bulechek, G. et al.", journal: "International Journal of Nursing Studies", year: 2023, tags: ["NIC", "Heridas"] }
];

const PROJECTS = [
  { title: "Adherencia terapéutica en pacientes crónicos", status: "En curso", team: 4 },
  { title: "Prevención de caídas en adultos mayores", status: "Análisis", team: 3 },
  { title: "Satisfacción del paciente con IA clínica", status: "Finalizado", team: 2 }
];

export default function ResearchPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 13</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Investigación</h2>
        <p className="mt-2 text-slate-600">Biblioteca científica, organización de referencias, resúmenes y gestión de proyectos de investigación.</p>
      </div>
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar referencias por tema..." className="pl-9" />
      </div>
      <h3 className="mb-3 text-lg font-bold text-slate-900">Referencias recientes</h3>
      <div className="mb-6 space-y-3">
        {REFERENCES.map((r) => (
          <div key={r.title} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <FileText className="mt-1 h-5 w-5 shrink-0 text-[#002D62]" />
            <div className="flex-1">
              <h4 className="text-sm font-bold text-slate-900">{r.title}</h4>
              <p className="text-xs text-slate-500">{r.authors} — {r.journal}, {r.year}</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{r.tags.map((t) => <Badge key={t} variant="secondary" className="text-xs">{t}</Badge>)}</div>
            </div>
          </div>
        ))}
      </div>
      <h3 className="mb-3 text-lg font-bold text-slate-900">Proyectos de investigación</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PROJECTS.map((p) => (
          <div key={p.title} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <FolderKanban className="mb-2 h-5 w-5 text-[#00A8B5]" />
            <h4 className="text-sm font-bold text-slate-900">{p.title}</h4>
            <p className="mt-1 text-xs text-slate-500">{p.team} investigadores</p>
            <Badge className={`mt-2 ${p.status === "En curso" ? "bg-green-100 text-green-700" : p.status === "Análisis" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>{p.status}</Badge>
          </div>
        ))}
      </div>
    </section>
  );
}