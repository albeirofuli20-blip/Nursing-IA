import { useState, useEffect } from "react";
import { Stethoscope, Search, Star, Download, ListChecks, Play, AlertTriangle, ChevronDown, ChevronUp, ShieldCheck } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import ClinicalAiAssistant from "@/components/clinical/ClinicalAiAssistant";
import DetailSection from "@/components/clinical/DetailSection";
import { exportProcedureToPdf } from "@/lib/exportClinical";

const DIFFICULTY = { basico: "bg-green-100 text-green-700", intermedio: "bg-amber-100 text-amber-700", avanzado: "bg-red-100 text-red-700" };

const AI_QUESTIONS = [
  "¿Cuáles son los pasos correctos de este procedimiento?",
  "¿Qué complicaciones debo vigilar?",
  "¿Qué material necesito preparar?",
  "¿Qué educación debo dar al paciente?",
  "¿Cómo prevengo las complicaciones?"
];

export default function ProceduresPanel() {
  const [procs, setProcs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const [checkedSteps, setCheckedSteps] = useState({});
  const { isFavorite, toggle, favorites } = useFavorites("procedures");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Procedure.list("-updated_date", 100);
        setProcs(data);
      } catch { /* noop */ } finally { setLoading(false); }
    })();
  }, []);

  function toggleStep(procId, stepIdx) {
    setCheckedSteps((prev) => {
      const key = `${procId}_${stepIdx}`;
      return { ...prev, [key]: !prev[key] };
    });
  }

  const filtered = procs.filter((p) => {
    const matchesSearch = !search ||
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchesFav = !showFavOnly || isFavorite(p.id);
    return matchesSearch && matchesFav;
  });

  if (loading) return <div className="grid place-items-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 9</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Procedimientos</h2>
        <p className="mt-2 text-slate-600">Guías paso a paso con checklist interactivo, complicaciones, cuidados posteriores y asistente IA.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar procedimiento o categoría…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant={showFavOnly ? "default" : "outline"} size="sm" onClick={() => setShowFavOnly(!showFavOnly)} className="gap-1.5">
          <Star className={`h-4 w-4 ${showFavOnly ? "fill-current" : ""}`} /> Favoritos ({favorites.length})
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((p) => {
          const isExpanded = expanded === p.id;
          const stepChecklist = p.steps || [];
          const checkedCount = stepChecklist.filter((_, i) => checkedSteps[`${p.id}_${i}`]).length;
          return (
            <div key={p.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(p.id)} className="text-slate-300 hover:text-amber-400">
                    <Star className={`h-5 w-5 ${isFavorite(p.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                  <Stethoscope className="h-5 w-5 text-[#002D62]" />
                  <div>
                    <h3 className="font-bold text-slate-900">{p.name}</h3>
                    <p className="text-xs text-slate-400">{p.category} {p.estimated_duration && `· ${p.estimated_duration}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {p.difficulty_level && <Badge className={DIFFICULTY[p.difficulty_level]}>{p.difficulty_level}</Badge>}
                </div>
              </div>

              <p className="mb-3 text-sm text-slate-600">{p.objective}</p>

              <div className="mb-3">
                <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700">
                  <ListChecks className="h-4 w-4 text-[#00A8B5]" /> Pasos
                  {isExpanded && checkedCount > 0 && <span className="text-xs text-green-600">({checkedCount}/{stepChecklist.length} ✓)</span>}
                </p>
                <ol className="space-y-1.5">
                  {stepChecklist.slice(0, isExpanded ? undefined : 3).map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      {isExpanded ? (
                        <button onClick={() => toggleStep(p.id, i)} className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${checkedSteps[`${p.id}_${i}`] ? "border-green-500 bg-green-500 text-white" : "border-slate-300 bg-white"}`}>
                          {checkedSteps[`${p.id}_${i}`] && <ShieldCheck className="h-3 w-3" />}
                        </button>
                      ) : (
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#002D62] text-xs font-bold text-white">{i + 1}</span>
                      )}
                      <span className={`text-slate-600 ${checkedSteps[`${p.id}_${i}`] ? "line-through text-slate-400" : ""}`}>{s}</span>
                    </li>
                  ))}
                </ol>
                {!isExpanded && stepChecklist.length > 3 && <p className="mt-1 text-xs text-slate-400">+ {stepChecklist.length - 3} pasos más…</p>}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : p.id)} className="gap-1">
                  {isExpanded ? <><ChevronUp className="h-4 w-4" /> Ver menos</> : <><ChevronDown className="h-4 w-4" /> Ver ficha completa</>}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => exportProcedureToPdf(p)} className="gap-1 text-slate-500"><Download className="h-4 w-4" /> PDF</Button>
                <ClinicalAiAssistant contextLabel={`Procedimiento: ${p.name}`} contextData={p} placeholder={AI_QUESTIONS} />
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                  <DetailSection title="Indicaciones">{p.indications}</DetailSection>
                  <DetailSection title="Contraindicaciones">{p.contraindications}</DetailSection>
                  {p.precautions && <DetailSection title="Precauciones">{p.precautions}</DetailSection>}
                  <DetailSection title="Material requerido">{p.required_materials}</DetailSection>
                  {p.patient_preparation && <DetailSection title="Preparación del paciente">{p.patient_preparation}</DetailSection>}

                  <div className="rounded-lg border border-amber-100 bg-amber-50/50 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-600"><AlertTriangle className="h-3 w-3" /> Complicaciones</p>
                    <p className="text-sm text-slate-700">{p.complications}</p>
                    {p.complication_prevention && <p className="mt-1 text-sm text-slate-600"><strong className="text-slate-500">Prevención:</strong> {p.complication_prevention}</p>}
                  </div>

                  <div className="rounded-lg bg-[#00A8B5]/5 p-3">
                    <p className="mb-1 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#00A8B5]"><Play className="h-3 w-3" /> Cuidados posteriores</p>
                    <p className="text-sm text-slate-700">{p.aftercare}</p>
                    {p.monitoring_parameters && <p className="mt-1 text-sm text-slate-600"><strong className="text-slate-500">Monitorizar:</strong> {p.monitoring_parameters}</p>}
                  </div>

                  <div className="rounded-lg bg-[#002D62]/5 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#002D62]">Taxonomía NANDA/NIC/NOC</p>
                    <div className="space-y-1 text-sm">
                      {p.nanda_related && <p><strong className="text-slate-500">NANDA:</strong> {p.nanda_related}</p>}
                      {p.nic_suggested && <p><strong className="text-slate-500">NIC:</strong> {p.nic_suggested}</p>}
                      {p.noc_expected && <p><strong className="text-slate-500">NOC:</strong> {p.noc_expected}</p>}
                    </div>
                  </div>

                  {p.patient_education && <DetailSection title="Educación al paciente">{p.patient_education}</DetailSection>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="py-10 text-center text-slate-400">No se encontraron procedimientos.</p>}
    </section>
  );
}