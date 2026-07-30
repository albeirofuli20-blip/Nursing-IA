import { Check, Sparkles, GraduationCap, Stethoscope, Building2, Crown } from "lucide-react";

const PLANS = [
  {
    id: "gratuito",
    name: "Gratuito",
    icon: Sparkles,
    price: "$0",
    period: "/mes",
    color: "border-slate-200",
    badge: null,
    features: ["PAE limitado (3/mes)", "Escalas básicas", "Chat IA (10 consultas/mes)", "Biblioteca pública", "Publicidad ética"]
  },
  {
    id: "premium-estudiante",
    name: "Premium Estudiante",
    icon: GraduationCap,
    price: "$6",
    period: "/mes",
    color: "border-[#00A8B5]",
    badge: "Popular",
    features: ["IA ilimitada", "PAE ilimitado", "Exportación PDF y Word", "Casos clínicos", "Simulador", "Biblioteca completa", "Sin publicidad"]
  },
  {
    id: "premium-profesional",
    name: "Premium Profesional",
    icon: Stethoscope,
    price: "$14",
    period: "/mes",
    color: "border-slate-200",
    badge: null,
    features: ["Todo lo de Estudiante", "Historia clínica", "Seguimiento de pacientes", "Escalas avanzadas", "Medicamentos", "Reportes clínicos", "Herramientas avanzadas"]
  },
  {
    id: "docente",
    name: "Docente",
    icon: GraduationCap,
    price: "$24",
    period: "/mes",
    color: "border-slate-200",
    badge: null,
    features: ["Todo lo de Profesional", "Creación de cursos", "Evaluación automática", "Rúbricas personalizadas", "Casos clínicos editables", "Panel de estudiantes"]
  },
  {
    id: "institucional",
    name: "Institucional",
    icon: Building2,
    price: "Cotización",
    period: "",
    color: "border-slate-200",
    badge: null,
    features: ["Usuarios ilimitados", "Universidades/Hospitales", "Panel administrativo", "Indicadores e reportes", "Integraciones", "Soporte prioritario"]
  },
  {
    id: "enterprise",
    name: "Enterprise",
    icon: Crown,
    price: "Cotización",
    period: "",
    color: "border-[#002D62]",
    badge: "Premium",
    features: ["Implementación personalizada", "Marca blanca (White Label)", "Integraciones HL7/FHIR", "Soporte 24/7 + SLA", "Capacitación dedicada", "Despliegue dedicado"]
  }
];

export default function PricingPanel({ user }) {
  return (
    <section>
      <div className="mb-6 text-center">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Planes de suscripción</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Elige el plan ideal para ti</h2>
        <p className="mt-2 text-slate-600">Modelo SaaS flexible. Cancela cuando quieras. Precios en USD.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PLANS.map((plan) => {
          const Icon = plan.icon;
          return (
            <div key={plan.id} className={`relative rounded-2xl border-2 bg-white p-6 shadow-sm ${plan.color}`}>
              {plan.badge && (
                <span className="absolute -top-3 right-4 rounded-full bg-[#00A8B5] px-3 py-1 text-xs font-semibold text-white">{plan.badge}</span>
              )}
              <div className="mb-4 inline-flex rounded-xl bg-[#002D62]/10 p-3 text-[#002D62]"><Icon className="h-6 w-6" /></div>
              <h3 className="text-lg font-bold text-slate-900">{plan.name}</h3>
              <p className="mt-1"><span className="text-3xl font-bold text-slate-900">{plan.price}</span><span className="text-sm text-slate-500">{plan.period}</span></p>
              <ul className="mt-4 space-y-2">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-slate-600"><Check className="mt-0.5 h-4 w-4 shrink-0 text-[#00A8B5]" />{f}</li>
                ))}
              </ul>
              <button className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition ${plan.id === "gratuito" ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-[#002D62] text-white hover:bg-[#001f4d]"}`}>
                {plan.price === "Cotización" ? "Contactar ventas" : plan.id === "gratuito" ? "Comenzar gratis" : "Suscribirse"}
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
}