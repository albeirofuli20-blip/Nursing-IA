import { useMemo, useState } from "react";
import { Plus, Download, Search, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ESTADOS, EVENTOS, CLASIFICACIONES_FINALES, nombreCompleto, exportarSivigilaCsv } from "@/lib/sivigila";

const selectClass = "h-9 rounded-md border border-input bg-white px-2 text-sm text-slate-700";

const estadoTone = {
  Notificado: "bg-sky-100 text-sky-700",
  "En estudio": "bg-amber-100 text-amber-700",
  Ajustado: "bg-purple-100 text-purple-700",
  Cerrado: "bg-emerald-100 text-emerald-700",
};

function Filtro({ value, onChange, options, allLabel }) {
  return (
    <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">{allLabel}</option>
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

export default function FichasTable({ fichas, onNew, onOpen, onEdit, canEdit = () => true }) {
  const [search, setSearch] = useState("");
  const [evento, setEvento] = useState("");
  const [clasificacion, setClasificacion] = useState("");
  const [municipio, setMunicipio] = useState("");
  const [semana, setSemana] = useState("");
  const [estado, setEstado] = useState("");

  const municipios = useMemo(() => [...new Set(fichas.map((f) => f.municipio).filter(Boolean))].sort(), [fichas]);
  const semanas = useMemo(() => [...new Set(fichas.map((f) => f.semana_epidemiologica).filter(Boolean))].sort().reverse(), [fichas]);

  const filtradas = fichas.filter((f) => {
    const q = search.toLowerCase();
    const coincide = !q || [f.consecutivo, f.numero_documento, nombreCompleto(f), f.municipio, f.eps]
      .some((v) => String(v || "").toLowerCase().includes(q));
    return coincide &&
      (!evento || f.codigo_evento === evento) &&
      (!clasificacion || f.clasificacion_final === clasificacion) &&
      (!municipio || f.municipio === municipio) &&
      (!semana || f.semana_epidemiologica === semana) &&
      (!estado || f.estado_notificacion === estado);
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Fichas de notificación</h2>
          <p className="text-sm text-slate-500">{filtradas.length} de {fichas.length} fichas registradas.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => exportarSivigilaCsv(filtradas)}><Download className="mr-1.5 h-4 w-4" />Exportar SIVIGILA</Button>
          <Button onClick={onNew} className="bg-[#00A8B5] hover:bg-[#008f99]"><Plus className="mr-1.5 h-4 w-4" />Nueva ficha</Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-white p-3">
        <div className="relative min-w-[220px] flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input placeholder="Buscar por consecutivo, documento, nombre…" value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Filtro value={evento} onChange={setEvento} options={EVENTOS} allLabel="Todos los eventos" />
        <Filtro value={clasificacion} onChange={setClasificacion} options={CLASIFICACIONES_FINALES} allLabel="Toda clasificación" />
        <Filtro value={municipio} onChange={setMunicipio} options={municipios} allLabel="Todos los municipios" />
        <Filtro value={semana} onChange={setSemana} options={semanas} allLabel="Todas las semanas" />
        <Filtro value={estado} onChange={setEstado} options={ESTADOS} allLabel="Todo estado" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-slate-50 text-left text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Consecutivo</th>
              <th className="px-4 py-3">Evento</th>
              <th className="px-4 py-3">Paciente</th>
              <th className="px-4 py-3">Documento</th>
              <th className="px-4 py-3">Municipio</th>
              <th className="px-4 py-3">Notificación</th>
              <th className="px-4 py-3">Clasificación final</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtradas.map((f) => (
              <tr key={f.id} className="cursor-pointer hover:bg-slate-50/80" onClick={() => onOpen(f)}>
                <td className="px-4 py-3 font-mono text-xs font-semibold text-[#002D62]">{f.consecutivo}</td>
                <td className="px-4 py-3 text-slate-700">{f.codigo_evento}</td>
                <td className="px-4 py-3 font-medium text-slate-900">{nombreCompleto(f)}</td>
                <td className="px-4 py-3 text-slate-600">{f.tipo_documento} {f.numero_documento}</td>
                <td className="px-4 py-3 text-slate-600">{f.municipio || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{f.fecha_notificacion || "—"}</td>
                <td className="px-4 py-3 text-slate-600">{f.clasificacion_final || "—"}</td>
                <td className="px-4 py-3"><Badge className={estadoTone[f.estado_notificacion] || "bg-slate-100 text-slate-600"}>{f.estado_notificacion}</Badge></td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-1">
                    {canEdit(f) && <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); onEdit(f); }}>Editar</Button>}
                    <Eye className="h-4 w-4 text-slate-300" />
                  </div>
                </td>
              </tr>
            ))}
            {filtradas.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-12 text-center text-sm text-slate-400">No hay fichas que coincidan con los filtros.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}