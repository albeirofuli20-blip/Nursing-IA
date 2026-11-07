import { useState } from "react";
import moment from "moment";
import { AlertTriangle, CheckCircle2, Save, X, FlaskConical } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FormSection, TextField, SelectField, CheckGroup, emptyFicha, prellenarDesdePaciente } from "@/components/sivigila/FichaFields";
import {
  EVENTOS, TIPOS_DOCUMENTO, UNIDADES_EDAD, SEXOS, REGIMENES, CLASIFICACIONES_INICIALES, CLASIFICACIONES_FINALES,
  RESULTADOS_PRUEBA, RESULTADOS_FINALES, ESTADOS, TIPOS_AJUSTE, SINTOMAS, SIGNOS_ALARMA,
  semanaLabel, horasDesdeSintomas, tieneSignosAlarma, siguienteConsecutivo,
} from "@/lib/sivigila";

export default function FichaForm({ ficha, prefillPatient, fichas, patients, plans, user, onSaved, onCancel }) {
  const [form, setForm] = useState(() => {
    const base = {
      ...emptyFicha,
      notificador: user?.full_name || "",
      notificador_email: user?.email || "",
      municipio: user?.sivigila_municipio || "",
      departamento: user?.sivigila_departamento || "",
    };
    if (ficha) return { ...base, ...ficha };
    const previa = prefillPatient ? fichas.find((f) => f.paciente_id === prefillPatient.id) : null;
    return {
      ...base,
      ...prellenarDesdePaciente(prefillPatient),
      ...(previa ? { eps: previa.eps, municipio: previa.municipio, departamento: previa.departamento, upgd: previa.upgd, nombre_ips: previa.nombre_ips, codigo_ips: previa.codigo_ips } : {}),
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const semana = semanaLabel(form.fecha_notificacion);
  const horas = horasDesdeSintomas(form.fecha_notificacion, form.fecha_inicio_sintomas);
  const grave = String(form.codigo_evento || "").startsWith("220") || form.clasificacion_final === "Dengue grave";
  const requiere220 = tieneSignosAlarma(form) || form.clasificacion_final === "Dengue grave";
  const oportuna = horas !== null && horas >= 0 && (grave ? horas <= 24 : horas <= 48);
  const positivos = ["ns1", "igm", "igg", "pcr"].filter((k) => form[k] === "Positivo");
  const planesDelPaciente = form.paciente_id ? plans.filter((p) => p.patient_id === form.paciente_id) : [];

  function seleccionarPaciente(id) {
    const patient = patients.find((p) => p.id === id);
    setForm((prev) => ({ ...prev, paciente_id: id, care_plan_id: "", ...prellenarDesdePaciente(patient) }));
  }

  function aplicarAjusteLaboratorio() {
    setForm((prev) => ({
      ...prev,
      resultado_final: "Confirmado por laboratorio",
      tipo_ajuste: "Confirmado por laboratorio",
      estado_notificacion: "Ajustado",
      fecha_ajuste: moment().format("YYYY-MM-DD"),
    }));
  }

  async function guardar(e) {
    e.preventDefault();
    setError("");
    if (!form.fecha_notificacion || !form.fecha_inicio_sintomas) {
      setError("Las fechas de notificación y de inicio de síntomas son obligatorias.");
      return;
    }
    if (!form.tipo_documento || !String(form.numero_documento).trim()) {
      setError("El tipo y el número de documento son obligatorios.");
      return;
    }
    if (requiere220 && !String(form.codigo_evento).startsWith("220")) {
      setError("Con signos de alarma o dengue grave el evento debe registrarse como 220 - Dengue grave.");
      return;
    }
    const duplicada = fichas.some((f) => f.id !== ficha?.id && f.tipo_documento === form.tipo_documento && String(f.numero_documento).trim() === String(form.numero_documento).trim());
    if (duplicada) {
      setError("Ya existe una ficha SIVIGILA con ese tipo y número de documento.");
      return;
    }
    setSaving(true);
    const payload = {
      ...form,
      consecutivo: form.consecutivo || siguienteConsecutivo(fichas),
      semana_epidemiologica: semana,
      horas_hasta_notificacion: horas === null ? undefined : horas,
      notificado_oportunamente: oportuna,
      edad: form.edad === "" || form.edad === null ? undefined : Number(form.edad),
    };
    ["id", "created_date", "updated_date", "created_by_id"].forEach((k) => delete payload[k]);
    try {
      if (ficha?.id) await base44.entities.SivigilaFicha.update(ficha.id, payload);
      else await base44.entities.SivigilaFicha.create(payload);
      onSaved();
    } catch {
      setError("No se pudo guardar la ficha. Verifica los datos e intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={guardar} className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">{ficha?.id ? "Editar ficha SIVIGILA" : "Nueva ficha SIVIGILA"}</h2>
          <p className="text-sm text-slate-500">Consecutivo: <span className="font-mono font-semibold text-[#002D62]">{form.consecutivo || "se asignará al guardar"}</span> · Semana: {semana || "—"}</p>
        </div>
        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}><X className="mr-1 h-4 w-4" />Cancelar</Button>
          <Button type="submit" disabled={saving} className="bg-[#00A8B5] hover:bg-[#008f99]"><Save className="mr-1 h-4 w-4" />{saving ? "Guardando…" : "Guardar ficha"}</Button>
        </div>
      </div>

      {requiere220 && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          <div>
            <p className="text-sm font-bold text-red-700">Notificación inmediata obligatoria</p>
            <p className="text-xs text-red-600">Se identificaron signos de alarma o clasificación de dengue grave. El evento debe notificarse como 220 - Dengue grave y ser reportado por la vía inmediata.</p>
          </div>
        </div>
      )}

      {horas !== null && !oportuna && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
          <p className="text-sm text-amber-700"><strong>Notificación tardía:</strong> transcurrieron {horas} horas entre el inicio de síntomas y la notificación. El límite es de {grave ? "24" : "48"} horas.</p>
        </div>
      )}
      {horas !== null && oportuna && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          <CheckCircle2 className="h-4 w-4" />Notificación oportuna: {horas} horas desde el inicio de síntomas.
        </div>
      )}

      <FormSection title="1. Evento y ubicación" description="Datos de la notificación y de la unidad primaria generadora de datos.">
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Código de evento" value={form.codigo_evento} onChange={(v) => set("codigo_evento", v)} options={EVENTOS} />
          <TextField label="Fecha de notificación *" type="date" value={form.fecha_notificacion} onChange={(v) => set("fecha_notificacion", v)} />
          <TextField label="Semana epidemiológica (calculada)" value={semana} onChange={() => {}} readOnly />
          <TextField label="UPGD" value={form.upgd} onChange={(v) => set("upgd", v)} />
          <TextField label="Nombre de la IPS" value={form.nombre_ips} onChange={(v) => set("nombre_ips", v)} />
          <TextField label="Código de la IPS" value={form.codigo_ips} onChange={(v) => set("codigo_ips", v)} />
          <TextField label="Departamento" value={form.departamento} onChange={(v) => set("departamento", v)} />
          <TextField label="Municipio" value={form.municipio} onChange={(v) => set("municipio", v)} />
          <TextField label="Barrio" value={form.barrio} onChange={(v) => set("barrio", v)} />
        </div>
      </FormSection>

      <FormSection title="2. Paciente" description="Identificación y afiliación al sistema de salud.">
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Tipo de documento *" value={form.tipo_documento} onChange={(v) => set("tipo_documento", v)} options={TIPOS_DOCUMENTO} />
          <TextField label="Número de documento *" value={form.numero_documento} onChange={(v) => set("numero_documento", v)} />
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Vincular paciente existente</span>
            <select className="h-9 w-full rounded-md border border-input bg-white px-2 text-sm" value={form.paciente_id || ""} onChange={(e) => seleccionarPaciente(e.target.value)}>
              <option value="">Sin vincular</option>
              {patients.map((p) => <option key={p.id} value={p.id}>{p.full_name} · {p.code}</option>)}
            </select>
          </label>
          <TextField label="Primer nombre" value={form.primer_nombre} onChange={(v) => set("primer_nombre", v)} />
          <TextField label="Segundo nombre" value={form.segundo_nombre} onChange={(v) => set("segundo_nombre", v)} />
          <TextField label="Primer apellido" value={form.primer_apellido} onChange={(v) => set("primer_apellido", v)} />
          <TextField label="Segundo apellido" value={form.segundo_apellido} onChange={(v) => set("segundo_apellido", v)} />
          <TextField label="Edad" type="number" value={form.edad} onChange={(v) => set("edad", v)} />
          <SelectField label="Unidad de medida" value={form.unidad_medida_edad} onChange={(v) => set("unidad_medida_edad", v)} options={UNIDADES_EDAD} />
          <SelectField label="Sexo" value={form.sexo} onChange={(v) => set("sexo", v)} options={SEXOS} />
          <SelectField label="Régimen" value={form.regimen} onChange={(v) => set("regimen", v)} options={REGIMENES} />
          <TextField label="EPS" value={form.eps} onChange={(v) => set("eps", v)} />
          <TextField label="Fecha de consulta" type="date" value={form.fecha_consulta} onChange={(v) => set("fecha_consulta", v)} />
        </div>
        <div className="flex flex-wrap items-center gap-4 pt-1">
          {form.sexo === "F" && (
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" className="h-4 w-4 accent-[#00A8B5]" checked={Boolean(form.gestante)} onChange={(e) => set("gestante", e.target.checked)} />Gestante
            </label>
          )}
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" className="h-4 w-4 accent-[#00A8B5]" checked={Boolean(form.paciente_hospitalizado)} onChange={(e) => set("paciente_hospitalizado", e.target.checked)} />Paciente hospitalizado
          </label>
          {form.paciente_hospitalizado && <TextField label="Fecha de hospitalización" type="date" value={form.fecha_hospitalizacion} onChange={(v) => set("fecha_hospitalizacion", v)} />}
        </div>
      </FormSection>

      <FormSection title="3. Clínica" description="Síntomas, signos de alarma y clasificación del caso.">
        <TextField label="Fecha de inicio de síntomas *" type="date" value={form.fecha_inicio_sintomas} onChange={(v) => set("fecha_inicio_sintomas", v)} />
        <CheckGroup title="Síntomas" items={SINTOMAS} form={form} set={set} />
        <CheckGroup title="Signos de alarma" items={SIGNOS_ALARMA} form={form} set={set} />
        <div className="grid gap-3 sm:grid-cols-2">
          <SelectField label="Clasificación inicial" value={form.clasificacion_inicial} onChange={(v) => set("clasificacion_inicial", v)} options={CLASIFICACIONES_INICIALES} />
          <SelectField label="Clasificación final" value={form.clasificacion_final} onChange={(v) => {
            set("clasificacion_final", v);
            if (v === "Dengue grave") set("codigo_evento", "220 - Dengue grave");
          }} options={CLASIFICACIONES_FINALES} />
        </div>
      </FormSection>

      <FormSection title="4. Laboratorio" description="Pruebas diagnósticas y resultado final del caso.">
        <div className="grid gap-3 sm:grid-cols-3">
          {[["ns1", "NS1"], ["igm", "IgM"], ["igg", "IgG"], ["pcr", "PCR"], ["aislamiento_viral", "Aislamiento viral"]].map(([key, label]) => (
            <SelectField key={key} label={label} value={form[key]} onChange={(v) => set(key, v)} options={RESULTADOS_PRUEBA} />
          ))}
          <TextField label="Fecha de toma de muestra" type="date" value={form.fecha_toma_muestra} onChange={(v) => set("fecha_toma_muestra", v)} />
          <SelectField label="Resultado final" value={form.resultado_final} onChange={(v) => set("resultado_final", v)} options={RESULTADOS_FINALES} />
        </div>
        {positivos.length > 0 && form.resultado_final !== "Confirmado por laboratorio" && (
          <div className="flex flex-wrap items-center gap-3 rounded-xl border border-sky-200 bg-sky-50 p-3">
            <FlaskConical className="h-4 w-4 text-sky-600" />
            <p className="flex-1 text-sm text-sky-800">Resultado positivo en {positivos.join(", ").toUpperCase()}. Se sugiere ajustar el caso a confirmado por laboratorio.</p>
            <Button type="button" size="sm" variant="outline" onClick={aplicarAjusteLaboratorio}>Aplicar ajuste</Button>
          </div>
        )}
      </FormSection>

      <FormSection title="5. Cierre del caso" description="Estado de la notificación, ajuste y plan de atención asociado.">
        <div className="grid gap-3 sm:grid-cols-3">
          <SelectField label="Estado de la notificación" value={form.estado_notificacion} onChange={(v) => set("estado_notificacion", v)} options={ESTADOS} />
          <SelectField label="Tipo de ajuste" value={form.tipo_ajuste} onChange={(v) => set("tipo_ajuste", v)} options={TIPOS_AJUSTE} />
          <TextField label="Fecha de ajuste" type="date" value={form.fecha_ajuste} onChange={(v) => set("fecha_ajuste", v)} />
          <TextField label="Notificador" value={form.notificador} onChange={(v) => set("notificador", v)} />
          <TextField label="Correo del notificador" type="email" value={form.notificador_email} onChange={(v) => set("notificador_email", v)} />
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">PAE asociado</span>
            <select className="h-9 w-full rounded-md border border-input bg-white px-2 text-sm" value={form.care_plan_id || ""} onChange={(e) => set("care_plan_id", e.target.value)}>
              <option value="">Sin PAE asociado</option>
              {planesDelPaciente.map((p) => <option key={p.id} value={p.id}>{p.title || p.pae_number || p.id}</option>)}
            </select>
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">Observaciones</span>
          <Textarea value={form.observaciones || ""} onChange={(e) => set("observaciones", e.target.value)} placeholder="Notas epidemiológicas, seguimiento o contacto con el paciente…" />
        </label>
      </FormSection>

      {error && <p className="rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600">{error}</p>}

      <div className="flex justify-end gap-2 pb-4">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving} className="bg-[#002D62] hover:bg-[#002D62]/90"><Save className="mr-1 h-4 w-4" />{saving ? "Guardando…" : "Guardar ficha"}</Button>
      </div>
    </form>
  );
}