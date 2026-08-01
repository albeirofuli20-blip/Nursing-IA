import { useState } from "react";
import { Pill, Search, AlertTriangle, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const MEDS = [
  { name: "Paracetamol", class: "Analgésico", dose: "500-1000 mg c/6-8h", max: "4 g/día", dilution: "Vía oral/IV", contraindications: "Hepatopatía severa", interactions: "Warfarina (potencia efecto)", nursing: "Monitorizar función hepática en uso prolongado", alert: "verde" },
  { name: "Omeprazol", class: "Antiulceroso IBP", dose: "20-40 mg/día", max: "80 mg/día", dilution: "Vía oral/IV", contraindications: "Hipersensibilidad", interactions: "Clopidogrel (reduce efecto)", nursing: "Administrar antes del desayuno", alert: "verde" },
  { name: "Enoxaparina", class: "Anticoagulante", dose: "40 mg SC c/24h (profilaxis)", max: "Según peso", dilution: "SC", contraindications: "Hemorragia activa, trombocitopenia", interactions: "AINEs, antiagregantes (riesgo hemorragia)", nursing: "Rotar sitios de inyección, no masajear, vigilar signos de sangrado", alert: "rojo" },
  { name: "Metformina", class: "Antidiabético", dose: "500-850 mg c/8-12h", max: "2550 mg/día", dilution: "Vía oral", contraindications: "IRC, acidosis metabólica", interactions: "Contrastes yodados (suspender 48h)", nursing: "Vigilar función renal, signos de acidosis láctica", alert: "amarillo" },
  { name: "Salbutamol", class: "Broncodilatador", dose: "100-200 µg inhalación", max: "8 inhalaciones/día", dilution: "Inhalación", contraindications: "Hipersensibilidad", interactions: "Beta-bloqueantes (antagonismo)", nursing: "Enseñar técnica inhalatoria, enjuagar boca", alert: "verde" },
  { name: "Vancomicina", class: "Antibiótico", dose: "15-20 mg/kg IV c/8-12h", max: "Según niveles", dilution: "IV en 60+ min", contraindications: "Hipersensibilidad", interactions: "Aminoglucósidos (nefrotoxicidad)", nursing: "Monitorizar niveles valle y pico, función renal", alert: "rojo" }
];

const ALERT_STYLES = { verde: { bg: "bg-green-100 text-green-700", icon: CheckCircle, label: "Seguro" }, amarillo: { bg: "bg-amber-100 text-amber-700", icon: AlertTriangle, label: "Precaución" }, rojo: { bg: "bg-red-100 text-red-700", icon: AlertTriangle, label: "Alerta" } };

export default function MedicationsPanel() {
  const [search, setSearch] = useState("");
  const filtered = MEDS.filter((m) => m.name.toLowerCase().includes(search.toLowerCase()) || m.class.toLowerCase().includes(search.toLowerCase()));

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 6</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Medicamentos</h2>
        <p className="mt-2 text-slate-600">Base de datos de medicamentos con indicaciones, interacciones, dosis, diluciones y cuidados de enfermería.</p>
      </div>
      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar medicamento o clase..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((m) => {
          const A = ALERT_STYLES[m.alert];
          const AIcon = A.icon;
          return (
            <div key={m.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2"><Pill className="h-5 w-5 text-[#002D62]" /><h3 className="font-bold text-slate-900">{m.name}</h3></div>
                <Badge className={A.bg}><AIcon className="h-3 w-3 mr-1" />{A.label}</Badge>
              </div>
              <p className="mb-3 text-xs font-medium text-slate-400">{m.class}</p>
              <dl className="space-y-1.5 text-sm">
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Dosis:</dt><dd className="text-slate-700">{m.dose}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Máx:</dt><dd className="text-slate-700">{m.max}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Dilución:</dt><dd className="text-slate-700">{m.dilution}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Contraind.:</dt><dd className="text-slate-700">{m.contraindications}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Interacciones:</dt><dd className="text-slate-700">{m.interactions}</dd></div>
                <div className="flex gap-2"><dt className="font-semibold text-slate-500 shrink-0">Cuidados:</dt><dd className="text-slate-700">{m.nursing}</dd></div>
              </dl>
            </div>
          );
        })}
      </div>
    </section>
  );
}