import { Check, AlertCircle, Info, Loader2, X, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const COLORS = [
  { name: "Primario", hex: "#002D62", token: "Azul marino institucional", bg: "bg-[#002D62]", text: "text-white" },
  { name: "Acento", hex: "#00A8B5", token: "Turquesa innovación", bg: "bg-[#00A8B5]", text: "text-white" },
  { name: "Éxito", hex: "#16A34A", token: "Verde confirmación", bg: "bg-green-600", text: "text-white" },
  { name: "Advertencia", hex: "#F59E0B", token: "Ámber precaución", bg: "bg-amber-500", text: "text-white" },
  { name: "Error", hex: "#DC2626", token: "Rojo crítico", bg: "bg-red-600", text: "text-white" },
  { name: "Fondo", hex: "#FFFFFF", token: "Blanco limpio", bg: "bg-white border border-slate-200", text: "text-slate-900" }
];

export default function DesignSystemPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Design System</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Sistema de diseño</h2>
        <p className="mt-2 max-w-2xl text-slate-600">Componentes, colores, tipografía y estados reutilizables que garantizan consistencia visual en toda la plataforma.</p>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Paleta de colores</h3>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COLORS.map((c) => (
          <div key={c.name} className={`flex items-center gap-3 rounded-xl p-4 ${c.bg} ${c.text}`}>
            <div className="flex-1">
              <p className="text-sm font-bold">{c.name}</p>
              <p className="text-xs opacity-80">{c.token}</p>
              <p className="text-xs opacity-60">{c.hex}</p>
            </div>
          </div>
        ))}
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Tipografía</h3>
      <div className="mb-6 space-y-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-3xl font-bold text-slate-900">Encabezado principal</p>
        <p className="text-xl font-semibold text-slate-700">Subtítulo de sección</p>
        <p className="text-base text-slate-600">Texto de cuerpo para contenido general y descripciones.</p>
        <p className="text-sm text-slate-500">Texto pequeño para etiquetas, metadatos y notas.</p>
        <p className="text-xs text-slate-400">Texto auxiliar y captions.</p>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Botones</h3>
      <div className="mb-6 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Button>Primario</Button>
        <Button variant="secondary">Secundario</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="destructive">Destructivo</Button>
        <Button size="sm">Pequeño</Button>
        <Button size="lg">Grande</Button>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Estados y alertas</h3>
      <div className="mb-6 grid gap-3 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4"><Check className="h-5 w-5 text-green-600" /><div><p className="text-sm font-bold text-green-900">Éxito</p><p className="text-xs text-green-700">Operación completada correctamente.</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 p-4"><AlertCircle className="h-5 w-5 text-red-600" /><div><p className="text-sm font-bold text-red-900">Error</p><p className="text-xs text-red-700">No se pudo completar la acción.</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4"><Info className="h-5 w-5 text-amber-600" /><div><p className="text-sm font-bold text-amber-900">Advertencia</p><p className="text-xs text-amber-700">Revisa antes de continuar.</p></div></div>
        <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4"><Loader2 className="h-5 w-5 animate-spin text-slate-500" /><div><p className="text-sm font-bold text-slate-700">Cargando</p><p className="text-xs text-slate-500">Procesando solicitud...</p></div></div>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Formularios</h3>
      <div className="mb-6 max-w-md space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div><Label htmlFor="ds-name">Nombre completo</Label><Input id="ds-name" placeholder="Ej. María González" /></div>
        <div><Label htmlFor="ds-code">Código de paciente</Label><Input id="ds-code" placeholder="Ej. P-001" /></div>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Badges y etiquetas</h3>
      <div className="mb-6 flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <Badge className="bg-[#002D62] text-white">Activo</Badge>
        <Badge className="bg-[#00A8B5] text-white">IA</Badge>
        <Badge variant="secondary">Borrador</Badge>
        <Badge className="bg-green-100 text-green-700">Vigente</Badge>
        <Badge className="bg-amber-100 text-amber-700">Revisión</Badge>
        <Badge className="bg-red-100 text-red-700">Retirado</Badge>
      </div>

      <h3 className="mb-3 text-lg font-bold text-slate-900">Tarjetas</h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold text-slate-900">Plan PAE</span><Badge className="bg-[#00A8B5] text-white">IA</Badge></div>
          <p className="text-sm text-slate-600">Tarjeta de contenido con título, badge y descripción.</p>
          <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#002D62]">Ver detalle <ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold text-slate-900">Guía clínica</span><Badge className="bg-green-100 text-green-700">Vigente</Badge></div>
          <p className="text-sm text-slate-600">Tarjeta de recurso con estado y acción de acceso.</p>
          <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#002D62]">Abrir <ChevronRight className="h-4 w-4" /></button>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="mb-2 flex items-center justify-between"><span className="text-sm font-bold text-slate-900">Curso</span><Badge className="bg-[#002D62] text-white">Certificado</Badge></div>
          <p className="text-sm text-slate-600">Tarjeta de curso con certificación y inscripción.</p>
          <button className="mt-3 flex items-center gap-1 text-sm font-semibold text-[#002D62]">Inscribirse <ChevronRight className="h-4 w-4" /></button>
        </div>
      </div>
    </section>
  );
}