import { ArrowLeft, Download, FileText } from "lucide-react";
import moment from "moment";
import { Button } from "@/components/ui/button";
import { exportPaeIntraPdf, exportPaeIntraWord } from "@/lib/exportPlan";

const GREEN_BG = "#d4edda";
const GREEN_BAR = "#8DC63F";

function SubHeader({ children }) {
  return <div className="bg-[#8DC63F] px-2 py-1 text-[10px] font-bold uppercase text-white">{children}</div>;
}

function Cell({ label, value }) {
  return <div className="border border-black px-2 py-1"><span className="text-[10px] font-bold uppercase text-slate-700">{label}</span><p className="text-sm text-black">{value || "—"}</p></div>;
}

function Bullets({ items }) {
  if (!items?.length) return <p className="text-xs text-slate-500">—</p>;
  return <ul className="ml-4 list-disc text-xs text-black">{items.map((x, i) => <li key={i}>{x}</li>)}</ul>;
}

function DiagnosesPage({ plan, d, o, n, i }) {
  const factors = (d.related_to || "").split(/[,;]\s*/).filter(Boolean);
  const characteristics = (d.evidence || "").split(/[,;]\s*/).filter(Boolean);
  const indicators = o.indicators || [];
  return <div className={`border border-black ${i > 0 ? "break-before-page mt-4" : ""}`}>
    <table className="w-full border-collapse text-xs">
      <tbody>
        {/* Row 1 */}
        <tr>
          <td className="align-top" style={{ width: "50%", border: "1px solid #000" }}>
            <SubHeader>Diagnóstico Enfermero (Etiqueta NANDA)</SubHeader>
            <div className="p-2 text-black">
              <p className="font-bold">{d.nanda || "—"} {d.code && `(${d.code})`}</p>
              <p className="mt-1">Relacionado con {d.related_to || "—"}, manifestado por {d.evidence || "—"}.</p>
            </div>
          </td>
          <td className="align-top" style={{ width: "50%", border: "1px solid #000" }}>
            <SubHeader>Intervención: (NIC)</SubHeader>
            <div className="p-2 text-black">
              <p className="font-bold">{n.nic || "—"} {n.code && `(${n.code})`}</p>
              <Bullets items={n.activities} />
            </div>
          </td>
        </tr>
        {/* Row 2 */}
        <tr>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Factores Relacionados: (Causas) E:</SubHeader>
            <div className="p-2"><Bullets items={factors} /></div>
            <SubHeader>Características Definitorias (Signos y Síntomas)</SubHeader>
            <div className="p-2"><Bullets items={characteristics} /></div>
          </td>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Actividades:</SubHeader>
            <div className="p-2"><Bullets items={n.activities} /></div>
          </td>
        </tr>
        {/* Row 3 */}
        <tr>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Resultado Esperado: (NOC)</SubHeader>
            <div className="p-2 text-black">
              <p className="font-bold">{o.noc || "—"} {o.code && `(${o.code})`}</p>
              <p className="mt-1">{o.definition || ""}</p>
            </div>
          </td>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Indicadores / Escala de Medición / Puntuación Diana</SubHeader>
            <div className="p-2 text-black">
              <Bullets items={indicators} />
              <p className="mt-2">Escala: Inicial {o.scale_initial || "—"} → Esperada {o.scale_expected || "—"}</p>
              <p className="mt-1 font-bold">Puntuación Diana: {plan.diana_score || "—"}</p>
            </div>
          </td>
        </tr>
        {/* Row 4 */}
        <tr>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Educación al Paciente y Cuidador</SubHeader>
            <div className="p-2 text-black">
              <Bullets items={(plan.patient_education || "").split("\n").filter(Boolean)} />
            </div>
          </td>
          <td className="align-top" style={{ border: "1px solid #000" }}>
            <SubHeader>Recomendaciones de Seguimiento</SubHeader>
            <div className="p-2 text-black">
              <Bullets items={(plan.follow_up || "").split("\n").filter(Boolean)} />
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>;
}

export default function PaeDocumentIntra({ plan, patient, onBack }) {
  const p = patient || { full_name: plan.patient_name, code: plan.medical_record, birth_date: null };
  const age = p.birth_date ? `${moment().diff(moment(p.birth_date), "years")} años` : "—";
  const diagnoses = plan.diagnoses?.length ? plan.diagnoses : [{}];
  return <div className="min-h-screen bg-slate-100 py-6 print:bg-white print:py-0">
    <div className="mx-auto max-w-5xl px-4 print:px-0">
      <div className="mb-4 flex items-center justify-between print:hidden"><Button variant="ghost" onClick={onBack}><ArrowLeft className="mr-2 h-4 w-4" />Volver</Button><div className="flex gap-2"><Button variant="outline" onClick={() => exportPaeIntraPdf(plan, patient)}><Download className="mr-1 h-4 w-4" />PDF</Button><Button variant="outline" onClick={() => exportPaeIntraWord(plan, patient)}><FileText className="mr-1 h-4 w-4" />Word</Button></div></div>
      <div className="rounded-lg bg-white p-6 shadow-md print:shadow-none">
        <header className="flex items-start justify-between border-b-2 border-black pb-3">
          <div><div className="text-2xl font-bold text-[#8DC63F]">AREANDINA</div><div className="text-[10px] font-semibold text-slate-700">Fundación Universitaria del Área Andina</div></div>
          <div className="text-center text-[11px] font-bold uppercase leading-tight text-black">Facultad Ciencias de la Salud<br />Enfermería</div>
          <table className="text-[10px]"><tbody><tr><td className="border border-black px-2 py-0.5 font-bold">VERSIÓN:</td><td className="border border-black px-2 py-0.5">{plan.version || "01"}</td></tr><tr><td className="border border-black px-2 py-0.5 font-bold">CÓDIGO:</td><td className="border border-black px-2 py-0.5">{plan.code || "—"}</td></tr><tr><td className="border border-black px-2 py-0.5 font-bold">FECHA:</td><td className="border border-black px-2 py-0.5">{plan.pae_date || "—"}</td></tr></tbody></table>
        </header>
        <div className="my-3 py-2 text-center text-sm font-bold uppercase text-black" style={{ background: GREEN_BG }}>Plan de Atención de Enfermería</div>
        <section className="grid grid-cols-2 gap-0">
          <Cell label="Nombres y Apellidos" value={p.full_name} /><Cell label="Servicio" value={plan.service} />
          <Cell label="Edad" value={age} /><Cell label="N° de Cama" value={plan.bed_number} />
          <Cell label="N° de Historia Clínica" value={plan.medical_record || p.code} /><Cell label="N° de Ingreso" value={plan.admission_number} />
          <div className="col-span-2 border border-black px-2 py-1"><span className="text-[10px] font-bold uppercase text-slate-700">Diagnóstico Médico</span><p className="text-sm text-black">{plan.medical_diagnosis || "—"}</p></div>
        </section>
        {diagnoses.map((d, i) => <DiagnosesPage key={i} plan={plan} d={d} o={plan.outcomes?.[i] || {}} n={plan.interventions?.[i] || {}} i={i} />)}
      </div>
    </div>
  </div>;
}