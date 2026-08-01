import { Brain, Database, Sliders, BarChart3, DollarSign, FileCheck, Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const MODELS = [
  { name: "Gemini 3 Flash", type: "Conversacional", status: "Activo", cost: "Bajo", quality: "Estándar" },
  { name: "Claude Sonnet 4.6", type: "Razonamiento clínico", status: "Activo", cost: "Medio", quality: "Alta" },
  { name: "GPT-5 Mini", type: "Resúmenes", status: "Activo", cost: "Bajo", quality: "Estándar" },
  { name: "Claude Opus 4.8", type: "Casos complejos", status: "Inactivo", cost: "Alto", quality: "Máxima" }
];

const DOCUMENTS = [
  { name: "Guía NANDA-I 2024-2026", type: "Taxonomía", status: "Indexado", chunks: 1240 },
  { name: "Protocolo úlceras por presión", type: "Protocolo", status: "Indexado", chunks: 85 },
  { name: "Manual de procedimientos de enfermería", type: "Manual", status: "Indexado", chunks: 520 },
  { name: "Guía NOC 7ª edición", type: "Taxonomía", status: "Indexado", chunks: 980 },
  { name: "Guía NIC 7ª edición", type: "Taxonomía", status: "Indexado", chunks: 1100 },
  { name: "RIAS Ministerio de Salud", type: "Norma", status: "Pendiente", chunks: 0 }
];

const METRICS = [
  { label: "Consultas IA (mes)", value: "12.480", icon: Brain, color: "bg-sky-50 text-sky-700" },
  { label: "PAE generados con IA", value: "3.260", icon: FileCheck, color: "bg-emerald-50 text-emerald-700" },
  { label: "Documentos RAG indexados", value: "48", icon: Database, color: "bg-violet-50 text-violet-700" },
  { label: "Costo mensual (créditos)", value: "8.200", icon: DollarSign, color: "bg-amber-50 text-amber-700" }
];

export default function AiConfigPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Configuración de IA</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Panel de gestión de IA</h2>
        <p className="mt-2 text-slate-600">El Super Administrador configura modelos, administra documentos autorizados, ajusta parámetros y supervisa métricas —sin acceder al contenido privado de los usuarios.</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => {
          const Icon = m.icon;
          return (
            <div key={m.label} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className={`mb-3 inline-flex rounded-xl p-2.5 ${m.color}`}><Icon className="h-5 w-5" /></div>
              <p className="text-2xl font-bold text-slate-900">{m.value}</p>
              <p className="text-sm text-slate-500">{m.label}</p>
            </div>
          );
        })}
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900"><Brain className="h-5 w-5 text-[#002D62]" />Modelos de IA</h3>
      <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-[#002D62] text-white">
            <tr><th className="px-4 py-3 text-left font-semibold">Modelo</th><th className="px-4 py-3 text-left font-semibold">Uso</th><th className="px-4 py-3 text-left font-semibold">Estado</th><th className="px-4 py-3 text-left font-semibold">Costo</th><th className="px-4 py-3 text-left font-semibold">Calidad</th></tr>
          </thead>
          <tbody>
            {MODELS.map((m, i) => (
              <tr key={m.name} className={i % 2 === 0 ? "bg-white" : "bg-slate-50"}>
                <td className="px-4 py-3 font-medium text-slate-900">{m.name}</td>
                <td className="px-4 py-3 text-slate-600">{m.type}</td>
                <td className="px-4 py-3"><Badge className={m.status === "Activo" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}>{m.status}</Badge></td>
                <td className="px-4 py-3 text-slate-600">{m.cost}</td>
                <td className="px-4 py-3 text-slate-600">{m.quality}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900"><Database className="h-5 w-5 text-[#002D62]" />Documentos autorizados (RAG)</h3>
      <div className="mb-6 space-y-2">
        {DOCUMENTS.map((d) => (
          <div key={d.name} className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-3"><FileCheck className="h-5 w-5 text-[#00A8B5]" /><div><p className="text-sm font-medium text-slate-900">{d.name}</p><p className="text-xs text-slate-400">{d.type} · {d.chunks} fragmentos indexados</p></div></div>
            <Badge className={d.status === "Indexado" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>{d.status}</Badge>
          </div>
        ))}
      </div>

      <h3 className="mb-3 flex items-center gap-2 text-lg font-bold text-slate-900"><Sliders className="h-5 w-5 text-[#002D62]" />Parámetros generales</h3>
      <div className="mb-6 space-y-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between py-1">
          <div><Label>Guardrails de seguridad</Label><p className="text-xs text-slate-500">Bloquea recomendaciones peligrosas o fuera de alcance.</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-1">
          <div><Label>Citación obligatoria de fuentes</Label><p className="text-xs text-slate-500">La IA debe citar la fuente cuando usa RAG.</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-1">
          <div><Label>Etiqueta "Propuesta asistida"</Label><p className="text-xs text-slate-500">Toda respuesta lleva aviso de validación humana.</p></div>
          <Switch defaultChecked />
        </div>
        <div className="flex items-center justify-between py-1">
          <div><Label>Modo aprendizaje con datos reales</Label><p className="text-xs text-slate-500">Requiere anonimización y autorización. Desactivado por defecto.</p></div>
          <Switch />
        </div>
      </div>

      <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-5">
        <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <h3 className="text-sm font-bold text-amber-900">Privacidad de la IA</h3>
          <p className="mt-1 text-sm text-amber-700">La IA no utiliza datos privados de un usuario para responder a otro. El Super Administrador supervisa métricas agregadas de uso y costo, pero no accede al contenido de las consultas individuales. El entrenamiento futuro con datos reales requiere anonimización y autorización explícita.</p>
        </div>
      </div>
    </section>
  );
}