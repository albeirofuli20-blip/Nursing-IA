import { useState, useRef } from "react";
import { Camera, Loader2, ScanLine } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";

export default function PhotoRecognition({ onIdentified }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const fileRef = useRef(null);

  async function handleFile(file) {
    if (!file) return;
    setLoading(true);
    setResult(null);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      const prompt = `Eres un farmacéutico experto. Analiza esta imagen de un medicamento (blíster, ampolla, caja o tableta) e identifica el principio activo. Responde en español en formato JSON:\n\n{"generic_name": "nombre genérico del principio activo", "trade_name": "nombre comercial si es visible", "confidence": "alta|media|baja", "notes": "observaciones"}\n\nSi no puedes identificar el medicamento, responde con generic_name null y explica en notes.`;
      const res = await base44.integrations.Core.InvokeLLM({ prompt, file_urls: [file_url], response_json_schema: { type: "object", properties: { generic_name: { type: "string" }, trade_name: { type: "string" }, confidence: { type: "string" }, notes: { type: "string" } } }, model: "gemini_3_flash" });
      setResult(res);
      if (res?.generic_name && onIdentified) onIdentified(res.generic_name);
    } catch {
      setResult({ error: "No se pudo analizar la imagen." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <input ref={fileRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFile(e.target.files?.[0])} />
      <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()} disabled={loading} className="gap-1.5 border-[#002D62] text-[#002D62] hover:bg-[#002D62]/10">
        {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Analizando…</> : <><Camera className="h-4 w-4" /> Reconocer por foto</>}
      </Button>
      {result && !result.error && (
        <div className="text-xs">
          {result.generic_name ? (
            <span className="flex items-center gap-1 text-green-700"><ScanLine className="h-3 w-3" /> Identificado: <strong>{result.generic_name}</strong> {result.trade_name && `(${result.trade_name})`}</span>
          ) : (
            <span className="text-amber-600">{result.notes || "No identificado"}</span>
          )}
        </div>
      )}
      {result?.error && <span className="text-xs text-red-600">{result.error}</span>}
    </div>
  );
}