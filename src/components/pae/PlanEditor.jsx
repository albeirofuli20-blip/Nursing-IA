import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const join = (items, keys) => (items || []).map(item => keys.map(k => Array.isArray(item[k]) ? item[k].join("; ") : item[k] || "").join(" | ")).join("\n");
const split = (text, keys) => text.split("\n").filter(Boolean).map(line => { const values = line.split("|").map(v => v.trim()); return Object.fromEntries(keys.map((key, i) => [key, key === "activities" || key === "indicators" ? (values[i] || "").split(";").map(v => v.trim()).filter(Boolean) : values[i] || ""])); });

export default function PlanEditor({ plan, onSaved, onCancel }) {
  const [form, setForm] = useState({ title: plan.title, pae_number: plan.pae_number || "", version: plan.version || "01", code: plan.code || "", pae_date: plan.pae_date || "", service: plan.service || "", bed_number: plan.bed_number || "", medical_record: plan.medical_record || "", admission_number: plan.admission_number || "", medical_diagnosis: plan.medical_diagnosis || "", assessment: plan.assessment || "", diagnoses: join(plan.diagnoses, ["nanda", "code", "definition", "related_to", "evidence", "domain", "class"]), outcomes: join(plan.outcomes, ["noc", "code", "indicators", "scale_initial", "scale_expected"]), interventions: join(plan.interventions, ["nic", "code", "activities", "rationale"]), execution: plan.execution || "", evaluation: plan.evaluation || "", diana_score: plan.diana_score || "" }); const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function save() { setSaving(true); await base44.entities.CarePlan.update(plan.id, { title: form.title, pae_number: form.pae_number, version: form.version, code: form.code, pae_date: form.pae_date, service: form.service, bed_number: form.bed_number, medical_record: form.medical_record, admission_number: form.admission_number, medical_diagnosis: form.medical_diagnosis, assessment: form.assessment, diagnoses: split(form.diagnoses, ["nanda", "code", "definition", "related_to", "evidence", "domain", "class"]), outcomes: split(form.outcomes, ["noc", "code", "indicators", "scale_initial", "scale_expected"]), interventions: split(form.interventions, ["nic", "code", "activities", "rationale"]), execution: form.execution, evaluation: form.evaluation, diana_score: form.diana_score }); setSaving(false); onSaved(); }
  return <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4">
    <div className="grid gap-3 sm:grid-cols-3"><Input value={form.title} onChange={e => set("title", e.target.value)} placeholder="Título" /><Input value={form.pae_number} onChange={e => set("pae_number", e.target.value)} placeholder="PAE N.º" /><Input value={form.version} onChange={e => set("version", e.target.value)} placeholder="Versión" /><Input value={form.code} onChange={e => set("code", e.target.value)} placeholder="Código" /><Input type="date" value={form.pae_date} onChange={e => set("pae_date", e.target.value)} /><Input value={form.service} onChange={e => set("service", e.target.value)} placeholder="Servicio" /><Input value={form.bed_number} onChange={e => set("bed_number", e.target.value)} placeholder="N.° Cama" /><Input value={form.medical_record} onChange={e => set("medical_record", e.target.value)} placeholder="Historia clínica" /><Input value={form.admission_number} onChange={e => set("admission_number", e.target.value)} placeholder="N.° Ingreso" /></div>
    <Textarea value={form.medical_diagnosis} onChange={e => set("medical_diagnosis", e.target.value)} placeholder="Diagnóstico médico" />
    <Textarea value={form.assessment} onChange={e => set("assessment", e.target.value)} placeholder="Valoración" />
    <Field label="NANDA | Código | Definición | R/C | M/P | Dominio | Clase" value={form.diagnoses} onChange={v => set("diagnoses", v)} />
    <Field label="NOC | Código | Indicadores (;) | Inicial | Esperada" value={form.outcomes} onChange={v => set("outcomes", v)} />
    <Field label="NIC | Código | Actividades (;) | Fundamentación" value={form.interventions} onChange={v => set("interventions", v)} />
    <Textarea value={form.execution} onChange={e => set("execution", e.target.value)} placeholder="Ejecución" />
    <Textarea value={form.evaluation} onChange={e => set("evaluation", e.target.value)} placeholder="Evaluación" />
    <Input value={form.diana_score} onChange={e => set("diana_score", e.target.value)} placeholder="Puntuación Diana" />
    <div className="flex gap-2"><Button size="sm" disabled={saving} onClick={save} className="bg-teal-700 hover:bg-teal-800">{saving ? "Guardando…" : "Guardar cambios"}</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button></div>
  </div>;
}
function Field({ label, value, onChange }) { return <label className="block text-xs font-medium text-slate-600">{label}<Textarea className="mt-1 font-mono text-xs" value={value} onChange={e => onChange(e.target.value)} /></label>; }