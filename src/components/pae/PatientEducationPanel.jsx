import { useState } from "react";
import { GraduationCap, FileDown, Sparkles, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export default function PatientEducationPanel() {
  const [diagnosis, setDiagnosis] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(null);
    setTimeout(() => {
      setGenerated({
        plan: `Plan educativo para: ${diagnosis || "diabetes tipo 2"}\n\n1. Explicar la enfermedad en lenguaje sencillo\n2. Enseñar signos de alarma (hipo/hiperglucemia)\n3. Instruir sobre automonitoreo de glucemia\n4. Educación nutricional: conteo de carbohidratos\n5. Importancia de la actividad física\n6. Cuidado de los pies\n7. Adherencia al tratamiento farmacológico`,
        discharge: `Indicaciones de alta:\n• Continar medicación según prescripción\n• Control ambulatorio en 7 días\n• Acudir a urgencias si glucemia > 250 o < 60 mg/dL\n• Mantener dieta hipoglucida y ejercicio regular\n• Automonitoreo de glucemia 3 veces/día`
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 11</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Educación al paciente</h2>
        <p className="mt-2 text-slate-600">Generación automática de planes educativos, indicaciones de alta y material descargable con seguimiento.</p>
      </div>
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div><Label htmlFor="dx">Diagnóstico / Condición</Label><Input id="dx" placeholder="Ej. Diabetes tipo 2, Hipertensión, EPOC..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></div>
        </div>
        <Button onClick={handleGenerate} disabled={loading} className="mt-4 bg-[#00A8B5] hover:bg-[#008f99]">
          {loading ? <><Sparkles className="h-4 w-4 animate-pulse" />Generando...</> : <><Sparkles className="h-4 w-4" />Generar plan educativo con IA</>}
        </Button>
      </div>
      {generated && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><GraduationCap className="h-5 w-5" />Plan educativo</h3>
            <Textarea readOnly value={generated.plan} className="min-h-[200px] bg-slate-50" />
            <Button variant="outline" className="mt-3"><FileDown className="h-4 w-4" />Descargar PDF</Button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><CheckCircle className="h-5 w-5" />Indicaciones de alta</h3>
            <Textarea readOnly value={generated.discharge} className="min-h-[200px] bg-slate-50" />
            <Button variant="outline" className="mt-3"><FileDown className="h-4 w-4" />Descargar PDF</Button>
          </div>
        </div>
      )}
      {generated && <p className="mt-3 text-xs text-slate-500">Propuesta asistida por IA. Requiere validación del profesional antes de entregar al paciente.</p>}
    </section>
  );
}