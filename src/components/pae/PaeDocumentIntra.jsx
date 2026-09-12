import { ArrowLeft, Download, FileText } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { exportPaeIntraPdf, exportPaeIntraWord } from "@/lib/exportPlan";

function Cell({ label, value }) {
  return <div className="border border-slate-300 px-2 py-1.5"><span className="text-[10px] font-bold uppercase text-slate-500">{label}</span><p className="text-sm text-slate-900">{value || "—"}</p></div>;
}

function Bar({ children }) {
  return <div className="bg-[#8DC63F] px-2 py-1 text-[11px] font-bold uppercase text-white">{children}</div>;
}

export default function PaeDocumentIntra({ plan, patient, onBack }) {
  const p = patient || { full_name: plan.patient_name, code: plan.medical_record, birth_date: null };
  const age = p.birth_date ? `${moment().diff(moment(p.birth_date), "years")} años` : "—";
  const diagnoses = plan.diagnoses?.length ? plan.diagnoses : [{}];
  return <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
    <div className="mx-auto max-w-5xl px-4 print:px-0">
      <div className="mb-4 flex items-center justify-between print:hidden"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Volver</Button><div className="flex gap-2"><Button variant="outline" onClick={() => exportPaeIntraPdf(plan, patient)}><Download className="mr-1 h-4 w-4" />PDF</Button><Button variant="outline" onClick={() => exportPaeIntraWord(plan, patient)}><FileText className="mr-1 h-4 w-4" />Word</Button></div></div>
      <div className="rounded-lg bg-white p-6 shadow-md print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-[#8DC63F] pb-3">
          <div className="text-2xl font-bold text-[#8DC63F]">AREANDINA</div>
          <div className="text-center text-[11px] font-bold uppercase leading-tight text-slate-800">Facultad Ciencias de la Salud<br />Enfermería</div>
          <table className="text-[10px]"><tbody><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">VERSIÓN:</td><td className="border border-slate-300 px-2 py-0.5">{plan.version || "01"}</td></tr><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">CÓDIGO:</td><td className="border border-slate-300 px-2 py-0.5">{plan.code || "—"}</td></tr><tr><td className="border border-slate-300 px-2 py-0.5 font-bold">FECHA:</td><td className="border border-slate-300 px-2 py-0.5">{plan.pae_date || "—"}</td></tr></tbody></table>
        </header>
        <div className="my-3 bg-[#8DC63F] py-2 text-center text-sm font-bold uppercase text-white">Plan de Atención de Enfermería</div>
        <section className="grid grid-cols-2 gap-0 border border-slate-300">
          <Cell label="Nombres Apellidos" value={p.full_name} /><Cell label="Servicio" value={plan.service} />
          <Cell label="Edad" value={age} /><Cell label="N.° de Cama" value={plan.bed_number} />
          <Cell label="N.° de Historia Clínica" value={plan.medical_record || p.code} /><Cell label="N.° de Ingreso" value={plan.admission_number} />
          <div className="col-span-2 border border-slate-300 px-2 py-1.5"><span className="text-[10px] font-bold uppercase text-slate-500">Diagnóstico Médico</span><p className="text-sm text-slate-900">{plan.medical_diagnosis || "—"}</p></div>
        </section>
        {diagnoses.map((d, i) => {
          const o = plan.outcomes?.[i] || {}; const n = plan.interventions?.[i] || {};
          return <div key={i} className={`mt-4 flex border border-slate-300 ${i > 0 ? "break-before-page" : ""}`}>
            <div className="flex-1 border-r border-slate-300">
              <Bar>Diagnóstico Enfermero (Etiqueta NANDA)</Bar>
              <div className="p-2 text-xs text-slate-700"><p className="font-bold text-slate-900">{d.nanda || "—"} {d.code && `(${d.code})`}</p>{d.definition && <p className="mt-1">Definición: {d.definition}</p>}</div>
              <Bar>Factores Relacionados: (Causas) E:</Bar>
              <div className="p-2 text-xs text-slate-700">{d.related_to || "—"}</div>
              <Bar>Características Definitorias (Signos y Síntomas)</Bar>
              <div className="p-2 text-xs text-slate-700">{d.evidence || "—"}</div>
              <Bar>Resultado Esperado: (NOC)</Bar>
              <div className="p-2 text-xs text-slate-700"><p className="font-bold text-slate-900">{o.noc || "—"} {o.code && `(${o.code})`}</p>{o.indicators?.length > 0 && <ul className="ml-4 list-disc">{o.indicators.map((ind, j) => <li key={j}>{ind}</li>)}</ul>}</div>
              <Bar>Indicadores / Escala de Medición / Puntuación Diana</Bar>
              <div className="p-2 text-xs text-slate-700"><p>Escala: Inicial {o.scale_initial || "—"} → Esperada {o.scale_expected || "—"}</p><p className="mt-1 font-bold">Puntuación Diana: {plan.diana_score || "—"}</p></div>
            </div>
            <div className="flex flex-1 flex-col">
              <Bar>Intervención: (NIC)</Bar>
              <div className="p-2 text-xs text-slate-700"><p className="font-bold text-slate-900">{n.nic || "—"} {n.code && `(${n.code})`}</p></div>
              <Bar>Actividades:</Bar>
              <div className="flex-1 p-2 text-xs text-slate-700"><ul className="ml-4 list-disc">{(n.activities || []).map((a, j) => <li key={j}>{a}</li>)}</ul>{n.rationale && <p className="mt-2 border-t border-slate-200 pt-1"><span className="font-semibold">Fundamentación:</span> {n.rationale}</p>}</div>
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}