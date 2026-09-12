import { ArrowLeft, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { exportPaePdf, exportPaeWord } from "@/lib/exportPlan";
import PaeDocumentIntra from "@/components/pae/PaeDocumentIntra";

function Cell({ label, value, className = "" }) {
  return <div className={`border border-slate-300 px-2 py-1.5 ${className}`}><span className="text-[10px] font-bold uppercase text-slate-500">{label}</span><p className="text-sm text-slate-900">{value || "—"}</p></div>;
}

function SectionBar({ children }) {
  return <div className="bg-[#4d8033] px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-white">{children}</div>;
}

export default function PaeDocument({ plan, patient, onBack }) {
  if (plan.pae_type === "intrahospitalario") return <PaeDocumentIntra plan={plan} patient={patient} onBack={onBack} />;
  const p = patient || { full_name: plan.patient_name, code: plan.medical_record, birth_date: null };
  return <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
    <div className="mx-auto max-w-5xl px-4 print:px-0">
      <div className="mb-4 flex items-center justify-between print:hidden"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Volver</Button><div className="flex gap-2"><Button variant="outline" onClick={() => exportPaePdf(plan, patient)}><Download className="mr-1 h-4 w-4" />PDF</Button><Button variant="outline" onClick={() => exportPaeWord(plan, patient)}><FileText className="mr-1 h-4 w-4" />Word</Button></div></div>
      <div className="rounded-lg bg-white p-6 shadow-md print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-[#4d8033] pb-3">
          <div className="text-2xl font-bold text-[#4d8033]">AREANDINA</div>
          <div className="text-center text-[11px] font-bold uppercase leading-tight text-slate-800">Facultad Ciencias de la Salud<br />Enfermería</div>
          <table className="text-[10px]"><tbody><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">VERSIÓN:</td><td className="border border-slate-300 px-2 py-0.5">{plan.version || "01"}</td></tr><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">CÓDIGO:</td><td className="border border-slate-300 px-2 py-0.5">{plan.code || "—"}</td></tr><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">FECHA:</td><td className="border border-slate-300 px-2 py-0.5">{plan.pae_date || "—"}</td></tr></tbody></table>
        </header>
        <div className="my-3 bg-[#4d8033] py-2 text-center text-sm font-bold uppercase text-white">Plan de Atención de Enfermería – PAE N.º {plan.pae_number || "—"} {plan.pae_type && <span className="ml-2 rounded bg-white/20 px-2 py-0.5 text-[10px]">{plan.pae_type}</span>}</div>
        <section className="grid grid-cols-2 gap-0 border border-slate-300">
          <Cell label="Nombres y Apellidos" value={p.full_name} /><Cell label="Servicio" value={plan.service} />
          <Cell label="Edad" value={p.birth_date} /><Cell label="N.° de Cama" value={plan.bed_number} />
          <Cell label="N.° de Historia Clínica" value={plan.medical_record || p.code} /><Cell label="N.° de Ingreso" value={plan.admission_number} />
          <div className="col-span-2 border border-slate-300 px-2 py-1.5"><span className="text-[10px] font-bold uppercase text-slate-500">Diagnóstico Médico</span><p className="text-sm text-slate-900">{plan.medical_diagnosis || "—"}</p></div>
        </section>
        <div className="mt-4 grid gap-0 md:grid-cols-3">
          <div className="border border-slate-300"><SectionBar>Diagnóstico de Enfermería (NANDA)</SectionBar><div className="space-y-2 p-2">{(plan.diagnoses || []).map((d, i) => <div key={i} className="text-xs"><p className="font-bold text-slate-900">{d.nanda} {d.code && `(${d.code})`}</p>{d.definition && <p className="mt-1 text-slate-600"><span className="font-semibold">Definición:</span> {d.definition}</p>}{d.related_to && <p className="text-slate-600"><span className="font-semibold">R/C:</span> {d.related_to}</p>}{d.evidence && <p className="text-slate-600"><span className="font-semibold">M/P:</span> {d.evidence}</p>}<div className="mt-1 border-t border-slate-200 pt-1 text-[11px]"><span className="font-semibold">Dominio y Clase:</span> {d.domain || "—"} / {d.class || "—"}</div></div>)}</div></div>
          <div className="border border-slate-300 md:border-l-0"><SectionBar>Resultados Esperados (NOC)</SectionBar><div className="space-y-3 p-2">{(plan.outcomes || []).map((o, i) => <div key={i} className="text-xs"><p className="font-bold text-slate-900">{i + 1}. {o.noc} {o.code && `(${o.code})`}</p>{o.indicators?.length > 0 && <ul className="ml-4 list-disc text-slate-600">{o.indicators.map((ind, j) => <li key={j}>{ind}</li>)}</ul>}<table className="mt-1 w-full text-[10px]"><thead><tr className="bg-slate-100">{[1,2,3,4,5].map(n => <th key={n} className="border border-slate-300 px-1">{n}</th>)}</tr></thead><tbody><tr><td className="border border-slate-300 px-1 text-center font-semibold">Inicial:</td><td className="border border-slate-300 px-1 text-center" colSpan={2}>{o.scale_initial || "—"}</td><td className="border border-slate-300 px-1 text-center font-semibold">Esperada:</td><td className="border border-slate-300 px-1 text-center">{o.scale_expected || "—"}</td></tr></tbody></table></div>)}</div></div>
          <div className="border border-slate-300 md:border-l-0"><SectionBar>Intervención (NIC)</SectionBar><div className="space-y-2 p-2">{(plan.interventions || []).map((n, i) => <div key={i} className="text-xs"><p className="font-bold text-slate-900">{i + 1}. {n.nic} {n.code && `(${n.code})`}</p>{n.activities?.length > 0 && <ul className="ml-4 list-disc text-slate-600">{n.activities.map((a, j) => <li key={j}>{a}</li>)}</ul>}{n.rationale && <p className="mt-1 border-t border-slate-200 pt-1 text-slate-600"><span className="font-semibold">Fundamentación:</span> {n.rationale}</p>}</div>)}</div></div>
        </div>
        <div className="mt-4 grid gap-0 md:grid-cols-2">
          <div className="border border-slate-300"><SectionBar>Ejecución</SectionBar><div className="min-h-24 p-2 text-xs text-slate-700">{plan.execution || "—"}</div></div>
          <div className="border border-slate-300 md:border-l-0"><SectionBar>Evaluación</SectionBar><div className="min-h-24 p-2 text-xs text-slate-700">{plan.evaluation || "—"}</div></div>
        </div>
        {plan.scale_assessments?.length > 0 && <div className="mt-4 border border-slate-300"><SectionBar>Escalas de Valoración Aplicadas</SectionBar><div className="p-2"><table className="w-full text-xs"><thead><tr className="bg-slate-100"><th className="border border-slate-300 px-2 py-1 text-left">Escala</th><th className="border border-slate-300 px-2 py-1 text-left">Puntuación</th><th className="border border-slate-300 px-2 py-1 text-left">Interpretación</th></tr></thead><tbody>{plan.scale_assessments.map((s, i) => <tr key={i}><td className="border border-slate-300 px-2 py-1 font-semibold text-slate-900">{s.scale}</td><td className="border border-slate-300 px-2 py-1">{s.score}</td><td className="border border-slate-300 px-2 py-1 text-slate-700">{s.interpretation}</td></tr>)}</tbody></table></div></div>}
        <div className="mt-4 border border-slate-300"><SectionBar>Indicadores / Escala de Medición / Puntuación Diana</SectionBar><div className="p-2 text-xs text-slate-700"><ul className="ml-4 list-disc">{(plan.outcomes || []).map((o, i) => <li key={i}>{o.noc}: Inicial {o.scale_initial || "—"} → Esperada {o.scale_expected || "—"}</li>)}</ul><p className="mt-2 font-bold text-slate-900">Puntuación Diana: {plan.diana_score || "—"}</p></div></div>
        <div className="mt-4 grid gap-0 md:grid-cols-2">
          <div className="border border-slate-300"><SectionBar>Educación al Paciente y Cuidador</SectionBar><div className="min-h-24 p-2 text-xs text-slate-700">{plan.patient_education || "—"}</div></div>
          <div className="border border-slate-300 md:border-l-0"><SectionBar>Recomendaciones de Seguimiento</SectionBar><div className="min-h-24 p-2 text-xs text-slate-700">{plan.follow_up || "—"}</div></div>
        </div>
      </div>
    </div>
  </div>;
}