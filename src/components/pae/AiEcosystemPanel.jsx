import { Brain, MessageSquare, Database, Search, FileText, Image, Mic, BarChart3, Sparkles, ArrowRight } from "lucide-react";

const COMPONENTS = [
  { name: "IA Conversacional", icon: MessageSquare, desc: "Chat clínico con comprensión de lenguaje natural y contexto", color: "bg-sky-50 text-sky-700" },
  { name: "Motor de Razonamiento Clínico", icon: Brain, desc: "Análisis de valoración, priorización y generación de NANDA-NOC-NIC", color: "bg-violet-50 text-violet-700" },
  { name: "Sistema RAG", icon: Database, desc: "Recuperación de documentos autorizados: guías, protocolos, manuales", color: "bg-emerald-50 text-emerald-700" },
  { name: "Búsqueda Científica", icon: Search, desc: "Búsqueda y resumen de evidencia científica con citación de fuentes", color: "bg-amber-50 text-amber-700" },
  { name: "Procesamiento de Documentos", icon: FileText, desc: "Extracción y estructuración de información de archivos cargados", color: "bg-teal-50 text-teal-700" },
  { name: "Procesamiento de Imágenes", icon: Image, desc: "Apoyo en análisis de heridas, lesiones, ostomías (no diagnóstico)", color: "bg-rose-50 text-rose-700" },
  { name: "Procesamiento de Voz", icon: Mic, desc: "Dictado clínico, conversación por voz y conversión voz-texto", color: "bg-indigo-50 text-indigo-700" },
  { name: "Generación de Reportes", icon: FileText, desc: "Síntesis automática de evoluciones, resúmenes y documentos", color: "bg-orange-50 text-orange-700" },
  { name: "Analítica", icon: BarChart3, desc: "Métricas de uso, detección de tendencias y optimización", color: "bg-pink-50 text-pink-700" }
];

const PRINCIPLES = [
  { title: "IA explicable", text: "Cada recomendación incluye el razonamiento que la sustenta. El usuario siempre sabe por qué la IA sugiere algo." },
  { title: "Basada en evidencia", text: "Las respuestas se fundamentan en fuentes verificables. Se diferencia entre evidencia sólida, limitada y ausente." },
  { title: "Apoyo, no sustitución", text: "La IA asiste el razonamiento clínico sin reemplazar el juicio profesional. Toda decisión es validada por el usuario." },
  { title: "Privacidad por diseño", text: "La IA no utiliza datos privados de un usuario para responder a otro. El entrenamiento futuro requiere anonimización." },
  { title: "Transparencia sobre limitaciones", text: "La IA indica claramente cuando no tiene información suficiente y solicita aclaraciones." },
  { title: "Arquitectura agnóstica", text: "El sistema permite incorporar nuevos modelos de IA sin rediseñar la arquitectura." }
];

export default function AiEcosystemPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Ecosistema de IA</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Motor de Inteligencia Artificial</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Ecosistema de IA seguro, explicable y basado en evidencia científica, diseñado para asistir el razonamiento clínico sin sustituir el criterio profesional.</p>
      </div>

      <div className="mb-6 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
        <h3 className="mb-3 flex items-center gap-2 font-bold text-[#002D62]"><Sparkles className="h-5 w-5" />Flujo del razonamiento clínico</h3>
        <div className="flex flex-wrap items-center gap-2 text-sm">
          {["Valoración del paciente", "Análisis de IA", "RAG (evidencia)", "Razonamiento", "NANDA-NOC-NIC", "Validación humana"].map((node, i, arr) => (
            <span key={node} className="flex items-center gap-2">
              <span className="rounded-lg bg-white px-3 py-1.5 font-medium text-slate-700 shadow-sm border border-slate-200">{node}</span>
              {i < arr.length - 1 && <ArrowRight className="h-4 w-4 text-[#00A8B5]" />}
            </span>
          ))}
        </div>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Componentes del ecosistema</h3>
      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COMPONENTS.map((c) => {
          const Icon = c.icon;
          return (
            <div key={c.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${c.color}`}><Icon className="h-5 w-5" /></div>
              <h4 className="text-sm font-bold text-slate-900">{c.name}</h4>
              <p className="mt-1 text-xs text-slate-600">{c.desc}</p>
            </div>
          );
        })}
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Principios de la IA</h3>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {PRINCIPLES.map((p) => (
          <div key={p.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="mb-1 text-sm font-bold text-[#002D62]">{p.title}</h4>
            <p className="text-xs text-slate-600">{p.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}