import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const join = (items, keys) => (items || []).map(item => keys.map(k => Array.isArray(item[k]) ? item[k].join("; ") : item[k] || "").join(" | ")).join("\n");
const split = (text, keys) => text.split("\n").filter(Boolean).map(line => { const values = line.split("|").map(v => v.trim()); return Object.fromEntries(keys.map((key, i) => [key, key === "activities" ? (values[i] || "").split(";").map(v => v.trim()).filter(Boolean) : values[i] || ""])); });

export default function PlanEditor({ plan, onSaved, onCancel }) {
  const [form, setForm] = useState({ title: plan.title, assessment: plan.assessment || "", diagnoses: join(plan.diagnoses, ["nanda", "related_to", "evidence"]), outcomes: join(plan.outcomes, ["noc", "indicator", "target"]), interventions: join(plan.interventions, ["nic", "activities"]), evaluation: plan.evaluation || "" }); const [saving, setSaving] = useState(false);
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function save() { setSaving(true); await base44.entities.CarePlan.update(plan.id, { title: form.title, assessment: form.assessment, diagnoses: split(form.diagnoses, ["nanda", "related_to", "evidence"]), outcomes: split(form.outcomes, ["noc", "indicator", "target"]), interventions: split(form.interventions, ["nic", "activities"]), evaluation: form.evaluation }); setSaving(false); onSaved(); }
  return <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4"><Input value={form.title} onChange={e => set("title", e.target.value)} /><Textarea value={form.assessment} onChange={e => set("assessment", e.target.value)} placeholder="Valoración" /><Field label="NANDA | Relacionado con | Evidenciado por" value={form.diagnoses} onChange={v => set("diagnoses", v)} /><Field label="NOC | Indicador | Meta" value={form.outcomes} onChange={v => set("outcomes", v)} /><Field label="NIC | Actividades separadas por ;" value={form.interventions} onChange={v => set("interventions", v)} /><Textarea value={form.evaluation} onChange={e => set("evaluation", e.target.value)} placeholder="Evaluación" /><div className="flex gap-2"><Button size="sm" disabled={saving} onClick={save} className="bg-teal-700 hover:bg-teal-800">{saving ? "Guardando…" : "Guardar cambios"}</Button><Button size="sm" variant="ghost" onClick={onCancel}>Cancelar</Button></div></div>;
}
function Field({ label, value, onChange }) { return <label className="block text-xs font-medium text-slate-600">{label}<Textarea className="mt-1 font-mono text-xs" value={value} onChange={e => onChange(e.target.value)} /></label>; }