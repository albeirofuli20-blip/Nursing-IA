import { useState } from "react";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import usePlanGenerator from "@/hooks/usePlanGenerator";

export default function PlanGenerator({ patients, guides, onSaved }) {
  const [patientId, setPatientId] = useState(""); const [notes, setNotes] = useState(""); const [file, setFile] = useState(null); const { generate, loading, error } = usePlanGenerator(onSaved); const patient = patients.find(p => p.id === patientId);
  async function submit(e) { e.preventDefault(); if (await generate(patient, notes, file, guides)) { setNotes(""); setFile(null); } }
  return <form onSubmit={submit} className="space-y-3 rounded-2xl border border-violet-100 bg-violet-50/60 p-4"><div className="flex items-center gap-2 text-violet-900"><Sparkles className="h-5 w-5" /><h3 className="font-semibold">Generar PAE con IA</h3></div><select required className="h-10 w-full rounded-md border bg-white px-3 text-sm" value={patientId} onChange={e => setPatientId(e.target.value)}><option value="">Selecciona un paciente</option>{patients.map(p => <option key={p.id} value={p.id}>{p.full_name} · {p.code}</option>)}</select><Textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Añade signos, necesidades, escalas o hallazgos relevantes…" /><InputFile onChange={setFile} />{error && <p className="text-sm text-red-600">{error}</p>}<Button disabled={!patient || loading} className="bg-violet-700 hover:bg-violet-800">{loading ? "Analizando…" : "Crear borrador asistido"}</Button><p className="text-xs text-violet-700">La propuesta no sustituye el juicio clínico ni la validación profesional.</p></form>;
}
function InputFile({ onChange }) { return <label className="block text-xs text-slate-600">Adjuntar valoración clínica (opcional)<input className="mt-1 block w-full text-sm" type="file" accept=".pdf,.txt,.doc,.docx,.png,.jpg,.jpeg" onChange={e => onChange(e.target.files?.[0])} /></label>; }