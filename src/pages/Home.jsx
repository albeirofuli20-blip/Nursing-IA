import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import DashboardHeader from "@/components/pae/DashboardHeader";
import Overview from "@/components/pae/Overview";
import PatientsPanel from "@/components/pae/PatientsPanel";
import GuidesPanel from "@/components/pae/GuidesPanel";
import PlansPanel from "@/components/pae/PlansPanel";
import UsersPanel from "@/components/pae/UsersPanel";

export default function Home() {
  const [data, setData] = useState({ user: null, patients: [], guides: [], plans: [], users: [] }); const [tab, setTab] = useState("resumen"); const [loading, setLoading] = useState(true);
  async function load() { const user = await base44.auth.me(); const [patients, guides, plans, users] = await Promise.all([base44.entities.Patient.list("-updated_date"), base44.entities.Guide.list("-updated_date"), base44.entities.CarePlan.list("-updated_date"), user.role === "admin" ? base44.entities.User.list() : Promise.resolve([])]); setData({ user, patients, guides, plans, users }); setLoading(false); }
  useEffect(() => { load(); }, []);
  const tabs = [["resumen", "Resumen"], ["pacientes", "Pacientes"], ["guias", "Guías"], ["planes", "Planes PAE"], ...(data.user?.role === "admin" ? [["usuarios", "Usuarios"]] : [])];
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-100 border-t-teal-700" /></div>;
  return <div className="min-h-screen bg-slate-50"><DashboardHeader user={data.user} /><nav className="sticky top-0 z-10 border-b bg-white"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)} className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${tab === id ? "border-teal-700 text-teal-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div></nav><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{tab === "resumen" && <Overview patients={data.patients.length} guides={data.guides.filter(g => g.status === "vigente").length} plans={data.plans.length} />}{tab === "pacientes" && <PatientsPanel patients={data.patients} refresh={load} />}{tab === "guias" && <GuidesPanel guides={data.guides} user={data.user} refresh={load} />}{tab === "planes" && <PlansPanel plans={data.plans} patients={data.patients} guides={data.guides} refresh={load} />}{tab === "usuarios" && <UsersPanel users={data.users} refresh={load} />}</main></div>;
}