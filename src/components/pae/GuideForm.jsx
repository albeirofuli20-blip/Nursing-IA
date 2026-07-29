import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function GuideForm({ onSaved }) {
  const [form, setForm] = useState({ title: "", category: "", source: "", source_url: "", content: "", version_date: "", status: "revision" }); const [file, setFile] = useState(null); const [saving, setSaving] = useState(false); const [error, setError] = useState("");
  const set = (key, value) => setForm({ ...form, [key]: value });
  async function submit(e) { e.preventDefault(); setSaving(true); setError(""); try { let file_url = ""; if (file) ({ file_url } = await base44.integrations.Core.UploadFile({ file })); await base44.entities.Guide.create({ ...form, file_url }); onSaved(); } catch { setError("No se pudo guardar la guía."); } finally { setSaving(false); } }
  return <form onSubmit={submit} className="space-y-3 rounded-xl bg-slate-50 p-4"><div className="grid gap-3 sm:grid-cols-2"><Input required placeholder="Título de la guía" value={form.title} onChange={e => set("title", e.target.value)} /><Input placeholder="Categoría" value={form.category} onChange={e => set("category", e.target.value)} /><Input placeholder="Fuente" value={form.source} onChange={e => set("source", e.target.value)} /><Input type="url" placeholder="URL oficial" value={form.source_url} onChange={e => set("source_url", e.target.value)} /><Input type="date" value={form.version_date} onChange={e => set("version_date", e.target.value)} /><Input type="file" accept=".pdf,.doc,.docx,.txt" onChange={e => setFile(e.target.files?.[0])} /></div><Textarea required placeholder="Resumen o contenido clínico" value={form.content} onChange={e => set("content", e.target.value)} />{error && <p className="text-sm text-red-600">{error}</p>}<Button disabled={saving} className="bg-teal-700 hover:bg-teal-800">{saving ? "Cargando…" : "Guardar guía"}</Button></form>;
}