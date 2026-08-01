import { Stethoscope, ListChecks, Play, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const PROCEDURES = [
  { name: "Sondaje vesical", category: "Urológico", steps: ["Lavado de manos y preparación de material", "Posición supina con piernas flexionadas", "Asepsia del meato con povidona", "Introducción suave del catéter", "Inflar globo con 10 mL de agua destilada", "Conectar bolsa recolectora"], complications: "Trauma uretral, ITU, falsa vía", aftercare: "Vigilar diuresis, higiene perineal, cambio según protocolo" },
  { name: "Curación de herida", category: "Quirúrgico", steps: ["Lavado de manos y guantes estériles", "Retirar apósito anterior con cuidado", "Limpiar de lo menos a lo más contaminado", "Aplicar solución antiséptica", "Cubrir con apósito estéril", "Registrar características de la herida"], complications: "Infección, dehiscencia, sangrado", aftercare: "Cambiar apósito según exudado, vigilar signos de infección" },
  { name: "Canalización venosa", category: "Vascular", steps: ["Seleccionar vena y calibre apropiado", "Aplicar torniquete y antisepsia", "Punción con ángulo de 15-30°", "Verificar reflujo de sangre", "Fijar catéter y conectar sistema", "Retirar torniquete y registrar"], complications: "Hematoma, flebitis, infiltración", aftercare: "Vigilar sitio de punción cada turno, rotación según protocolo" },
  { name: "Aspiración de secreciones", category: "Respiratorio", steps: ["Oxigenar al paciente previamente", "Preparar sonda y sistema de aspiración", "Introducir sin aspirar", "Aspirar con movimientos rotatorios", "No superar 15 segundos por pasada", "Oxigenar entre pasadas"], complications: "Hipoxia, trauma mucoso, bradicardia", aftercare: "Vigilar saturación, auscultar, hidratar secreciones" }
];

export default function ProceduresPanel() {
  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Módulo 9</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Procedimientos</h2>
        <p className="mt-2 text-slate-600">Biblioteca multimedia con guías paso a paso, listas de verificación, complicaciones y cuidados posteriores.</p>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        {PROCEDURES.map((p) => (
          <div key={p.name} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2"><Stethoscope className="h-5 w-5 text-[#002D62]" /><h3 className="font-bold text-slate-900">{p.name}</h3></div>
              <Badge variant="secondary">{p.category}</Badge>
            </div>
            <div className="mb-3">
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-700"><ListChecks className="h-4 w-4 text-[#00A8B5]" />Pasos</p>
              <ol className="space-y-1.5">
                {p.steps.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-slate-600"><span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#002D62] text-xs font-bold text-white">{i + 1}</span>{s}</li>
                ))}
              </ol>
            </div>
            <div className="space-y-2 border-t border-slate-100 pt-3">
              <div className="flex items-start gap-2"><AlertTriangle className="h-4 w-4 shrink-0 text-amber-500" /><p className="text-xs text-slate-600"><strong>Complicaciones:</strong> {p.complications}</p></div>
              <div className="flex items-start gap-2"><Play className="h-4 w-4 shrink-0 text-[#00A8B5]" /><p className="text-xs text-slate-600"><strong>Cuidados posteriores:</strong> {p.aftercare}</p></div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}