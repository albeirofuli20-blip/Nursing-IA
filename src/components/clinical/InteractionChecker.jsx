import { useState } from "react";
import { ShieldAlert, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function InteractionChecker({ med }) {
  const [open, setOpen] = useState(false);
  const [otherMeds, setOtherMeds] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function check() {
    if (!otherMeds.trim()) return;
    setLoading(true);
    setResult(null);
    try {
      const prompt = `Eres un farmacéutico clínico experto. Analiza las interacciones medicamentosas entre los siguientes fármacos y responde en español en formato JSON.\n\nFármaco principal: ${med.generic_name} (${med.pharmacological_class || ""})\nInteracciones conocidas: ${med.drug_interactions || "No especificadas"}\n\nOtros medicamentos del paciente: ${otherMeds}\n\nResponde en este formato JSON exacto:\n{"interactions": [{"drug": "nombre del otro fármaco", "severity": "leve|moderada|severa", "description": "descripción de la interacción", "recommendation": "recomendación clínica"}], "summary": "resumen general"}`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt, response_json_schema: { type: "object", properties: { interactions: { type: "array", items: { type: "object", properties: { drug: { type: "string" }, severity: { type: "string" }, description: { type: "string" }, recommendation: { type: "string" } } } }, summary: { type: "string" } } }, model: "gemini_3_flash" });
      setResult(res);
    } catch {
      setResult({ error: "No se pudo analizar las interacciones. Intenta nuevamente." });
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5 border-amber-400 text-amber-600 hover:bg-amber-50"><ShieldAlert className="h-4 w-4" /> Verificar interacciones</Button>;
  }

  const sevColor = { leve: "bg-green-100 text-green-700", moderada: "bg-amber-100 text-amber-700", severa: "bg-red-100 text-red-700" };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-bold text-amber-700"><ShieldAlert className="h-4 w-4" /> Verificador de interacciones</p>
        <button onClick={() => setOpen(false)} className="text-xs text-slate-500 hover:text-slate-700">Cerrar</button>
      </div>
      <p className="mb-2 text-xs text-slate-600">Lista los otros medicamentos que recibe el paciente (separados por coma):</p>
      <Textarea value={otherMeds} onChange={(e) => setOtherMeds(e.target.value)} placeholder="warfarina, enalapril, metformina…" rows={2} />
      <Button onClick={check} size="sm" disabled={loading || !otherMeds.trim()} className="mt-2 bg-amber-600 hover:bg-amber-700">{loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analizando…</> : "Analizar interacciones"}</Button>
      {result && !result.error && (
        <div className="mt-3 space-y-2">
          {result.summary && <p className="text-sm font-medium text-slate-700">{result.summary}</p>}
          {result.interactions && result.interactions.map((int, i) => (
            <div key={i} className="rounded-lg border border-slate-200 bg-white p-3">
              <div className="mb-1 flex items-center justify-between">
                <p className="text-sm font-bold text-slate-800">{int.drug}</p>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${sevColor[int.severity] || sevColor.leve}`}>{int.severity}</span>
              </div>
              <p className="text-xs text-slate-600">{int.description}</p>
              {int.recommendation && <p className="mt-1 text-xs text-[#002D62]"><strong>Recomendación:</strong> {int.recommendation}</p>}
            </div>
          ))}
        </div>
      )}
      {result?.error && <p className="mt-2 text-sm text-red-600">{result.error}</p>}
    </div>
  );
}