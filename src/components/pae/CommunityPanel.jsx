import { HeartHandshake, Home, Users, ClipboardCheck, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const RIAS = [
  { title: "Caracterización familiar", icon: Users, desc: "Registro de composición familiar, dinámica, riesgos y factores protectores.", items: ["Genograma familiar", "APGAR familiar", "Ecomapa", "Factores de riesgo psicosocial"] },
  { title: "Visita domiciliaria", icon: Home, desc: "Planificación y registro de visitas con seguimiento estructurado.", items: ["Motivo de visita", "Condiciones de la vivienda", "Educación impartida", "Plan de seguimiento"] },
  { title: "Tamizajes", icon: ClipboardCheck, desc: "Aplicación de tamizajes según grupo poblacional y ciclo vital.", items: ["Tamizaje cardiovascular", "Tamizaje oncológico", "Tamizaje mental (PHQ-9)", "Tamizaje nutricional"] },
  { title: "Promoción y prevención", icon: Activity, desc: "Actividades de promoción de la salud y prevención de enfermedad.", items: ["Educación grupal", "Vacunación", "Saneamiento básico", "Estilos de vida saludables"] }
];

export default function CommunityPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 10</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Comunidad y APS</h2>
        <p className="mt-2 text-slate-600">Atención Primaria en Salud: RIAS, caracterización familiar, visitas domiciliarias, tamizajes y seguimiento comunitario.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {RIAS.map((r) => {
          const Icon = r.icon;
          return (
            <div key={r.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-3 flex items-center gap-2"><div className="inline-flex rounded-xl bg-green-50 p-2.5 text-green-700"><Icon className="h-5 w-5" /></div><h3 className="font-bold text-slate-900">{r.title}</h3></div>
              <p className="mb-3 text-sm text-slate-600">{r.desc}</p>
              <div className="flex flex-wrap gap-2">
                {r.items.map((item) => <Badge key={item} variant="secondary" className="text-xs">{item}</Badge>)}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-6 rounded-2xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-5">
        <h3 className="mb-2 flex items-center gap-2 font-bold text-[#002D62]"><HeartHandshake className="h-5 w-5" />RIAS — Rutas Integrales de Atención en Salud</h3>
        <p className="text-sm text-slate-700">El módulo soporta la operación de Rutas Integrales de Atención en Salud (RIAS) definidas por el sistema de salud, permitiendo el seguimiento poblacional por grupos de riesgo y ciclo vital, con indicadores de cobertura y calidad.</p>
      </div>
    </section>
  );
}