import { useState } from "react";
import { Calculator, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function DoseCalculator({ med }) {
  const [open, setOpen] = useState(false);
  const [weight, setWeight] = useState("");
  const [dosePerKg, setDosePerKg] = useState("");
  const [frequency, setFrequency] = useState("");
  const [concentration, setConcentration] = useState("");
  const [result, setResult] = useState(null);

  function calculate() {
    const w = parseFloat(weight);
    const d = parseFloat(dosePerKg);
    const f = parseFloat(frequency) || 1;
    if (!w || !d) return;
    const dosePerAdmin = w * d;
    const dailyDose = dosePerAdmin * f;
    let volume = null;
    if (concentration) {
      const c = parseFloat(concentration);
      if (c) volume = (dosePerAdmin / c).toFixed(2);
    }
    setResult({ dosePerAdmin: dosePerAdmin.toFixed(2), dailyDose: dailyDose.toFixed(2), volume });
  }

  if (!open) {
    return <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5"><Calculator className="h-4 w-4" /> Calculadora de dosis</Button>;
  }

  return (
    <div className="rounded-xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-4">
      <div className="mb-3 flex items-center justify-between">
        <p className="flex items-center gap-1.5 text-sm font-bold text-[#002D62]"><Calculator className="h-4 w-4" /> Calculadora de dosis</p>
        <button onClick={() => setOpen(false)} className="text-xs text-slate-500 hover:text-slate-700">Cerrar</button>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div><Label className="text-xs">Peso del paciente (kg)</Label><Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="70" /></div>
        <div><Label className="text-xs">Dosis (mg/kg)</Label><Input type="number" value={dosePerKg} onChange={(e) => setDosePerKg(e.target.value)} placeholder="5" /></div>
        <div><Label className="text-xs">Frecuencia (veces/día)</Label><Input type="number" value={frequency} onChange={(e) => setFrequency(e.target.value)} placeholder="3" /></div>
        <div><Label className="text-xs">Concentración disponible (mg/mL)</Label><Input type="number" value={concentration} onChange={(e) => setConcentration(e.target.value)} placeholder="10" /></div>
      </div>
      <Button onClick={calculate} size="sm" className="mt-3 bg-[#00A8B5] hover:bg-[#00A8B5]/90">Calcular</Button>
      {result && (
        <div className="mt-3 space-y-1 rounded-lg bg-white p-3 text-sm">
          <p><strong className="text-slate-700">Dosis por administración:</strong> {result.dosePerAdmin} mg</p>
          <p><strong className="text-slate-700">Dosis diaria total:</strong> {result.dailyDose} mg/día</p>
          {result.volume && (
            <div className="flex items-center gap-1.5"><Droplet className="h-4 w-4 text-[#00A8B5]" /><span><strong className="text-slate-700">Volumen a administrar:</strong> {result.volume} mL</span></div>
          )}
          <p className="mt-2 text-xs text-amber-600">⚠ Verificar siempre con la prescripción médica. Esta calculadora es una herramienta de apoyo.</p>
        </div>
      )}
    </div>
  );
}