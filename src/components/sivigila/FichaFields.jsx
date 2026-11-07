import moment from "moment";
import { Input } from "@/components/ui/input";

export const inputClass = "h-9 w-full rounded-md border border-input bg-white px-2 text-sm";

export function Field({ label, children, className = "" }) {
  return <label className={`block ${className}`}><span className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-500">{label}</span>{children}</label>;
}

export function TextField({ label, value, onChange, type = "text", ...rest }) {
  return <Field label={label}><Input type={type} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...rest} /></Field>;
}

export function SelectField({ label, value, onChange, options, allowEmpty = false }) {
  return <Field label={label}>
    <select className={inputClass} value={value ?? ""} onChange={(e) => onChange(e.target.value)}>
      {allowEmpty && <option value="">—</option>}
      {options.map((o) => <option key={o} value={o}>{o}</option>)}
    </select>
  </Field>;
}

export function CheckGroup({ title, items, form, set }) {
  return <div>
    <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-slate-500">{title}</p>
    <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-4">
      {items.map(([key, label]) => (
        <label key={key} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white px-2 py-1.5 text-xs text-slate-700">
          <input type="checkbox" className="h-3.5 w-3.5 accent-[#00A8B5]" checked={Boolean(form[key])} onChange={(e) => set(key, e.target.checked)} />
          {label}
        </label>
      ))}
    </div>
  </div>;
}

export function FormSection({ title, description, children }) {
  return <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <h3 className="text-sm font-bold uppercase tracking-wider text-[#002D62]">{title}</h3>
    {description && <p className="mb-3 text-xs text-slate-500">{description}</p>}
    <div className="mt-3 space-y-3">{children}</div>
  </section>;
}

export const emptyFicha = {
  codigo_evento: "210 - Dengue",
  consecutivo: "",
  fecha_notificacion: moment().format("YYYY-MM-DD"),
  semana_epidemiologica: "",
  upgd: "", nombre_ips: "", codigo_ips: "",
  departamento: "", municipio: "", barrio: "",
  tipo_documento: "CC", numero_documento: "",
  primer_nombre: "", segundo_nombre: "", primer_apellido: "", segundo_apellido: "",
  edad: "", unidad_medida_edad: "Años", sexo: "Indeterminado", gestante: false,
  regimen: "Contributivo", eps: "",
  paciente_hospitalizado: false, fecha_hospitalizacion: "",
  fecha_inicio_sintomas: "", fecha_consulta: "",
  fiebre: false, cefalea: false, dolor_retroocular: false, mialgia: false,
  artralgia: false, exantema: false, nauseas: false, vomito: false,
  dolor_abdominal_intenso: false, vomito_persistente: false, sangrado_mucosas: false,
  letargia: false, hepatomegalia: false, acumulacion_liquidos: false, lipotimia: false,
  clasificacion_inicial: "Sospechoso", clasificacion_final: "No aplica",
  ns1: "No realizada", igm: "No realizada", igg: "No realizada", pcr: "No realizada", aislamiento_viral: "No realizada",
  fecha_toma_muestra: "",
  resultado_final: "En estudio", estado_notificacion: "Notificado", tipo_ajuste: "Sin ajuste", fecha_ajuste: "",
  notificado_oportunamente: false, horas_hasta_notificacion: null,
  paciente_id: "", care_plan_id: "",
  notificador: "", notificador_email: "", observaciones: "",
};

function separarNombre(fullName) {
  const parts = String(fullName || "").trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return {};
  if (parts.length === 1) return { primer_nombre: parts[0] };
  if (parts.length === 2) return { primer_nombre: parts[0], primer_apellido: parts[1] };
  if (parts.length === 3) return { primer_nombre: parts[0], primer_apellido: parts[1], segundo_apellido: parts[2] };
  return { primer_nombre: parts[0], segundo_nombre: parts[1], primer_apellido: parts[2], segundo_apellido: parts.slice(3).join(" ") };
}

export function prellenarDesdePaciente(patient) {
  if (!patient) return {};
  const sexo = patient.sex === "femenino" ? "F" : patient.sex === "masculino" ? "M" : "Indeterminado";
  const edad = patient.birth_date ? moment().diff(moment(patient.birth_date), "years") : "";
  return {
    ...separarNombre(patient.full_name),
    numero_documento: patient.code || "",
    edad,
    unidad_medida_edad: "Años",
    sexo,
    paciente_id: patient.id,
  };
}