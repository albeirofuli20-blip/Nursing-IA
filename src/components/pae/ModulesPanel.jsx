import { Users, FileText, ClipboardCheck, Brain, MessageSquare, Pill, Scale, FlaskConical, Stethoscope, HeartHandshake, GraduationCap, BookOpen, Building2, BarChart3, Settings, ShoppingBag, Bell, Layers } from "lucide-react";

const MODULES = [
  { n: 1, name: "Gestión de Usuarios", icon: Users, desc: "Registro, login, MFA, perfil, roles y dispositivos", users: "Todos", color: "bg-sky-50 text-sky-700" },
  { n: 2, name: "Historia Clínica", icon: FileText, desc: "Historia clínica inteligente de enfermería", users: "Profesional, Docente", color: "bg-violet-50 text-violet-700" },
  { n: 3, name: "Valoración", icon: ClipboardCheck, desc: "Modelos: Henderson, Gordon, Orem, Roy, Neuman, Leininger", users: "Profesional, Estudiante", color: "bg-emerald-50 text-emerald-700" },
  { n: 4, name: "Motor del PAE", icon: Brain, desc: "Generación automática de NANDA-I, NOC, NIC con IA", users: "Todos", color: "bg-[#00A8B5]/10 text-[#00A8B5]" },
  { n: 5, name: "IA Clínica", icon: MessageSquare, desc: "Chat, razonamiento, interpretación de labs, evidencia", users: "Todos", color: "bg-amber-50 text-amber-700" },
  { n: 6, name: "Medicamentos", icon: Pill, desc: "Indicaciones, interacciones, dosis, diluciones, alertas", users: "Profesional, Estudiante", color: "bg-rose-50 text-rose-700" },
  { n: 7, name: "Escalas Clínicas", icon: Scale, desc: "Glasgow, Braden, Barthel, Morse, NEWS2, SOFA, APGAR", users: "Todos", color: "bg-teal-50 text-teal-700" },
  { n: 8, name: "Laboratorios", icon: FlaskConical, desc: "Interpretación de resultados, alertas y tendencias", users: "Profesional", color: "bg-indigo-50 text-indigo-700" },
  { n: 9, name: "Procedimientos", icon: Stethoscope, desc: "Biblioteca multimedia, guías paso a paso, checklists", users: "Todos", color: "bg-orange-50 text-orange-700" },
  { n: 10, name: "Comunidad y APS", icon: HeartHandshake, desc: "RIAS, caracterización familiar, visitas, tamizajes", users: "Profesional", color: "bg-green-50 text-green-700" },
  { n: 11, name: "Educación al Paciente", icon: GraduationCap, desc: "Plan educativo, indicaciones de alta, material descargable", users: "Profesional", color: "bg-cyan-50 text-cyan-700" },
  { n: 12, name: "Docentes", icon: BookOpen, desc: "Casos clínicos, evaluación, rúbricas, retroalimentación", users: "Docente", color: "bg-purple-50 text-purple-700" },
  { n: 13, name: "Investigación", icon: Layers, desc: "Biblioteca científica, referencias, gestión de proyectos", users: "Profesional, Docente", color: "bg-blue-50 text-blue-700" },
  { n: 14, name: "Hospitales", icon: Building2, desc: "Indicadores, calidad, auditorías, seguridad del paciente", users: "Admin institucional", color: "bg-slate-100 text-slate-700" },
  { n: 15, name: "Reportes", icon: BarChart3, desc: "PDF, Word, Excel, paneles gráficos e históricos", users: "Todos", color: "bg-pink-50 text-pink-700" },
  { n: 16, name: "Administración", icon: Settings, desc: "Super Admin: usuarios, planes, pagos, contenidos, auditoría", users: "Super Admin", color: "bg-[#002D62]/10 text-[#002D62]" },
  { n: 17, name: "Marketplace", icon: ShoppingBag, desc: "Cursos, casos, protocolos, plantillas, recursos", users: "Todos", color: "bg-fuchsia-50 text-fuchsia-700" },
  { n: 18, name: "Notificaciones", icon: Bell, desc: "Recordatorios, alertas clínicas, avisos académicos", users: "Todos", color: "bg-yellow-50 text-yellow-700" }
];

export default function ModulesPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Especificación funcional</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Catálogo de módulos</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Los 18 módulos funcionales de Nurse Master IA. Cada módulo es independiente, auditable y se integra con IA manteniendo privacidad por diseño.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.n} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center justify-between">
                <div className={`inline-flex rounded-xl p-2.5 ${m.color}`}><Icon className="h-5 w-5" /></div>
                <span className="text-xs font-bold text-slate-300">M{String(m.n).padStart(2, "0")}</span>
              </div>
              <h3 className="font-bold text-slate-900">{m.name}</h3>
              <p className="mt-1 flex-1 text-sm text-slate-600">{m.desc}</p>
              <p className="mt-3 text-xs font-medium text-slate-400">Usuarios: {m.users}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}