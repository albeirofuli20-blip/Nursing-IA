import { useState } from "react";
import { Check, Stethoscope, Activity, ClipboardList, FlaskConical, FileSearch } from "lucide-react";
import { SCALES } from "@/lib/scales";
import { Button } from "@/components/ui/button";
import { LabeledTextarea, LabeledInput } from "@/components/pae/capture/CaptureFields";
import ScaleCalculator from "@/components/pae/ScaleCalculator";

const GORDON_PATTERNS = [
  { key: "pattern_health", label: "1. Percepción-manejo de la salud", placeholder: "Percepción de salud, hábitos, cumplimiento terapéutico..." },
  { key: "pattern_nutritional", label: "2. Nutricional-metabólico", placeholder: "Dieta, apetito, peso, mucosas, hidratación..." },
  { key: "pattern_elimination", label: "3. Eliminación", placeholder: "Patrón intestinal y vesical, regularidad, cambios..." },
  { key: "pattern_activity", label: "4. Actividad-ejercicio", placeholder: "Capacidad funcional, ejercicio, tolerancia, deambulación..." },
  { key: "pattern_sleep", label: "5. Sueño-descanso", placeholder: "Horas de sueño, calidad, insomnio, descanso..." },
  { key: "pattern_cognitive", label: "6. Cognitivo-perceptual", placeholder: "Memoria, orientación, percepción, dolor, sentidos..." },
  { key: "pattern_self_perception", label: "7. Autopercepción-autoconcepto", placeholder: "Autoestima, imagen corporal, estado emocional..." },
  { key: "pattern_roles", label: "8. Rol-relaciones", placeholder: "Familia, trabajo, relaciones sociales, apoyo..." },
  { key: "pattern_sexuality", label: "9. Sexualidad-reproducción", placeholder: "Patrón sexual, reproducción, cambios..." },
  { key: "pattern_stress", label: "10. Adaptación-tolerancia al estrés", placeholder: "Mecanismos de afrontamiento, estrés, ansiedad..." },
  { key: "pattern_values", label: "11. Valores-creencias", placeholder: "Creencias religiosas, valores espirituales, prácticas..." }
];

function recommendScales(data) {
  const recommended = [];
  const paeType = (data.pae_type || "intrahospitalario").toLowerCase();
  const service = (data.service || "").toLowerCase();
  const diagnosis = (data.medical_diagnosis || "").toLowerCase();
  const age = Number(data.age) || 0;

  if (paeType === "comunitario") {
    recommended.push("barthel", "eva");
  } else {
    recommended.push("braden", "morse", "eva");
    if (service.includes("uci") || diagnosis.includes("trauma") || diagnosis.includes("neuro") || diagnosis.includes("accidente") || diagnosis.includes("cerebro")) {
      recommended.push("glasgow");
    }
  }
  if (age >= 60) recommended.push("norton");
  return [...new Set(recommended)];
}

function ScaleCaptureCard({ scaleKey, result, isActive, onApply, onSave }) {
  const [currentScore, setCurrentScore] = useState(0);
  const [currentInterp, setCurrentInterp] = useState("");
  const scale = SCALES[scaleKey];

  if (result?.applied && !isActive) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">{scale.name}</p>
            <p className="text-xs text-slate-500">{scale.category}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-green-700">{result.score}/{scale.max}</p>
            <p className="text-xs text-green-600">{result.interpretation}</p>
          </div>
        </div>
        <Button size="sm" variant="ghost" className="mt-1 h-7 text-xs" onClick={onApply}>Reaplicar</Button>
      </div>
    );
  }

  if (!isActive) {
    return (
      <div className="rounded-xl border border-slate-200 p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-slate-900">{scale.name}</p>
            <p className="text-xs text-slate-500">{scale.category}</p>
          </div>
          <Button size="sm" variant="outline" onClick={onApply}>Aplicar</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <ScaleCalculator scaleKey={scaleKey} onScoreChange={(s, i) => { setCurrentScore(s); setCurrentInterp(i); }} />
      <Button onClick={() => onSave(scaleKey, currentScore, currentInterp)} className="bg-[#00A8B5] hover:bg-[#008f99]">
        <Check className="mr-1 h-4 w-4" />Guardar resultado ({currentScore}/{scale.max})
      </Button>
    </div>
  );
}

