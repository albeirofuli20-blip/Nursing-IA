import { useState } from "react";
import { ChevronLeft, ChevronRight, Check, Sparkles, UserPlus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import useStructuredCapture from "@/hooks/useStructuredCapture";
import { Step1Identification, Step2Social, Step3Clinical, Step4Subjective, Step5Objective, Step6Assessment } from "@/components/pae/capture/CaptureSteps";

const STEPS = [
  { id: 1, name: "Identificación" },
  { id: 2, name: "Determinantes sociales" },
  { id: 3, name: "Información clínica" },
  { id: 4, name: "Datos subjetivos" },
  { id: 5, name: "Datos objetivos" },
  { id: 6, name: "Valoración" },
  { id: 7, name: "Revisión" }
];

const STEP_COMPONENTS = { 1: Step1Identification, 2: Step2Social, 3: Step3Clinical, 4: Step4Subjective, 5: Step5Objective, 6: Step6Assessment };

export default function StructuredCapture({ patients, guides, onSaved }) {
  const [step, setStep] = useState(1);
  const [data, setData] = useState({});
  const [patientMode, setPatientMode] = useState("existing");
  const [existingPatientId, setExistingPatientId] = useState("");
  const [generated, setGenerated] = useState(null);
  const { generate, loading, error } = useStructuredCapture((plans) => { setGenerated(plans); onSaved(); });

  const set = (key, val) => setData((d) => ({ ...d, [key]: val }));

  const existingPatient = patients.find((p) => p.id === existingPatientId);
  const canGenerate = patientMode === "existing" ? !!existingPatient : !!(data.code && data.full_name);

  async function handleGenerate() {
    let patient = existingPatient;
    if (patientMode === "new") {
      patient = await base44.entities.Patient.create({
        code: data.code,
        full_name: data.full_name,
        sex: data.sex ? data.sex.toLowerCase() : "no_especificado",
        clinical_summary: data.reason_consultation || "",
        allergies: data.allergies || "",
        current_medications: data.medications || ""
      });
    }
    await generate(data, patient, guides);
  }

  const CurrentStep = STEP_COMPONENTS[step];

  return (
    <div className="rounded-2xl border border-[#00A8B5]/30 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-2 text-[#002D62]">
        <Sparkles className="h-5 w-5" />
        <h3 className="font-semibold">Captura estructurada para generación de PAE</h3>
      </div>

      {/* Progress */}
      <div className="mb-6 flex items-center gap-1 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s.id} className="flex items-center gap-1">
            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${step > s.id ? "bg-[#00A8B5] text-white" : step === s.id ? "bg-[#002D62] text-white" : "bg-slate-200 text-slate-500"}`}>
              {step > s.id ? <Check className="h-3.5 w-3.5" /> : s.id}
            </div>
            <span className={`hidden text-xs font-medium sm:inline ${step === s.id ? "text-[#002D62]" : "text-slate-400"}`}>{s.name}</span>
            {i < STEPS.length - 1 && <div className={`h-0.5 w-4 ${step > s.id ? "bg-[#00A8B5]" : "bg-slate-200"}`} />}
          </div>
        ))}
      </div>

      {/* Patient mode selector (step 1 only) */}
      {step === 1 && (
        <div className="mb-4 flex gap-2 rounded-lg bg-slate-50 p-2">
          <button onClick={() => setPatientMode("existing")} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${patientMode === "existing" ? "bg-[#002D62] text-white" : "text-slate-600"}`}>Paciente existente</button>
          <button onClick={() => setPatientMode("new")} className={`flex-1 rounded-md px-3 py-2 text-sm font-medium ${patientMode === "new" ? "bg-[#002D62] text-white" : "text-slate-600"}`}><UserPlus className="mr-1 inline h-3.5 w-3.5" />Nuevo paciente</button>
        </div>
      )}
      {step === 1 && patientMode === "existing" && (
        <div className="mb-4">
          <label className="text-xs font-semibold text-slate-600">Selecciona el paciente</label>
          <select value={existingPatientId} onChange={(e) => setExistingPatientId(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
            <option value="">Seleccionar...</option>
            {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {p.code}</option>)}
          </select>
        </div>
      )}

      {/* Step content */}
      {step < 7 && CurrentStep && <CurrentStep data={data} set={set} />}

      {/* Review step */}
      {step === 7 && !generated && (
        <div className="space-y-4">
          <p className="text-sm text-slate-500">Revisa la información antes de generar los PAE. Puedes volver a cualquier módulo para corregir.</p>
          <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-200 bg-slate-50 p-4">
            <pre className="whitespace-pre-wrap text-xs text-slate-600">{JSON.stringify(data, null, 2)}</pre>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button onClick={handleGenerate} disabled={!canGenerate || loading} className="bg-[#00A8B5] hover:bg-[#008f99]">
            {loading ? <><Sparkles className="h-4 w-4 animate-pulse" />Generando PAE...</> : <><Sparkles className="h-4 w-4" />Generar PAE con IA</>}
          </Button>
          <p className="text-xs text-slate-500">La IA generará mínimo 4 PAE independientes. Toda propuesta requiere validación del profesional.</p>
        </div>
      )}

      {/* Results */}
      {generated && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700">
            <Check className="h-5 w-5" />
            <p className="text-sm font-medium">Se generaron {generated.length} PAE. Cada uno es editable en la pestaña "Planes PAE".</p>
          </div>
          <div className="space-y-2">
            {generated.map((p) => (
              <div key={p.id} className="flex items-center gap-2 rounded-lg border border-slate-200 p-3">
                <FileText className="h-4 w-4 text-[#00A8B5]" />
                <span className="text-sm font-medium text-slate-900">{p.title}</span>
              </div>
            ))}
          </div>
          <Button variant="outline" onClick={() => { setGenerated(null); setStep(1); setData({}); }}>Nueva captura</Button>
        </div>
      )}

      {/* Navigation */}
      {step < 7 && !generated && (
        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
            <ChevronLeft className="h-4 w-4" />Anterior
          </Button>
          <Button onClick={() => setStep((s) => Math.min(7, s + 1))} className="bg-[#002D62] hover:bg-[#001f4d]">
            Siguiente<ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}