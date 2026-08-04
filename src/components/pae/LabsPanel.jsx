import { useState, useEffect } from "react";
import { FlaskConical, Search, Star, Download, TrendingUp, AlertTriangle, ChevronDown, ChevronUp } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import ClinicalAiAssistant from "@/components/clinical/ClinicalAiAssistant";
import DetailSection from "@/components/clinical/DetailSection";
import { exportLabToPdf } from "@/lib/exportClinical";

const STATUS = { normal: "bg-green-100 text-green-700", bajo: "bg-blue-100 text-blue-700", alto: "bg-red-100 text-red-700" };

const AI_QUESTIONS = [
  "¿Qué significa un valor alterado de este examen?",
  "¿Qué diagnóstico NANDA se relaciona con este resultado?",
  "¿Qué cuidados de enfermería debo implementar?",
  "¿Qué seguimiento es necesario tras este resultado?",
  "¿Qué medicamentos pueden afectar este examen?"
];

export default function LabsPanel() {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const { isFavorite, toggle, favorites } = useFavorites("labs");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.LabTest.list("-updated_date", 100);
        setLabs(data);
      } catch { /* noop */ } finally { setLoading(false); }
    })();
  }, []);

  const filtered = labs.filter((l) => {
    const matchesSearch = !search ||
      l.test_name?.toLowerCase().includes(search.toLowerCase()) ||
      l.category?.toLowerCase().includes(search.toLowerCase());
    const matchesFav = !showFavOnly || isFavorite(l.id);
    return matchesSearch && matchesFav;
  });

  if (loading) return <div className="grid place-items-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 8</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Laboratorios</h2>
        <p className="mt-2 text-slate-600">Interpretación clínica con rangos de referencia, valores críticos, NANDA/NIC/NOC y asistente IA.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar examen o categoría…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Button variant={showFavOnly ? "default" : "outline"} size="sm" onClick={() => setShowFavOnly(!showFavOnly)} className="gap-1.5">
          <Star className={`h-4 w-4 ${showFavOnly ? "fill-current" : ""}`} /> Favoritos ({favorites.length})
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((lab) => {
          const isExpanded = expanded === lab.id;
          return (
            <div key={lab.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(lab.id)} className="text-slate-300 hover:text-amber-400">
                    <Star className={`h-5 w-5 ${isFavorite(lab.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                  <FlaskConical className="h-5 w-5 text-[#002D62]" />
                  <div>
                    <h3 className="font-bold text-slate-900">{lab.test_name}</h3>
                    <p className="text-xs text-slate-400">{lab.category} {lab.unit && `· ${lab.unit}`}</p>
                  </div>
                </div>
                <Badge className={lab.alert_level === "rojo" ? "bg-red-100 text-red-700" : lab.alert_level === "amarillo" ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"}>
                  {lab.alert_level === "rojo" ? "Crítico" : lab.alert_level === "amarillo" ? "Precaución" : "Normal"}
                </Badge>
              </div>

              <div className="mb-3 rounded-lg bg-slate-50 p-3">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">Rangos de referencia</p>
                <div className="grid gap-1 text-sm sm:grid-cols-2">
                  <p><strong className="text-slate-500">Adulto M:</strong> {lab.reference_range_adult_male || "—"}</p>
                  <p><strong className="text-slate-500">Adulto F:</strong> {lab.reference_range_adult_female || "—"}</p>
                  {lab.reference_range_pediatric && <p><strong className="text-slate-500">Pediatría:</strong> {lab.reference_range_pediatric}</p>}
                  {lab.reference_range_elderly && <p><strong className="text-slate-500">Geriatría:</strong> {lab.reference_range_elderly}</p>}
                </div>
              </div>

              {lab.critical_values && (
                <div className="mb-3 flex items-start gap-2 rounded-lg bg-red-50 p-3">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
                  <p className="text-xs text-red-700"><strong>Valores críticos:</strong> {lab.critical_values}</p>
                </div>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : lab.id)} className="gap-1">
                  {isExpanded ? <><ChevronUp className="h-4 w-4" /> Ver menos</> : <><ChevronDown className="h-4 w-4" /> Ver ficha completa</>}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => exportLabToPdf(lab)} className="gap-1 text-slate-500"><Download className="h-4 w-4" /> PDF</Button>
                <ClinicalAiAssistant contextLabel={`Laboratorio: ${lab.test_name}`} contextData={lab} placeholder={AI_QUESTIONS} />
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                  <DetailSection title="Tipo de muestra">{lab.sample_type}</DetailSection>
                  <DetailSection title="Instrucciones de recolección">{lab.collection_instructions}</DetailSection>
                  {lab.patient_preparation && <DetailSection title="Preparación del paciente">{lab.patient_preparation}</DetailSection>}

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg bg-blue-50 p-3"><p className="mb-1 text-xs font-bold text-blue-700">Valor bajo</p><p className="text-xs text-slate-700">{lab.interpretation_low}</p></div>
                    <div className="rounded-lg bg-green-50 p-3"><p className="mb-1 text-xs font-bold text-green-700">Valor normal</p><p className="text-xs text-slate-700">{lab.interpretation_normal}</p></div>
                    <div className="rounded-lg bg-red-50 p-3"><p className="mb-1 text-xs font-bold text-red-700">Valor alto</p><p className="text-xs text-slate-700">{lab.interpretation_high}</p></div>
                  </div>

                  <div className="rounded-lg bg-[#00A8B5]/5 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">Taxonomía NANDA/NIC/NOC</p>
                    <div className="space-y-1 text-sm">
                      {lab.nanda_related && <p><strong className="text-slate-500">NANDA:</strong> {lab.nanda_related}</p>}
                      {lab.nic_suggested && <p><strong className="text-slate-500">NIC:</strong> {lab.nic_suggested}</p>}
                      {lab.noc_expected && <p><strong className="text-slate-500">NOC:</strong> {lab.noc_expected}</p>}
                    </div>
                  </div>

                  <DetailSection title="Implicaciones de enfermería">{lab.nursing_implications}</DetailSection>
                  <DetailSection title="Acciones de seguimiento">{lab.follow_up_actions}</DetailSection>
                  {lab.related_medications && <DetailSection title="Medicamentos relacionados">{lab.related_medications}</DetailSection>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="py-10 text-center text-slate-400">No se encontraron exámenes.</p>}

      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-700">La interpretación es una propuesta asistida por IA basada en rangos de referencia. La decisión clínica final corresponde al profesional.</p>
      </div>
    </section>
  );
}