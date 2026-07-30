import { Layers, Cloud, Database, Brain, Shield, Smartphone, GitBranch, Server, Zap, Eye } from "lucide-react";

const MODULES = [
  { name: "Autenticación", icon: Shield, desc: "OAuth, MFA, gestión de sesiones y tokens" },
  { name: "Usuarios y Perfil", icon: Layers, desc: "Gestión de cuentas, roles y preferencias" },
  { name: "Historia Clínica", icon: Database, desc: "Registro clínico estructurado de pacientes" },
  { name: "PAE", icon: GitBranch, desc: "Planes de cuidado con NANDA-I, NOC, NIC" },
  { name: "Motor de IA", icon: Brain, desc: "Chat clínico, razonamiento, generación de PAE, RAG" },
  { name: "Biblioteca", icon: Database, desc: "Guías clínicas y evidencia científica curada" },
  { name: "Escalas", icon: Zap, desc: "Escalas clínicas validadas con cálculo automático" },
  { name: "Marketplace", icon: Layers, desc: "Cursos, plantillas, protocolos y casos clínicos" },
  { name: "Suscripciones", icon: Shield, desc: "Planes SaaS, pagos y licencias institucionales" },
  { name: "Reportes", icon: Eye, desc: "Indicadores, analítica y exportación institucional" },
  { name: "Administración", icon: Server, desc: "Super Admin, configuración global y auditoría" },
  { name: "Notificaciones", icon: Zap, desc: "Push, email e in-app" }
];

const STACK = [
  { layer: "Frontend", tech: "React + Tailwind CSS (Web), React Native (iOS/Android)", icon: Smartphone },
  { layer: "Backend", tech: "API REST/GraphQL, microservicios, serverless", icon: Server },
  { layer: "Base de datos", tech: "PostgreSQL (transaccional) + Redis (caché) + S3 (archivos)", icon: Database },
  { layer: "Motor de IA", tech: "LLM + RAG + embeddings sobre documentos autorizados", icon: Brain },
  { layer: "Infraestructura", tech: "Cloud multi-región, contenedores, CDN, auto-scaling", icon: Cloud },
  { layer: "Seguridad", tech: "Cifrado AES-256, TLS 1.3, RBAC, MFA, auditoría", icon: Shield }
];

export default function ArchitecturePanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Arquitectura empresarial</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Arquitectura del sistema</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Plataforma SaaS modular, escalable y segura, preparada para millones de usuarios con estructura multi-tenant y privacidad por diseño.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
        <h3 className="mb-3 font-bold text-[#002D62]">Flujo arquitectónico</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["Cliente (Web/Mobile)", "CDN", "API Gateway", "Microservicios", "Base de datos", "Motor de IA"].map((node, i, arr) => (
            <span key={node} className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm border border-slate-200">{node}</span>
              {i < arr.length - 1 && <span className="text-[#00A8B5]">→</span>}
            </span>
          ))}
        </div>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Stack tecnológico</h3>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {STACK.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.layer} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 flex items-center gap-2"><Icon className="h-4 w-4 text-[#00A8B5]" /><span className="text-sm font-bold text-slate-900">{s.layer}</span></div>
              <p className="text-sm text-slate-600">{s.tech}</p>
            </div>
          );
        })}
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Arquitectura modular</h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {MODULES.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.name} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 inline-flex rounded-lg bg-[#002D62]/10 p-2 text-[#002D62]"><Icon className="h-4 w-4" /></div>
              <h4 className="text-sm font-bold text-slate-900">{m.name}</h4>
              <p className="mt-1 text-xs text-slate-500">{m.desc}</p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-2 font-bold text-[#002D62]">Multi-tenant</h4>
          <p className="text-sm text-slate-600">Aislamiento de datos por usuario e institución. Cada tenant opera de forma independiente con su propia base lógica.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-2 font-bold text-[#002D62]">Escalabilidad horizontal</h4>
          <p className="text-sm text-slate-600">Microservicios independientes con auto-scaling. Cada módulo escala según demanda sin afectar a los demás.</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h4 className="mb-2 font-bold text-[#002D62]">Alta disponibilidad</h4>
          <p className="text-sm text-slate-600">Despliegue multi-región con failover automático. Objetivo de 99.9% de uptime.</p>
        </div>
      </div>
    </section>
  );
}