function SubSection({ icon: Icon, title, color, children }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-3 flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <h4 className="text-sm font-bold uppercase tracking-wide text-slate-700">{title}</h4>
      </div>
      {children}
    </div>
  );
}

export function Step6Valoracion({ data, set }) {
  const [activeScale, setActiveScale] = useState(null);
  const scales = data.scales || {};
  const recommended = recommendScales(data);
  const allKeys = Object.keys(SCALES);
  const otherScales = allKeys.filter((k) => !recommended.includes(k));

  const saveScale = (key, score, interpretation) => {
    set("scales", { ...scales, [key]: { score, interpretation, applied: true } });
    setActiveScale(null);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Valoración integral de enfermería: patrones funcionales de Gordon, necesidades de Henderson, escalas clínicas, laboratorios y estudios diagnósticos.</p>

      <SubSection icon={ClipboardList} title="Patrones funcionales de Gordon" color="text-[#002D62]">
        <div className="space-y-3">
          {GORDON_PATTERNS.map((p) => (
            <LabeledTextarea key={p.key} label={p.label} value={data[p.key]} onChange={(v) => set(p.key, v)} rows={2} placeholder={p.placeholder} />
          ))}
        </div>
      </SubSection>

      <SubSection icon={ClipboardList} title="Necesidades de Henderson" color="text-[#002D62]">
        <LabeledTextarea label="14 necesidades básicas de Virginia Henderson" value={data.henderson_needs} onChange={(v) => set("henderson_needs", v)} rows={3} placeholder="Respirar, comer, beber, eliminar, moverse, dormir, vestirse, temperatura, higiene, seguridad, comunicarse, creencias, trabajar, recrearse, aprender..." />
      </SubSection>

      <SubSection icon={Stethoscope} title="Escalas clínicas" color="text-[#00A8B5]">
        <p className="mb-3 text-xs text-slate-500">Las escalas recomendadas se seleccionan automáticamente según el tipo de PAE, servicio y datos del paciente. Los resultados alimentan la generación del PAE.</p>
        <p className="mb-2 text-xs font-semibold uppercase text-[#00A8B5]">Recomendadas</p>
        <div className="mb-3 grid gap-2 sm:grid-cols-2">
          {recommended.map((key) => (
            <ScaleCaptureCard key={key} scaleKey={key} result={scales[key]} isActive={activeScale === key} onApply={() => setActiveScale(key)} onSave={saveScale} />
          ))}
        </div>
        {otherScales.length > 0 && (
          <>
            <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Otras escalas disponibles</p>
            <div className="grid gap-2 sm:grid-cols-2">
              {otherScales.map((key) => (
                <ScaleCaptureCard key={key} scaleKey={key} result={scales[key]} isActive={activeScale === key} onApply={() => setActiveScale(key)} onSave={saveScale} />
              ))}
            </div>
          </>
        )}
        {Object.keys(scales).length > 0 && (
          <div className="mt-3 rounded-xl bg-slate-50 p-3">
            <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><Activity className="h-3.5 w-3.5" />Resumen de escalas aplicadas</p>
            <p className="text-sm text-slate-700">{Object.entries(scales).map(([key, val]) => `${SCALES[key]?.name || key}: ${val.score} (${val.interpretation})`).join(" · ")}</p>
          </div>
        )}
      </SubSection>

      <div className="grid gap-4 sm:grid-cols-2">
        <SubSection icon={FlaskConical} title="Laboratorios" color="text-[#002D62]">
          <LabeledTextarea label="Resultados de laboratorio" value={data.labs} onChange={(v) => set("labs", v)} rows={3} placeholder="Ej. Hb 7.2, glucemia 185, creatinina 1.2..." />
        </SubSection>
        <SubSection icon={FileSearch} title="Estudios diagnósticos" color="text-[#002D62]">
          <LabeledTextarea label="Estudios diagnósticos relevantes" value={data.diagnostic_studies} onChange={(v) => set("diagnostic_studies", v)} rows={3} placeholder="Ej. RX tórax, ecografía, ECG, TAC..." />
        </SubSection>
      </div>
    </div>
  );
}