import { useEffect, useState } from "react";
import { base44 } from "@/api/base44Client";
import DashboardHeader from "@/components/pae/DashboardHeader";
import Overview from "@/components/pae/Overview";
import PatientsPanel from "@/components/pae/PatientsPanel";
import GuidesPanel from "@/components/pae/GuidesPanel";
import PlansPanel from "@/components/pae/PlansPanel";
import UsersPanel from "@/components/pae/UsersPanel";
import ScalesPanel from "@/components/pae/ScalesPanel";
import AiChat from "@/components/pae/AiChat";
import PricingPanel from "@/components/pae/PricingPanel";
import MarketplacePanel from "@/components/pae/MarketplacePanel";
import CoursesPanel from "@/components/pae/CoursesPanel";
import PrinciplesPanel from "@/components/pae/PrinciplesPanel";
import AdminDashboard from "@/components/pae/AdminDashboard";
import ArchitecturePanel from "@/components/pae/ArchitecturePanel";
import SecurityPanel from "@/components/pae/SecurityPanel";

export default function Home() {
  const [data, setData] = useState({ user: null, patients: [], guides: [], plans: [], users: [] }); const [tab, setTab] = useState("resumen"); const [loading, setLoading] = useState(true);
  async function load() { const user = await base44.auth.me(); const [patients, guides, plans, users] = await Promise.all([base44.entities.Patient.list("-updated_date"), base44.entities.Guide.list("-updated_date"), base44.entities.CarePlan.list("-updated_date"), user.role === "admin" ? base44.entities.User.list() : Promise.resolve([])]); setData({ user, patients, guides, plans, users }); setLoading(false); }
  useEffect(() => { load(); }, []);
  const tabs = [["resumen", "Resumen"], ["pacientes", "Pacientes"], ["guias", "Guías"], ["planes", "Planes PAE"], ["escalas", "Escalas"], ["chat", "Chat IA"], ["cursos", "Cursos"], ["marketplace", "Marketplace"], ["suscripciones", "Planes"], ["principios", "Principios"], ["seguridad", "Seguridad"], ...(data.user?.role === "admin" ? [["negocio", "Negocio"], ["arquitectura", "Arquitectura"], ["usuarios", "Usuarios"]] : [])];
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;
  return <div className="min-h-screen bg-slate-50"><DashboardHeader user={data.user} /><nav className="sticky top-0 z-10 border-b bg-white"><div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 sm:px-6">{tabs.map(([id, label]) => <button key={id} onClick={() => setTab(id)}           className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm font-medium transition ${tab === id ? "border-[#00A8B5] text-[#002D62]" : "border-transparent text-slate-500 hover:text-slate-800"}`}>{label}</button>)}</div></nav><main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">{tab === "resumen" && <Overview patients={data.patients.length} guides={data.guides.filter(g => g.status === "vigente").length} plans={data.plans.length} />}{tab === "pacientes" && <PatientsPanel patients={data.patients} refresh={load} />}{tab === "guias" && <GuidesPanel guides={data.guides} user={data.user} refresh={load} />}{tab === "planes" && <PlansPanel plans={data.plans} patients={data.patients} guides={data.guides} refresh={load} />}{tab === "escalas" && <ScalesPanel />}{tab === "chat" && <AiChat patients={data.patients} guides={data.guides} />}{tab === "cursos" && <CoursesPanel />}{tab === "marketplace" && <MarketplacePanel />}{tab === "suscripciones" && <PricingPanel user={data.user} />}{tab === "principios" && <PrinciplesPanel />}{tab === "seguridad" && <SecurityPanel />}{tab === "negocio" && data.user?.role === "admin" && <AdminDashboard users={data.users} patients={data.patients} plans={data.plans} guides={data.guides} />}{tab === "arquitectura" && data.user?.role === "admin" && <ArchitecturePanel />}{tab === "usuarios" && <UsersPanel users={data.users} refresh={load} />}</main></div>;
}