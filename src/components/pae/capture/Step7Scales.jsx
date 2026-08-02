import { useState } from "react";
import { Check, Stethoscope, Activity } from "lucide-react";
import { SCALES } from "@/lib/scales";
import { Button } from "@/components/ui/button";
import ScaleCalculator from "@/components/pae/ScaleCalculator";

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

export function Step7Scales({ data, set }) {
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
      <p className="text-sm text-slate-500">Aplica las escalas de valoración clínica. Las recomendadas se seleccionan automáticamente según el tipo de PAE, servicio y datos del paciente. Los resultados alimentan la generación del PAE.</p>
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase text-[#00A8B5]"><Stethoscope className="h-3.5 w-3.5" />Escalas recomendadas</p>
        <div className="grid gap-2 sm:grid-cols-2">
          {recommended.map((key) => (
            <ScaleCaptureCard key={key} scaleKey={key} result={scales[key]} isActive={activeScale === key} onApply={() => setActiveScale(key)} onSave={saveScale} />
          ))}
        </div>
      </div>
      {otherScales.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-semibold uppercase text-slate-400">Otras escalas disponibles</p>
          <div className="grid gap-2 sm:grid-cols-2">
            {otherScales.map((key) => (
              <ScaleCaptureCard key={key} scaleKey={key} result={scales[key]} isActive={activeScale === key} onApply={() => setActiveScale(key)} onSave={saveScale} />
            ))}
          </div>
        </div>
      )}
      {Object.keys(scales).length > 0 && (
        <div className="rounded-xl bg-slate-50 p-3">
          <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-600"><Activity className="h-3.5 w-3.5" />Resumen de escalas aplicadas</p>
          <p className="text-sm text-slate-700">{Object.entries(scales).map(([key, val]) => `${SCALES[key]?.name || key}: ${val.score} (${val.interpretation})`).join(" · ")}</p>
        </div>
      )}
    </div>
  );
}