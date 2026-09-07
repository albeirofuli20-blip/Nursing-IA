import { useState, useRef } from "react";
import { Camera, Loader2, Plus, Sparkles, Save } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";

const EMPTY_FORM = {
  generic_name: "",
  trade_name: "",
  pharmacological_class: "",
  therapeutic_group: "",
  mechanism_of_action: "",
  main_indications: "",
  off_label_uses: "",
  contraindications: "",
  precautions: "",
  dose_adults: "",
  dose_pediatrics: "",
  dose_geriatrics: "",
  dose_pregnancy: "",
  dose_renal: "",
  dose_hepatic: "",
  administration_routes: "",
  dilution_reconstitution: "",
  iv_compatibility: "",
  iv_incompatibility: "",
  infusion_rate: "",
  stability_after_prep: "",
  storage: "",
  nursing_pre_assessment: "",
  nursing_during_admin: "",
  nursing_post_admin: "",
  monitoring_parameters: "",
  warning_signs: "",
  patient_education: "",
  nanda_related: "",
  nic_suggested: "",
  noc_expected: "",
  adverse_reactions: "",
  frequent_side_effects: "",
  drug_interactions: "",
  food_interactions: "",
  antidote: "",
  overdose_management: "",
  lasa_classification: "",
  high_risk_ismp: false,
  pregnancy_risk_level: "C",
  alert_level: "verde",
};

const AI_SCHEMA = {
  type: "object",
  properties: {
    trade_name: { type: "string" },
    pharmacological_class: { type: "string" },
    therapeutic_group: { type: "string" },
    mechanism_of_action: { type: "string" },
    main_indications: { type: "string" },
    off_label_uses: { type: "string" },
    contraindications: { type: "string" },
    precautions: { type: "string" },
    dose_adults: { type: "string" },
    dose_pediatrics: { type: "string" },
    dose_geriatrics: { type: "string" },
    dose_pregnancy: { type: "string" },
    dose_renal: { type: "string" },
    dose_hepatic: { type: "string" },
    administration_routes: { type: "string" },
    dilution_reconstitution: { type: "string" },
    iv_compatibility: { type: "string" },
    iv_incompatibility: { type: "string" },
    infusion_rate: { type: "string" },
    stability_after_prep: { type: "string" },
    storage: { type: "string" },
    nursing_pre_assessment: { type: "string" },
    nursing_during_admin: { type: "string" },
    nursing_post_admin: { type: "string" },
    monitoring_parameters: { type: "string" },
    warning_signs: { type: "string" },
    patient_education: { type: "string" },
    nanda_related: { type: "string" },
    nic_suggested: { type: "string" },
    noc_expected: { type: "string" },
    adverse_reactions: { type: "string" },
    frequent_side_effects: { type: "string" },
    drug_interactions: { type: "string" },
    food_interactions: { type: "string" },
    antidote: { type: "string" },
    overdose_management: { type: "string" },
    lasa_classification: { type: "string" },
    high_risk_ismp: { type: "boolean" },
    pregnancy_risk_level: { type: "string" },
    alert_level: { type: "string" },
  },
};

