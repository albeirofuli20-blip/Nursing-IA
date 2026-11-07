import { AlertTriangle, Clock, UserRoundSearch, ShieldAlert, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { diasDesde, esGrave, nombreCompleto } from "@/lib/sivigila";

function Bloque({ titulo, descripcion, count, tone, Icon, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-start gap-3 border-b border-slate-100 p-4">
        <div className={`rounded-xl p-2 ${tone}`}><Icon className="h-4 w-4" /></div>
        <div>
          <p className="font-semibold text-slate-900">{titulo} <span className="ml-1 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{count}</span></p>
          <p className="text-xs text-slate-500">{descripcion}</p>
        </div>
      </div>
      <div className="divide-y divide-slate-100">{children}</div>
    </div>
  );
}

export default function AlertasPanel({ fichas, patients, onOpen, onNotify }) {
  const gravesTardias = fichas.filter((f) => esGrave(f) && !f.notificado_oportunamente);
  const estancadas = fichas.filter((f) => ["Notificado", "En estudio"].includes(f.estado_notificacion) && (diasDesde(f.fecha_notificacion) ?? 0) > 30);
  const sinFicha = patients.filter((p) => /dengue/i.test(p.clinical_summary || "") && !fichas.some((f) => f.paciente_id === p.id));

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">Alertas epidemiológicas</h2>
        <p className="text-sm text-slate-500">Seguimiento de notificaciones inmediatas, casos sin ajuste y pacientes pendientes de fichas.</p>
      </div>

      <Bloque titulo="Dengue grave sin notificar en 24 h" descripcion="Fichas de evento 220 con notificación tardía." count={gravesTardias.length} tone="bg-red-50 text-red-600" Icon={ShieldAlert}>
        {gravesTardias.length === 0 && <p className="p-4 text-sm text-slate-400">Sin alertas en este grupo.</p>}
        {gravesTardias.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{nombreCompleto(f)} · {f.consecutivo}</p>
              <p className="text-xs text-red-600">{f.horas_hasta_notificacion ?? "—"} h desde el inicio de síntomas · {f.municipio || "Sin municipio"}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onOpen(f)}>Ver ficha</Button>
          </div>
        ))}
      </Bloque>

      <Bloque titulo="Casos sin ajuste por más de 30 días" descripcion="Fichas en estado Notificado o En estudio vencidas." count={estancadas.length} tone="bg-amber-50 text-amber-600" Icon={Clock}>
        {estancadas.length === 0 && <p className="p-4 text-sm text-slate-400">Sin casos vencidos.</p>}
        {estancadas.map((f) => (
          <div key={f.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{nombreCompleto(f)} · {f.consecutivo}</p>
              <p className="text-xs text-amber-600">{diasDesde(f.fecha_notificacion)} días sin ajuste · {f.estado_notificacion}</p>
            </div>
            <Button size="sm" variant="outline" onClick={() => onOpen(f)}>Ver ficha</Button>
          </div>
        ))}
      </Bloque>

      <Bloque titulo="Pacientes con dengue sin ficha SIVIGILA" descripcion="Pacientes con diagnóstico de dengue sin notificación asociada." count={sinFicha.length} tone="bg-sky-50 text-sky-600" Icon={UserRoundSearch}>
        {sinFicha.length === 0 && <p className="p-4 text-sm text-slate-400">Todos los pacientes con dengue tienen ficha.</p>}
        {sinFicha.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-2 p-3">
            <div>
              <p className="text-sm font-medium text-slate-900">{p.full_name}</p>
              <p className="text-xs text-sky-600">{p.code} · {p.clinical_summary?.slice(0, 90) || "Diagnóstico de dengue"}</p>
            </div>
            <Button size="sm" onClick={() => onNotify(p)} className="bg-[#00A8B5] hover:bg-[#008f99]"><FileText className="mr-1 h-3.5 w-3.5" />Notificar</Button>
          </div>
        ))}
      </Bloque>

      <div className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-slate-400" />
        <p className="text-xs text-slate-500">Las alertas se calculan con las fichas registradas. La verificación final corresponde al equipo de vigilancia epidemiológica.</p>
      </div>
    </section>
  );
}