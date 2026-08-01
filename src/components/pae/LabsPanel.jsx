import { FlaskConical, TrendingUp, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const LABS = [
  { test: "Hemoglobina", value: "7.2 g/dL", ref: "12-16 (M) / 12-15 (F)", status: "bajo", interpretation: "Anemia. Considerar diagnóstico NANDA: Riesgo de perfusión tisular periférica ineficaz. Evaluar causa y necesidad de suplementación.", related: "00093 Riesgo de perfusión tisular periférica ineficaz" },
  { test: "Glucemia", value: "185 mg/dL", ref: "70-110", status: "alto", interpretation: "Hiperglucemia. Considerar NANDA: Riesgo de nivel de glucemia inestable. Revisar pauta de insulina y dieta.", related: "00179 Riesgo de nivel de glucemia inestable" },
  { test: "Sodio", value: "128 mEq/L", ref: "135-145", status: "bajo", interpretation: "Hiponatremia. Vigilar estado neurológico, restricción hídrica si corresponde. Considerar NANDA: Desequilibrio electrolítico.", related: "00195 Riesgo de desequilibrio electrolítico" },
  { test: "Creatinina", value: "1.8 mg/dL", ref: "0.6-1.2", status: "alto", interpretation: "Elevación sugiere compromiso renal. Ajustar dosis de medicamentos nefrotóxicos. Vigilar diuresis.", related: "00025 Riesgo de perfusión renal" },
  { test: "Leucocitos", value: "14.500 /mm³", ref: "4.500-11.000", status: "alto", interpretation: "Leucocitosis sugiere proceso infeccioso. Considerar NANDA: Riesgo de infección. Vigilar signos vitales y foco infeccioso.", related: "00004 Riesgo de infección" },
  { test: "Potasio", value: "4.2 mEq/L", ref: "3.5-5.0", status: "normal", interpretation: "Valor dentro de rango normal. Sin acciones requeridas.", related: "—" }
];

const STATUS = { normal: "bg-green-100 text-green-700", bajo: "bg-blue-100 text-blue-700", alto: "bg-red-100 text-red-700" };

export default function LabsPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 8</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Laboratorios</h2>
        <p className="mt-2 text-slate-600">Interpretación de resultados con relación a diagnósticos de enfermería, alertas y seguimiento de tendencias.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {LABS.map((lab) => (
          <div key={lab.test} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><FlaskConical className="h-5 w-5 text-[#002D62]" /><h3 className="font-bold text-slate-900">{lab.test}</h3></div>
              <Badge className={STATUS[lab.status]}>{lab.status}</Badge>
            </div>
            <div className="mb-3 flex items-baseline gap-4">
              <span className="text-2xl font-bold text-slate-900">{lab.value}</span>
              <span className="text-xs text-slate-400">Ref: {lab.ref}</span>
            </div>
            <p className="text-sm text-slate-600">{lab.interpretation}</p>
            {lab.related !== "—" && (
              <div className="mt-3 flex items-start gap-2 rounded-lg bg-[#00A8B5]/5 p-3">
                <TrendingUp className="h-4 w-4 shrink-0 text-[#00A8B5]" />
                <p className="text-xs text-slate-700"><strong>NANDA relacionado:</strong> {lab.related}</p>
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <p className="text-sm text-amber-700">La interpretación es una propuesta asistida por IA basada en rangos de referencia. La decisión clínica final corresponde al profesional.</p>
      </div>
    </section>
  );
}