export default function AddMedicationDialog({ onSaved }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [photoLoading, setPhotoLoading] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  function reset() {
    setForm(EMPTY_FORM);
    setError("");
  }

  async function handlePhoto(file) {
    if (!file) return;
    setPhotoLoading(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const prompt = `Eres un farmacéutico experto. Analiza esta imagen de un medicamento (blíster, ampolla, caja o tableta) e identifica el principio activo. Responde en español en formato JSON con generic_name y trade_name.`;
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        file_urls: [file_url],
        response_json_schema: {
          type: "object",
          properties: {
            generic_name: { type: "string" },
            trade_name: { type: "string" },
            confidence: { type: "string" },
            notes: { type: "string" },
          },
        },
        model: "gemini_3_flash",
      });
      if (res?.generic_name) {
        setForm((f) => ({
          ...f,
          generic_name: res.generic_name,
          trade_name: res.trade_name || f.trade_name,
        }));
        await autofillWithAI(res.generic_name);
      }
    } catch {
      setError("No se pudo analizar la imagen.");
    } finally {
      setPhotoLoading(false);
    }
  }

  async function autofillWithAI(name) {
    const medName = name || form.generic_name;
    if (!medName.trim()) {
      setError("Ingresa el nombre genérico primero.");
      return;
    }
    setAiLoading(true);
    setError("");
    try {
      const prompt = `Eres un farmacéutico y enfermero experto. Completa la ficha clínica completa del medicamento "${medName}" para uso de enfermería. Incluye dosificación para adultos, pediatría, geriatría, embarazo, insuficiencia renal y hepática; administración, dilución, compatibilidad IV, cuidados de enfermería (valoración previa, durante y posterior), monitorización, signos de alarma, educación al paciente, taxonomía NANDA/NIC/NOC, reacciones adversas, interacciones, antídoto, clasificación LASA, riesgo en embarazo (A/B/C/D/X) y nivel de alerta (verde/amarillo/rojo). Responde en español.`;
      const res = await base44.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: AI_SCHEMA,
        model: "gemini_3_flash",
      });
      if (res) {
        setForm((f) => ({
          ...f,
          generic_name: medName,
          trade_name: res.trade_name || f.trade_name,
          pharmacological_class: res.pharmacological_class || f.pharmacological_class,
          therapeutic_group: res.therapeutic_group || f.therapeutic_group,
          mechanism_of_action: res.mechanism_of_action || f.mechanism_of_action,
          main_indications: res.main_indications || f.main_indications,
          off_label_uses: res.off_label_uses || f.off_label_uses,
          contraindications: res.contraindications || f.contraindications,
          precautions: res.precautions || f.precautions,
          dose_adults: res.dose_adults || f.dose_adults,
          dose_pediatrics: res.dose_pediatrics || f.dose_pediatrics,
          dose_geriatrics: res.dose_geriatrics || f.dose_geriatrics,
          dose_pregnancy: res.dose_pregnancy || f.dose_pregnancy,
          dose_renal: res.dose_renal || f.dose_renal,
          dose_hepatic: res.dose_hepatic || f.dose_hepatic,
          administration_routes: res.administration_routes || f.administration_routes,
          dilution_reconstitution: res.dilution_reconstitution || f.dilution_reconstitution,
          iv_compatibility: res.iv_compatibility || f.iv_compatibility,
          iv_incompatibility: res.iv_incompatibility || f.iv_incompatibility,
          infusion_rate: res.infusion_rate || f.infusion_rate,
          stability_after_prep: res.stability_after_prep || f.stability_after_prep,
          storage: res.storage || f.storage,
          nursing_pre_assessment: res.nursing_pre_assessment || f.nursing_pre_assessment,
          nursing_during_admin: res.nursing_during_admin || f.nursing_during_admin,
          nursing_post_admin: res.nursing_post_admin || f.nursing_post_admin,
          monitoring_parameters: res.monitoring_parameters || f.monitoring_parameters,
          warning_signs: res.warning_signs || f.warning_signs,
          patient_education: res.patient_education || f.patient_education,
          nanda_related: res.nanda_related || f.nanda_related,
          nic_suggested: res.nic_suggested || f.nic_suggested,
          noc_expected: res.noc_expected || f.noc_expected,
          adverse_reactions: res.adverse_reactions || f.adverse_reactions,
          frequent_side_effects: res.frequent_side_effects || f.frequent_side_effects,
          drug_interactions: res.drug_interactions || f.drug_interactions,
          food_interactions: res.food_interactions || f.food_interactions,
          antidote: res.antidote || f.antidote,
          overdose_management: res.overdose_management || f.overdose_management,
          lasa_classification: res.lasa_classification || f.lasa_classification,
          high_risk_ismp: res.high_risk_ismp ?? f.high_risk_ismp,
          pregnancy_risk_level: ["A", "B", "C", "D", "X"].includes(res.pregnancy_risk_level)
            ? res.pregnancy_risk_level
            : f.pregnancy_risk_level,
          alert_level: ["verde", "amarillo", "rojo"].includes(res.alert_level)
            ? res.alert_level
            : f.alert_level,
        }));
      }
    } catch {
      setError("No se pudo autocompletar con IA. Completa manualmente.");
    } finally {
      setAiLoading(false);
    }
  }

  async function submit(e) {
    e.preventDefault();
    if (!form.generic_name.trim()) {
      setError("El nombre genérico es obligatorio.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await base44.entities.Medication.create(form);
      reset();
      setOpen(false);
      onSaved?.();
    } catch {
      setError("No se pudo guardar el medicamento.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1.5 bg-[#002D62] hover:bg-[#002D62]/90">
          <Plus className="h-4 w-4" /> Agregar medicamento
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-[#002D62]">
            <Plus className="h-5 w-5" /> Nuevo medicamento
          </DialogTitle>
          <DialogDescription>
            Agrega un medicamento por foto (IA lo identifica y autocompleta) o manualmente.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(e) => handlePhoto(e.target.files?.[0])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileRef.current?.click()}
            disabled={photoLoading || aiLoading}
            className="gap-1.5 border-[#00A8B5] text-[#00A8B5] hover:bg-[#00A8B5]/10"
          >
            {photoLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Analizando foto…
              </>
            ) : (
              <>
                <Camera className="h-4 w-4" /> Identificar por foto
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => autofillWithAI()}
            disabled={aiLoading || photoLoading || !form.generic_name.trim()}
            className="gap-1.5 border-[#002D62] text-[#002D62] hover:bg-[#002D62]/10"
          >
            {aiLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Autocompletando…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Autocompletar con IA
              </>
            )}
          </Button>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1">Nombre genérico *</Label>
              <Input
                required
                placeholder="Ej: Paracetamol"
                value={form.generic_name}
                onChange={(e) => set("generic_name", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Nombre comercial</Label>
              <Input
                placeholder="Ej: Tylenol"
                value={form.trade_name}
                onChange={(e) => set("trade_name", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Clase farmacológica</Label>
              <Input
                value={form.pharmacological_class}
                onChange={(e) => set("pharmacological_class", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Grupo terapéutico</Label>
              <Input
                value={form.therapeutic_group}
                onChange={(e) => set("therapeutic_group", e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label className="mb-1">Mecanismo de acción</Label>
            <Textarea
              rows={2}
              value={form.mechanism_of_action}
              onChange={(e) => set("mechanism_of_action", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Indicaciones principales</Label>
            <Textarea
              rows={2}
              value={form.main_indications}
              onChange={(e) => set("main_indications", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Contraindicaciones</Label>
            <Textarea
              rows={2}
              value={form.contraindications}
              onChange={(e) => set("contraindications", e.target.value)}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="mb-1">Dosis adultos</Label>
              <Input
                value={form.dose_adults}
                onChange={(e) => set("dose_adults", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Dosis pediatría</Label>
              <Input
                value={form.dose_pediatrics}
                onChange={(e) => set("dose_pediatrics", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Vías de administración</Label>
              <Input
                value={form.administration_routes}
                onChange={(e) => set("administration_routes", e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1">Nivel de alerta</Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={form.alert_level}
                onChange={(e) => set("alert_level", e.target.value)}
              >
                <option value="verde">Verde (Seguro)</option>
                <option value="amarillo">Amarillo (Precaución)</option>
                <option value="rojo">Rojo (Alerta)</option>
              </select>
            </div>
            <div>
              <Label className="mb-1">Riesgo embarazo</Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={form.pregnancy_risk_level}
                onChange={(e) => set("pregnancy_risk_level", e.target.value)}
              >
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
                <option value="X">X</option>
              </select>
            </div>
            <div>
              <Label className="mb-1">Alto riesgo ISMP</Label>
              <select
                className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
                value={form.high_risk_ismp ? "si" : "no"}
                onChange={(e) => set("high_risk_ismp", e.target.value === "si")}
              >
                <option value="no">No</option>
                <option value="si">Sí</option>
              </select>
            </div>
          </div>

          <div>
            <Label className="mb-1">Cuidados de enfermería (valoración previa)</Label>
            <Textarea
              rows={2}
              value={form.nursing_pre_assessment}
              onChange={(e) => set("nursing_pre_assessment", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Durante administración</Label>
            <Textarea
              rows={2}
              value={form.nursing_during_admin}
              onChange={(e) => set("nursing_during_admin", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Monitorización y signos de alarma</Label>
            <Textarea
              rows={2}
              value={form.monitoring_parameters}
              onChange={(e) => set("monitoring_parameters", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Reacciones adversas</Label>
            <Textarea
              rows={2}
              value={form.adverse_reactions}
              onChange={(e) => set("adverse_reactions", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Interacciones medicamentosas</Label>
            <Textarea
              rows={2}
              value={form.drug_interactions}
              onChange={(e) => set("drug_interactions", e.target.value)}
            />
          </div>
          <div>
            <Label className="mb-1">Antídoto</Label>
            <Input
              value={form.antidote}
              onChange={(e) => set("antidote", e.target.value)}
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={saving} className="gap-1.5 bg-[#002D62] hover:bg-[#002D62]/90">
              {saving ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Guardando…
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" /> Guardar medicamento
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}