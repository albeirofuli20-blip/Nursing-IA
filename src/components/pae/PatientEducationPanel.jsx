import { useState } from "react";
import { GraduationCap, FileDown, Sparkles, CheckCircle } from "lucide-react";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AIService } from "@/lib/aiService";

function exportEducationToPdf(title, content, filename) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 45, 98);
  doc.text("Nurse Master IA - Educación al paciente", 14, y);
  y += 8;
  doc.setFontSize(13);
  doc.text(title, 14, y);
  y += 6;
  doc.setDrawColor(0, 168, 181);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const lines = doc.splitTextToSize(String(content), 180);
  doc.text(lines, 14, y);
  y += lines.length * 5 + 6;
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text("Propuesta asistida por IA. Requiere validación del profesional antes de entregar al paciente.", 14, y);
  doc.save(filename);
}

export default function PatientEducationPanel({ patients = [] }) {
  const [diagnosis, setDiagnosis] = useState("");
  const [patientId, setPatientId] = useState("");
  const [generated, setGenerated] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleGenerate() {
    if (!diagnosis.trim()) return;
    setLoading(true);
    setError("");
    setGenerated(null);
    try {
      const patient = patients.find((p) => p.id === patientId);
      const result = await AIService.generateEducationalPlan(patient || {}, diagnosis);
      setGenerated(result);
    } catch {
      setError("No se pudo generar el plan educativo. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 11</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Educación al paciente</h2>
        <p className="mt-2 text-slate-600">Generación automática de planes educativos, indicaciones de alta y material descargable con seguimiento.</p>
      </div>
      <div className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="space-y-3">
          <div>
            <Label htmlFor="patient">Paciente (opcional)</Label>
            <select id="patient" value={patientId} onChange={(e) => setPatientId(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
              <option value="">Sin paciente seleccionado</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {p.code}</option>)}
            </select>
          </div>
          <div><Label htmlFor="dx">Diagnóstico / Condición</Label><Input id="dx" placeholder="Ej. Diabetes tipo 2, Hipertensión, EPOC..." value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} /></div>
        </div>
        <Button onClick={handleGenerate} disabled={loading || !diagnosis.trim()} className="mt-4 bg-[#00A8B5] hover:bg-[#008f99]">
          {loading ? <><Sparkles className="h-4 w-4 animate-pulse" />Generando...</> : <><Sparkles className="h-4 w-4" />Generar plan educativo con IA</>}
        </Button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
      {generated && (
        <div className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><GraduationCap className="h-5 w-5" />Plan educativo</h3>
            <Textarea readOnly value={generated.plan || ""} className="min-h-[200px] bg-slate-50" />
            <Button variant="outline" className="mt-3" onClick={() => exportEducationToPdf("Plan educativo", generated.plan, `Plan_educativo_${diagnosis.substring(0, 30)}.pdf`)}><FileDown className="h-4 w-4" />Descargar PDF</Button>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><CheckCircle className="h-5 w-5" />Indicaciones de alta</h3>
            <Textarea readOnly value={generated.discharge || ""} className="min-h-[200px] bg-slate-50" />
            <Button variant="outline" className="mt-3" onClick={() => exportEducationToPdf("Indicaciones de alta", generated.discharge, `Alta_${diagnosis.substring(0, 30)}.pdf`)}><FileDown className="h-4 w-4" />Descargar PDF</Button>
          </div>
        </div>
      )}
      {generated && <p className="mt-3 text-xs text-slate-500">Propuesta asistida por IA. Requiere validación del profesional antes de entregar al paciente.</p>}
    </section>
  );
}