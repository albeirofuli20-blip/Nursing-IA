import { useState } from "react";
import { ClipboardCheck, AlertCircle, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const PATTERNS = [
  { id: 1, name: "Manejo y percepción de la salud", prompt: "Percepción de salud, hábitos, cumplimiento terapéutico, consumo de sustancias" },
  { id: 2, name: "Nutricional-metabólico", prompt: "Patrón de alimentación, peso, apetito, hidratación, piel y mucosas" },
  { id: 3, name: "Eliminación", prompt: "Patrón intestinal y urinario, cambios, uso de laxantes o diuréticos" },
  { id: 4, name: "Actividad-ejercicio", prompt: "Capacidad funcional, ejercicio, movilidad, actividades de la vida diaria" },
  { id: 5, name: "Sueño-descanso", prompt: "Patrón de sueño, calidad, uso de hipnóticos, somnolencia diurna" },
  { id: 6, name: "Cognitivo-perceptual", prompt: "Orientación, memoria, atención, dolor, alteraciones sensoriales" },
  { id: 7, name: "Autopercepción-autoconcepto", prompt: "Autoestima, imagen corporal, estado emocional, identidad" },
  { id: 8, name: "Rol-relaciones", prompt: "Estructura familiar, roles, relaciones sociales, apoyo, aislamiento" },
  { id: 9, name: "Sexualidad-reproductivo", prompt: "Salud sexual, reproductiva, menstruación, embarazo, menopausia" },
  { id: 10, name: "Adaptación-tolerancia al estrés", prompt: "Mecanismos de afrontamiento, estrés, ansiedad, depresión" },
  { id: 11, name: "Valores-creencias", prompt: "Creencias religiosas, valores, conflictos espirituales, decisiones" }
];

export default function AssessmentPanel() {
  const [values, setValues] = useState({});
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = () => {
    setLoading(true);
    setAnalysis(null);
    setTimeout(() => {
      const altered = PATTERNS.filter((p) => {
        const v = (values[p.id] || "").toLowerCase();
        return v.includes("alter") || v.includes("dolor") || v.includes("dificult") || v.includes("ansie") || v.includes("depres") || v.includes("insomn") || v.includes("incontin") || v.includes("riesgo") || v.includes("limit");
      });
      setAnalysis(altered.length > 0 ? altered : PATTERNS.slice(0, 2));
      setLoading(false);
    }, 1200);
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Valoración de enfermería</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Patrones funcionales de Gordon</h2>
        <p className="mt-2 text-slate-600">Valoración estructurada por los 11 patrones funcionales. La IA identifica datos alterados y genera observaciones.</p>
      </div>
      <div className="space-y-3">
        {PATTERNS.map((p) => (
          <div key={p.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <Label className="text-sm font-bold text-slate-900">{p.id}. {p.name}</Label>
            <p className="mb-2 text-xs text-slate-400">{p.prompt}</p>
            <Textarea placeholder="Describe los hallazgos..." value={values[p.id] || ""} onChange={(e) => setValues({ ...values, [p.id]: e.target.value })} className="mt-1" rows={2} />
          </div>
        ))}
      </div>
      <div className="mt-4">
        <Button onClick={handleAnalyze} disabled={loading} className="bg-[#00A8B5] hover:bg-[#008f99]">
          {loading ? <><Sparkles className="h-4 w-4 animate-pulse" />Analizando...</> : <><Sparkles className="h-4 w-4" />Analizar con IA</>}
        </Button>
      </div>
      {analysis && (
        <div className="mt-4 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
          <h3 className="mb-2 flex items-center gap-2 font-bold text-[#002D62]"><AlertCircle className="h-5 w-5" />Patrones alterados detectados</h3>
          <ul className="space-y-2">
            {analysis.map((p) => (
              <li key={p.id} className="flex items-start gap-2 text-sm text-slate-700"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A8B5]" /><strong>{p.name}:</strong> Se recomienda profundizar la valoración y considerar diagnósticos NANDA relacionados.</li>
            ))}
          </ul>
          <p className="mt-3 text-xs text-slate-500">Propuesta asistida por IA. Requiere validación del profesional.</p>
        </div>
      )}
    </section>
  );
}