import { useState } from "react";
import { Search } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function WebGuideSearch({ onSaved }) {
  const [topic, setTopic] = useState(""); const [loading, setLoading] = useState(false); const [error, setError] = useState("");
  async function search() { setLoading(true); setError(""); try { const result = await base44.integrations.Core.InvokeLLM({ model: "gemini_3_flash", add_context_from_internet: true, prompt: `Busca una guía o protocolo de enfermería vigente y confiable sobre: ${topic}. Prioriza organismos oficiales, sociedades científicas y universidades. Resume recomendaciones clínicas sin inventar datos e incluye la URL exacta de la fuente.`, response_json_schema: { type: "object", properties: { title: { type: "string" }, category: { type: "string" }, source: { type: "string" }, source_url: { type: "string" }, content: { type: "string" }, version_date: { type: "string" } }, required: ["title", "source", "source_url", "content"] } }); await base44.entities.Guide.create({ ...result, status: "revision" }); setTopic(""); onSaved(); } catch { setError("No fue posible consultar la web."); } finally { setLoading(false); } }
  return <div className="rounded-xl border border-sky-100 bg-sky-50 p-4"><p className="mb-2 text-sm font-semibold text-sky-900">Actualizar desde fuentes web</p><div className="flex gap-2"><Input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Ej. prevención de úlceras por presión" /><Button disabled={!topic || loading} onClick={search} className="bg-sky-700 hover:bg-sky-800"><Search className="mr-2 h-4 w-4" />{loading ? "Buscando…" : "Consultar"}</Button></div>{error && <p className="mt-2 text-sm text-red-600">{error}</p>}<p className="mt-2 text-xs text-sky-700">Los resultados se guardan en revisión y requieren validación profesional.</p></div>;
}