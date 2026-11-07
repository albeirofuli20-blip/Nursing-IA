import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import SivigilaHeader from "@/components/sivigila/SivigilaHeader";
import SivigilaDashboard from "@/components/sivigila/SivigilaDashboard";
import FichasTable from "@/components/sivigila/FichasTable";
import FichaForm from "@/components/sivigila/FichaForm";
import FichaDetail from "@/components/sivigila/FichaDetail";
import AlertasPanel from "@/components/sivigila/AlertasPanel";
import { esGrave } from "@/lib/sivigila";

const TABS = [
  ["semana", "Semana actual"],
  ["fichas", "Fichas"],
  ["form", "Nueva / editar ficha"],
  ["alertas", "Alertas"],
];

export default function SivigilaDengue() {
  const [data, setData] = useState({ user: null, fichas: [], patients: [], plans: [] });
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("semana");
  const [editing, setEditing] = useState(null);
  const [detail, setDetail] = useState(null);
  const [formPatient, setFormPatient] = useState(null);
  const [prefillId] = useState(() => new URLSearchParams(window.location.search).get("ficha"));

  async function load() {
    const user = await base44.auth.me();
    const [fichas, patients, plans] = await Promise.all([
      base44.entities.SivigilaFicha.list("-created_date"),
      base44.entities.Patient.list("-updated_date"),
      base44.entities.CarePlan.list("-updated_date"),
    ]);
    setData({ user, fichas, patients, plans });
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;

  const rol = data.user?.role === "admin" ? "admin" : data.user?.sivigila_rol || "coordinador";
  const municipioScope = rol === "notificador" ? data.user?.sivigila_municipio : "";
  const fichas = municipioScope ? data.fichas.filter((f) => f.municipio === municipioScope) : data.fichas;
  const gravesTardias = fichas.filter((f) => esGrave(f) && !f.notificado_oportunamente).length;
  const pacientePrefill = formPatient || (prefillId ? data.patients.find((p) => p.id === prefillId) : null);
  const planAsociado = detail?.care_plan_id ? data.plans.find((p) => p.id === detail.care_plan_id) : null;
  const canEdit = (ficha) => data.user?.role === "admin" || ficha?.created_by_id === data.user?.id;

  const abrirNueva = () => { setEditing(null); setFormPatient(null); setTab("form"); };
  const abrirEdicion = (ficha) => { setEditing(ficha); setFormPatient(null); setTab("form"); };
  const notificarPaciente = (patient) => { setEditing(null); setFormPatient(patient); setTab("form"); };

  async function alGuardar() {
    await load();
    setEditing(null);
    setFormPatient(null);
    setDetail(null);
    setTab("fichas");
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <SivigilaHeader user={data.user} />
      <nav className="sticky top-0 z-10 border-b bg-white">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">
          {TABS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => { if (id === "form") { setEditing(null); setFormPatient(null); } setTab(id); }}
              className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${tab === id ? "border-[#00A8B5] text-[#002D62]" : "border-transparent text-slate-500 hover:text-slate-800"}`}
            >
              {label}
              {id === "fichas" && <span className="ml-1.5 rounded-full bg-slate-100 px-1.5 py-0.5 text-[11px] text-slate-600">{fichas.length}</span>}
              {id === "alertas" && gravesTardias > 0 && <span className="ml-1.5 rounded-full bg-red-100 px-1.5 py-0.5 text-[11px] font-semibold text-red-700">{gravesTardias}</span>}
            </button>
          ))}
        </div>
      </nav>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {tab === "semana" && <SivigilaDashboard fichas={fichas} municipio={municipioScope} />}
        {tab === "fichas" && <FichasTable fichas={fichas} onNew={abrirNueva} onOpen={setDetail} onEdit={abrirEdicion} canEdit={canEdit} />}
        {tab === "form" && (
          <FichaForm
            key={editing?.id || pacientePrefill?.id || "nueva"}
            ficha={editing}
            prefillPatient={pacientePrefill}
            fichas={data.fichas}
            patients={data.patients}
            plans={data.plans}
            user={data.user}
            onSaved={alGuardar}
            onCancel={() => { setEditing(null); setFormPatient(null); setTab("fichas"); }}
          />
        )}
        {tab === "alertas" && <AlertasPanel fichas={fichas} patients={data.patients} onOpen={(f) => { setDetail(f); setTab("fichas"); }} onNotify={notificarPaciente} />}
      </main>
      {detail && (
        <FichaDetail
          key={detail.id}
          ficha={detail}
          plan={planAsociado}
          canEdit={canEdit(detail)}
          onClose={() => setDetail(null)}
          onEdit={(f) => { setDetail(null); abrirEdicion(f); }}
          onUpdated={(f) => setDetail(f)}
          onDeleted={async () => { setDetail(null); await load(); }}
        />
      )}
    </div>
  );
}