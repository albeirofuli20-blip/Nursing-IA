import { Users, ClipboardList, BookOpen, FileText, TrendingUp, DollarSign, Activity, UserCheck } from "lucide-react";

export default function AdminDashboard({ users, patients, plans, guides }) {
  const totalUsers = users.length;
  const activePlans = plans.filter((p) => p.status === "activo").length;
  const draftPlans = plans.filter((p) => p.status === "borrador").length;
  const vigentGuides = guides.filter((g) => g.status === "vigente").length;

  const kpis = [
    { label: "Usuarios totales", value: totalUsers, icon: Users, color: "bg-sky-50 text-sky-700" },
    { label: "Pacientes registrados", value: patients.length, icon: UserCheck, color: "bg-emerald-50 text-emerald-700" },
    { label: "Planes PAE activos", value: activePlans, icon: ClipboardList, color: "bg-violet-50 text-violet-700" },
    { label: "Planes en borrador", value: draftPlans, icon: FileText, color: "bg-amber-50 text-amber-700" },
    { label: "Guías vigentes", value: vigentGuides, icon: BookOpen, color: "bg-teal-50 text-teal-700" },
    { label: "Planes totales", value: plans.length, icon: TrendingUp, color: "bg-rose-50 text-rose-700" }
  ];

  const objectives = [
    { period: "Corto plazo (0–12 meses)", items: ["Lanzar MVP con PAE, escalas, guías y Chat IA", "10.000 usuarios registrados", "5 universidades piloto", "Validar modelo de privacidad"] },
    { period: "Mediano plazo (12–36 meses)", items: ["100.000 usuarios activos", "50 hospitales y 20 universidades", "Marketplace y certificaciones", "App móvil nativa", "Integraciones HL7/FHIR"] },
    { period: "Largo plazo (36–60 meses)", items: ["500.000 usuarios activos", "Liderazgo regional", "Módulos de investigación y APS", "Alianzas B2G en salud pública", "Expansión internacional"] }
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Panel del Super Administrador</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Indicadores del negocio</h2>
        <p className="mt-2 text-slate-600">Métricas clave de adopción, uso y crecimiento de la plataforma.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div key={k.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`mb-4 inline-flex rounded-xl p-2.5 ${k.color}`}><Icon className="h-5 w-5" /></div>
              <p className="text-3xl font-bold text-slate-900">{k.value}</p>
              <p className="text-sm text-slate-500">{k.label}</p>
            </div>
          );
        })}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        {objectives.map((obj) => (
          <div key={obj.period} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><Activity className="h-4 w-4" />{obj.period}</h3>
            <ul className="space-y-2">
              {obj.items.map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-slate-600"><span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#00A8B5]" />{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mt-6 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
        <h3 className="mb-2 flex items-center gap-2 font-bold text-[#002D62]"><DollarSign className="h-4 w-4" />Modelo de ingresos SaaS</h3>
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
          <span>• Suscripciones (Gratuito → Enterprise)</span>
          <span>• Licencias institucionales</span>
          <span>• Marketplace de contenido</span>
          <span>• Cursos y certificaciones</span>
          <span>• Biblioteca Premium</span>
          <span>• Consultoría e integraciones</span>
        </div>
      </div>
    </section>
  );
}