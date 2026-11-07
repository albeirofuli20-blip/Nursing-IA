import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, FileText, AlertTriangle, FlaskConical, CheckCircle2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { nombreCompleto, esGrave, RESULTADOS_PRUEBA } from "@/lib/sivigila";

const PRUEBAS = [["ns1", "NS1"], ["igm", "IgM"], ["igg", "IgG"], ["pcr", "PCR"]];

function Dato({ label, value, className = "" }) {
  return <div className={className}><p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">{label}</p><p className="text-sm text-slate-800">{value === true ? "Sí" : value === false ? "No" : value || "—"}</p></div>;
}

export default function FichaDetail({ ficha, plan, canEdit = true, onClose, onEdit, onUpdated, onDeleted }) {
  const [local, setLocal] = useState(ficha);
  const [busy, setBusy] = useState(false);

  useEffect(() => { setLocal(ficha); }, [ficha]);

  if (!local) return null;
  const positivos = PRUEBAS.filter(([k]) => local[k] === "Positivo").map(([, label]) => label);

  async function actualizar(patch) {
    const merged = { ...local, ...patch };
    setLocal(merged);
    await base44.entities.SivigilaFicha.update(local.id, patch);
    onUpdated?.(merged);
  }

  async function aplicarAjuste() {
    setBusy(true);
    await actualizar({
      resultado_final: "Confirmado por laboratorio",
      tipo_ajuste: "Confirmado por laboratorio",
      estado_notificacion: "Ajustado",
      fecha_ajuste: new Date().toISOString().slice(0, 10),
    });
    setBusy(false);
  }

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex flex-wrap items-center gap-2 text-left">
            <span className="font-mono text-sm text-[#002D62]">{local.consecutivo}</span>
            <span className="text-slate-400">·</span>
            <span>{local.codigo_evento}</span>
            <Badge className="bg-slate-100 text-slate-700">{local.estado_notificacion}</Badge>
            {esGrave(local) && <Badge className="bg-red-100 text-red-700">Grave</Badge>}
          </DialogTitle>
        </DialogHeader>

        {!local.notificado_oportunamente && esGrave(local) && (
          <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <p>Dengue grave notificado fuera de las 24 horas. Requiere notificación inmediata y verificación con la UPGD.</p>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-3">
          <Dato label="Paciente" value={nombreCompleto(local)} className="sm:col-span-2" />
          <Dato label="Documento" value={`${local.tipo_documento} ${local.numero_documento}`} />
          <Dato label="Edad" value={`${local.edad ?? "—"} ${local.unidad_medida_edad || ""}`} />
          <Dato label="Sexo" value={local.sexo} />
          <Dato label="Gestante" value={local.gestante} />
          <Dato label="Régimen" value={local.regimen} />
          <Dato label="EPS" value={local.eps} />
          <Dato label="Hospitalizado" value={local.paciente_hospitalizado} />
          <Dato label="Departamento / Municipio" value={[local.departamento, local.municipio].filter(Boolean).join(" / ")} className="sm:col-span-2" />
          <Dato label="Semana epidemiológica" value={local.semana_epidemiologica} />
          <Dato label="Fecha de notificación" value={local.fecha_notificacion} />
          <Dato label="Inicio de síntomas" value={local.fecha_inicio_sintomas} />
          <Dato label="Horas hasta notificación" value={local.horas_hasta_notificacion} />
          <Dato label="Clasificación inicial" value={local.clasificacion_inicial} />
          <Dato label="Clasificación final" value={local.clasificacion_final} />
          <Dato label="Resultado final" value={local.resultado_final} />
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002D62]"><FlaskConical className="h-3.5 w-3.5" />Resultados de laboratorio</p>
          <div className="grid gap-2 sm:grid-cols-4">
            {PRUEBAS.map(([key, label]) => (
              <label key={key} className="block">
                <span className="mb-1 block text-[10px] font-semibold uppercase text-slate-400">{label}</span>
                <select disabled={!canEdit} className="h-9 w-full rounded-md border border-input bg-white px-2 text-sm disabled:opacity-60" value={local[key] || "No realizada"} onChange={(e) => actualizar({ [key]: e.target.value })}>
                  {RESULTADOS_PRUEBA.map((o) => <option key={o} value={o}>{o}</option>)}
                </select>
              </label>
            ))}
          </div>
          {canEdit && positivos.length > 0 && local.resultado_final !== "Confirmado por laboratorio" && (
            <div className="mt-3 flex flex-wrap items-center gap-3 rounded-lg bg-sky-50 p-2.5">
              <p className="flex-1 text-xs text-sky-800">Prueba positiva ({positivos.join(", ")}). Se sugiere ajustar el caso a confirmado por laboratorio.</p>
              <Button size="sm" variant="outline" disabled={busy} onClick={aplicarAjuste}><CheckCircle2 className="mr-1 h-3.5 w-3.5" />Aplicar ajuste</Button>
            </div>
          )}
          {positivos.length === 0 && <p className="mt-2 text-xs text-slate-400">Registra NS1, IgM, IgG o PCR en positivo para recibir la sugerencia de ajuste.</p>}
        </div>

        <div className="rounded-xl border border-slate-200 p-4">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#002D62]"><FileText className="h-3.5 w-3.5" />PAE asociado</p>
          {plan ? (
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-slate-700">{plan.title || plan.pae_number || "Plan de atención de enfermería"}</p>
              <Button asChild size="sm" variant="outline"><Link to={`/plan/${plan.id}`}>Abrir PAE</Link></Button>
            </div>
          ) : <p className="text-sm text-slate-400">Esta ficha no tiene un PAE vinculado.</p>}
        </div>

        {local.observaciones && <Dato label="Observaciones" value={local.observaciones} />}

        {canEdit && <div className="flex flex-wrap justify-between gap-2 border-t border-slate-100 pt-3">
          <Button variant="ghost" className="text-red-600 hover:bg-red-50 hover:text-red-700" onClick={async () => {
            if (!window.confirm("¿Eliminar esta ficha SIVIGILA?")) return;
            await base44.entities.SivigilaFicha.delete(local.id);
            onDeleted?.();
          }}><Trash2 className="mr-1 h-4 w-4" />Eliminar</Button>
          <Button onClick={() => onEdit(local)} className="bg-[#00A8B5] hover:bg-[#008f99]"><Pencil className="mr-1 h-4 w-4" />Editar ficha</Button>
        </div>}
      </DialogContent>
    </Dialog>
  );
}