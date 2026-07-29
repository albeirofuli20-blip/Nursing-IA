import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function PatientForm({ onSaved }) {
  const [form, setForm] = useState({ code: "", full_name: "", birth_date: "", sex: "no_especificado", clinical_summary: "", allergies: "", current_medications: "" });
  const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function submit(e) { e.preventDefault(); setSaving(true); setError(""); try { await base44.entities.Patient.create(form); setForm({ code: "", full_name: "", birth_date: "", sex: "no_especificado", clinical_summary: "", allergies: "", current_medications: "" }); onSaved(); } catch { setError("No se pudo guardar el paciente."); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="space-y-3 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
    <div className="grid gap-3 sm:grid-cols-2"><Input required placeholder="Código clínico" value={form.code} onChange={e => set("code", e.target.value)} /><Input required placeholder="Nombre completo" value={form.full_name} onChange={e => set("full_name", e.target.value)} /><Input type="date" value={form.birth_date} onChange={e => set("birth_date", e.target.value)} /><select className="h-10 rounded-md border bg-white px-3 text-sm" value={form.sex} onChange={e => set("sex", e.target.value)}><option value="no_especificado">Sexo no especificado</option><option value="femenino">Femenino</option><option value="masculino">Masculino</option><option value="otro">Otro</option></select></div>
    <Textarea placeholder="Resumen clínico y valoración inicial" value={form.clinical_summary} onChange={e => set("clinical_summary", e.target.value)} /><div className="grid gap-3 sm:grid-cols-2"><Input placeholder="Alergias" value={form.allergies} onChange={e => set("allergies", e.target.value)} /><Input placeholder="Medicación actual" value={form.current_medications} onChange={e => set("current_medications", e.target.value)} /></div>
    {error && <p className="text-sm text-red-600">{error}</p>}<Button disabled={saving} className="bg-teal-700 hover:bg-teal-800">{saving ? "Guardando…" : "Registrar paciente"}</Button>
  </form>;
}