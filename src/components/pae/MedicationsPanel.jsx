import { useState, useEffect } from "react";
import { Pill, Search, Star, Download, CheckCircle, AlertTriangle, ChevronDown, ChevronUp, ShieldAlert } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/hooks/useFavorites";
import ClinicalAiAssistant from "@/components/clinical/ClinicalAiAssistant";
import DoseCalculator from "@/components/clinical/DoseCalculator";
import InteractionChecker from "@/components/clinical/InteractionChecker";
import PhotoRecognition from "@/components/clinical/PhotoRecognition";
import DetailSection from "@/components/clinical/DetailSection";
import { exportMedicationToPdf } from "@/lib/exportClinical";

const ALERT_STYLES = {
  verde: { bg: "bg-green-100 text-green-700", icon: CheckCircle, label: "Seguro" },
  amarillo: { bg: "bg-amber-100 text-amber-700", icon: AlertTriangle, label: "Precaución" },
  rojo: { bg: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Alerta" }
};

const AI_QUESTIONS = [
  "¿Cómo administro este medicamento?",
  "¿Puedo mezclarlo con solución salina?",
  "¿Cuál es la velocidad de infusión correcta?",
  "¿Qué debo vigilar como enfermero?",
  "¿Qué educación debo brindar al paciente?"
];

export default function MedicationsPanel() {
  const [meds, setMeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [showFavOnly, setShowFavOnly] = useState(false);
  const { isFavorite, toggle, favorites } = useFavorites("medications");

  useEffect(() => {
    (async () => {
      try {
        const data = await base44.entities.Medication.list("-updated_date", 100);
        setMeds(data);
      } catch { /* noop */ } finally { setLoading(false); }
    })();
  }, []);

  function handlePhotoIdentified(name) {
    setSearch(name);
  }

  const filtered = meds.filter((m) => {
    const matchesSearch = !search ||
      m.generic_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.trade_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.pharmacological_class?.toLowerCase().includes(search.toLowerCase());
    const matchesFav = !showFavOnly || isFavorite(m.id);
    return matchesSearch && matchesFav;
  });

  if (loading) return <div className="grid place-items-center py-20"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 6</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Medicamentos</h2>
        <p className="mt-2 text-slate-600">Asistente clínico completo: indicaciones, dosificación, administración, cuidados de enfermería, seguridad e IA.</p>
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input placeholder="Buscar por nombre genérico, comercial o clase…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <PhotoRecognition onIdentified={handlePhotoIdentified} />
        <Button variant={showFavOnly ? "default" : "outline"} size="sm" onClick={() => setShowFavOnly(!showFavOnly)} className="gap-1.5">
          <Star className={`h-4 w-4 ${showFavOnly ? "fill-current" : ""}`} /> Favoritos ({favorites.length})
        </Button>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((m) => {
          const A = ALERT_STYLES[m.alert_level] || ALERT_STYLES.verde;
          const AIcon = A.icon;
          const isExpanded = expanded === m.id;
          return (
            <div key={m.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <button onClick={() => toggle(m.id)} className="text-slate-300 hover:text-amber-400">
                    <Star className={`h-5 w-5 ${isFavorite(m.id) ? "fill-amber-400 text-amber-400" : ""}`} />
                  </button>
                  <Pill className="h-5 w-5 text-[#002D62]" />
                  <div>
                    <h3 className="font-bold text-slate-900">{m.generic_name}</h3>
                    {m.trade_name && <p className="text-xs text-slate-400">{m.trade_name}</p>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {m.high_risk_ismp && <Badge className="bg-red-100 text-red-700 gap-1"><ShieldAlert className="h-3 w-3" /> Alto riesgo</Badge>}
                  <Badge className={A.bg}><AIcon className="h-3 w-3 mr-1" />{A.label}</Badge>
                </div>
              </div>
              <p className="mb-3 text-xs font-medium text-slate-400">{m.pharmacological_class} {m.therapeutic_group && `· ${m.therapeutic_group}`}</p>

              <div className="mb-3 space-y-1.5 text-sm">
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Dosis adultos:</dt><dd className="text-slate-700">{m.dose_adults || "—"}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Vías:</dt><dd className="text-slate-700">{m.administration_routes || "—"}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Contraind.:</dt><dd className="text-slate-700">{m.contraindications || "—"}</dd></div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(isExpanded ? null : m.id)} className="gap-1">
                  {isExpanded ? <><ChevronUp className="h-4 w-4" /> Ver menos</> : <><ChevronDown className="h-4 w-4" /> Ver ficha completa</>}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => exportMedicationToPdf(m)} className="gap-1 text-slate-500"><Download className="h-4 w-4" /> PDF</Button>
                <ClinicalAiAssistant contextLabel={`Medicamento: ${m.generic_name}`} contextData={m} placeholder={AI_QUESTIONS} />
              </div>

              {isExpanded && (
                <div className="mt-4 space-y-4 border-t border-slate-100 pt-4">
                  <DetailSection title="Mecanismo de acción">{m.mechanism_of_action}</DetailSection>
                  <DetailSection title="Indicaciones">{m.main_indications}</DetailSection>
                  {m.off_label_uses && <DetailSection title="Usos off-label"><span className="text-amber-600">⚠ Off-label: </span>{m.off_label_uses}</DetailSection>}
                  <DetailSection title="Precauciones">{m.precautions}</DetailSection>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">Dosificación especial</p>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      {m.dose_pediatrics && <p><strong className="text-slate-500">Pediatría:</strong> {m.dose_pediatrics}</p>}
                      {m.dose_geriatrics && <p><strong className="text-slate-500">Geriatría:</strong> {m.dose_geriatrics}</p>}
                      {m.dose_pregnancy && <p><strong className="text-slate-500">Embarazo:</strong> {m.dose_pregnancy}</p>}
                      {m.dose_renal && <p><strong className="text-slate-500">Insuf. renal:</strong> {m.dose_renal}</p>}
                      {m.dose_hepatic && <p><strong className="text-slate-500">Insuf. hepática:</strong> {m.dose_hepatic}</p>}
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">Administración</p>
                    <div className="grid gap-2 text-sm sm:grid-cols-2">
                      {m.dilution_reconstitution && <p><strong className="text-slate-500">Dilución:</strong> {m.dilution_reconstitution}</p>}
                      {m.iv_compatibility && <p><strong className="text-slate-500">Compat. IV:</strong> {m.iv_compatibility}</p>}
                      {m.iv_incompatibility && <p><strong className="text-slate-500">Incompat. IV:</strong> {m.iv_incompatibility}</p>}
                      {m.infusion_rate && <p><strong className="text-slate-500">Vel. infusión:</strong> {m.infusion_rate}</p>}
                      {m.stability_after_prep && <p><strong className="text-slate-500">Estabilidad:</strong> {m.stability_after_prep}</p>}
                      {m.storage && <p><strong className="text-slate-500">Conservación:</strong> {m.storage}</p>}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#002D62]/5 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#002D62]">Enfermería</p>
                    <div className="space-y-1.5 text-sm">
                      {m.nursing_pre_assessment && <p><strong className="text-slate-500">Valoración previa:</strong> {m.nursing_pre_assessment}</p>}
                      {m.nursing_during_admin && <p><strong className="text-slate-500">Durante admin.:</strong> {m.nursing_during_admin}</p>}
                      {m.nursing_post_admin && <p><strong className="text-slate-500">Posterior:</strong> {m.nursing_post_admin}</p>}
                      {m.monitoring_parameters && <p><strong className="text-slate-500">Monitorizar:</strong> {m.monitoring_parameters}</p>}
                      {m.warning_signs && <p className="text-red-600"><strong>Signos de alarma:</strong> {m.warning_signs}</p>}
                      {m.patient_education && <p><strong className="text-slate-500">Educación:</strong> {m.patient_education}</p>}
                    </div>
                  </div>

                  <div className="rounded-lg bg-[#00A8B5]/5 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-[#00A8B5]">Taxonomía NANDA/NIC/NOC</p>
                    <div className="space-y-1 text-sm">
                      {m.nanda_related && <p><strong className="text-slate-500">NANDA:</strong> {m.nanda_related}</p>}
                      {m.nic_suggested && <p><strong className="text-slate-500">NIC:</strong> {m.nic_suggested}</p>}
                      {m.noc_expected && <p><strong className="text-slate-500">NOC:</strong> {m.noc_expected}</p>}
                    </div>
                  </div>

                  <div className="rounded-lg border border-red-100 bg-red-50/50 p-3">
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-red-600">Seguridad</p>
                    <div className="space-y-1 text-sm">
                      {m.adverse_reactions && <p><strong className="text-slate-500">Reacciones adversas:</strong> {m.adverse_reactions}</p>}
                      {m.frequent_side_effects && <p><strong className="text-slate-500">Efectos frecuentes:</strong> {m.frequent_side_effects}</p>}
                      {m.drug_interactions && <p><strong className="text-slate-500">Interacciones:</strong> {m.drug_interactions}</p>}
                      {m.food_interactions && <p><strong className="text-slate-500">Interacciones alimentos:</strong> {m.food_interactions}</p>}
                      {m.antidote && <p><strong className="text-slate-500">Antídoto:</strong> {m.antidote}</p>}
                      {m.overdose_management && <p><strong className="text-slate-500">Sobredosis:</strong> {m.overdose_management}</p>}
                      {m.lasa_classification && <p><strong className="text-slate-500">LASA:</strong> {m.lasa_classification}</p>}
                      {m.pregnancy_risk_level && <p><strong className="text-slate-500">Riesgo embarazo:</strong> Categoría {m.pregnancy_risk_level}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <DoseCalculator med={m} />
                    <InteractionChecker med={m} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {filtered.length === 0 && <p className="py-10 text-center text-slate-400">No se encontraron medicamentos.</p>}
    </section>
  );
}