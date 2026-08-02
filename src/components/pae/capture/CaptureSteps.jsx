import { LabeledInput, LabeledTextarea, LabeledSelect } from "@/components/pae/capture/CaptureFields";

export function Step1Identification({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Datos de identificación del paciente.</p>
      <div className="mb-3 sm:max-w-xs">
        <LabeledSelect label="Tipo de PAE" value={data.pae_type} onChange={(v) => set("pae_type", v)} options={["Intrahospitalario", "Comunitario"]} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledInput label="Nombre o código" value={data.code} onChange={(v) => set("code", v)} placeholder="Ej. P-001" />
        <LabeledInput label="Nombre completo" value={data.full_name} onChange={(v) => set("full_name", v)} placeholder="Nombre del paciente" />
        <LabeledInput label="Edad" value={data.age} onChange={(v) => set("age", v)} placeholder="Años" />
        <LabeledSelect label="Sexo" value={data.sex} onChange={(v) => set("sex", v)} options={["Femenino", "Masculino", "Otro", "No especificado"]} />
        <LabeledInput label="Peso (kg)" value={data.weight} onChange={(v) => set("weight", v)} placeholder="Ej. 70" />
        <LabeledInput label="Talla (cm)" value={data.height} onChange={(v) => set("height", v)} placeholder="Ej. 165" />
        <LabeledInput label="Servicio" value={data.service} onChange={(v) => set("service", v)} placeholder="Ej. Hospitalización" />
        <LabeledInput label="Fecha" type="date" value={data.date} onChange={(v) => set("date", v)} />
        <LabeledSelect label="Zona" value={data.zone} onChange={(v) => set("zone", v)} options={["Urbana", "Rural"]} />
        <LabeledSelect label="¿Está acompañado?" value={data.accompanied} onChange={(v) => set("accompanied", v)} options={["Sí", "No"]} />
        <LabeledInput label="Nombre del acompañante" value={data.companion_name} onChange={(v) => set("companion_name", v)} placeholder="Nombre" />
        <LabeledInput label="Parentesco" value={data.kinship} onChange={(v) => set("kinship", v)} placeholder="Ej. Hija" />
      </div>
    </div>
  );
}

export function Step2Social({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Determinantes sociales de la salud.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <LabeledInput label="Tipo de vivienda" value={data.housing_type} onChange={(v) => set("housing_type", v)} placeholder="Ej. Casa de ladrillo" />
        <LabeledSelect label="Agua potable" value={data.potable_water} onChange={(v) => set("potable_water", v)} options={["Sí", "No"]} />
        <LabeledSelect label="Energía eléctrica" value={data.electricity} onChange={(v) => set("electricity", v)} options={["Sí", "No"]} />
        <LabeledSelect label="Alcantarillado" value={data.sewage} onChange={(v) => set("sewage", v)} options={["Sí", "No"]} />
        <LabeledSelect label="Recolección de residuos" value={data.waste_collection} onChange={(v) => set("waste_collection", v)} options={["Sí", "No"]} />
        <LabeledInput label="Acceso a servicios de salud" value={data.health_access} onChange={(v) => set("health_access", v)} placeholder="Ej. Centro de salud cercano" />
        <LabeledInput label="Apoyo familiar" value={data.family_support} onChange={(v) => set("family_support", v)} placeholder="Ej. Bueno, regular, nulo" />
        <LabeledInput label="Condición socioeconómica" value={data.socioeconomic} onChange={(v) => set("socioeconomic", v)} placeholder="Ej. Media-baja" />
        <LabeledInput label="Adherencia al tratamiento" value={data.treatment_adherence} onChange={(v) => set("treatment_adherence", v)} placeholder="Ej. Buena, irregular" />
        <LabeledTextarea label="¿Toma correctamente los medicamentos?" value={data.medication_taking} onChange={(v) => set("medication_taking", v)} rows={2} />
        <div className="sm:col-span-2"><LabeledTextarea label="Barreras para el cuidado" value={data.care_barriers} onChange={(v) => set("care_barriers", v)} rows={2} /></div>
      </div>
    </div>
  );
}

export function Step3Clinical({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Información clínica del paciente.</p>
      <div className="space-y-4">
        <LabeledTextarea label="Motivo de consulta" value={data.reason_consultation} onChange={(v) => set("reason_consultation", v)} />
        <LabeledInput label="Diagnóstico médico" value={data.medical_diagnosis} onChange={(v) => set("medical_diagnosis", v)} placeholder="Ej. Diabetes tipo 2" />
        <LabeledTextarea label="Enfermedad actual" value={data.current_illness} onChange={(v) => set("current_illness", v)} />
        <LabeledTextarea label="Antecedentes" value={data.history} onChange={(v) => set("history", v)} />
        <LabeledTextarea label="Medicamentos" value={data.medications} onChange={(v) => set("medications", v)} />
        <LabeledInput label="Alergias" value={data.allergies} onChange={(v) => set("allergies", v)} placeholder="Ej. Penicilina, ninguna" />
      </div>
    </div>
  );
}

export function Step4Subjective({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Datos subjetivos expresados por el paciente.</p>
      <div className="space-y-4">
        <LabeledInput label="Dolor" value={data.pain} onChange={(v) => set("pain", v)} placeholder="Ej. EVA 6/10, lumbar" />
        <LabeledInput label="Molestias" value={data.discomfort} onChange={(v) => set("discomfort", v)} placeholder="Ej. Náuseas" />
        <LabeledTextarea label="Síntomas" value={data.symptoms} onChange={(v) => set("symptoms", v)} />
        <LabeledTextarea label="Necesidades" value={data.needs} onChange={(v) => set("needs", v)} />
        <LabeledTextarea label="Preocupaciones" value={data.concerns} onChange={(v) => set("concerns", v)} />
        <LabeledTextarea label="Manifestaciones verbales" value={data.verbal_manifestations} onChange={(v) => set("verbal_manifestations", v)} placeholder="Frases textuales del paciente" />
      </div>
    </div>
  );
}

export function Step5Objective({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Datos objetivos hallados en la valoración.</p>
      <div className="space-y-4">
        <LabeledTextarea label="Signos vitales" value={data.vital_signs} onChange={(v) => set("vital_signs", v)} placeholder="Ej. TA 140/85, FC 92, FR 20, T 37.2" />
        <LabeledTextarea label="Valoración física" value={data.physical_assessment} onChange={(v) => set("physical_assessment", v)} />
        <LabeledTextarea label="Hallazgos clínicos" value={data.clinical_findings} onChange={(v) => set("clinical_findings", v)} />
        <LabeledInput label="Dispositivos" value={data.devices} onChange={(v) => set("devices", v)} placeholder="Ej. Sonda vesical, catéter IV" />
        <LabeledInput label="Heridas" value={data.wounds} onChange={(v) => set("wounds", v)} placeholder="Ej. Herida quirúrgica limpia" />
        <LabeledInput label="Edemas" value={data.edema} onChange={(v) => set("edema", v)} placeholder="Ej. Edema en MMII" />
        <LabeledInput label="Otros hallazgos" value={data.other_findings} onChange={(v) => set("other_findings", v)} />
      </div>
    </div>
  );
}

export function Step6Assessment({ data, set }) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-500">Patrones funcionales de Gordon — valora cada uno de los 11 patrones de forma estructurada.</p>
      <div className="space-y-3">
        <LabeledTextarea label="1. Percepción-manejo de la salud" value={data.pattern_health} onChange={(v) => set("pattern_health", v)} rows={2} placeholder="Percepción de salud, hábitos, cumplimiento terapéutico..." />
        <LabeledTextarea label="2. Nutricional-metabólico" value={data.pattern_nutritional} onChange={(v) => set("pattern_nutritional", v)} rows={2} placeholder="Dieta, apetito, peso, mucosas, hidratación..." />
        <LabeledTextarea label="3. Eliminación" value={data.pattern_elimination} onChange={(v) => set("pattern_elimination", v)} rows={2} placeholder="Patrón intestinal y vesical, regularidad, cambios..." />
        <LabeledTextarea label="4. Actividad-ejercicio" value={data.pattern_activity} onChange={(v) => set("pattern_activity", v)} rows={2} placeholder="Capacidad funcional, ejercicio, tolerancia, deambulación..." />
        <LabeledTextarea label="5. Sueño-descanso" value={data.pattern_sleep} onChange={(v) => set("pattern_sleep", v)} rows={2} placeholder="Horas de sueño, calidad, insomnio, descanso..." />
        <LabeledTextarea label="6. Cognitivo-perceptual" value={data.pattern_cognitive} onChange={(v) => set("pattern_cognitive", v)} rows={2} placeholder="Memoria, orientación, percepción, dolor, sentidos..." />
        <LabeledTextarea label="7. Autopercepción-autoconcepto" value={data.pattern_self_perception} onChange={(v) => set("pattern_self_perception", v)} rows={2} placeholder="Autoestima, imagen corporal, estado emocional..." />
        <LabeledTextarea label="8. Rol-relaciones" value={data.pattern_roles} onChange={(v) => set("pattern_roles", v)} rows={2} placeholder="Familia, trabajo, relaciones sociales, apoyo..." />
        <LabeledTextarea label="9. Sexualidad-reproducción" value={data.pattern_sexuality} onChange={(v) => set("pattern_sexuality", v)} rows={2} placeholder="Patrón sexual, reproducción, cambios..." />
        <LabeledTextarea label="10. Adaptación-tolerancia al estrés" value={data.pattern_stress} onChange={(v) => set("pattern_stress", v)} rows={2} placeholder="Mecanismos de afrontamiento, estrés, ansiedad..." />
        <LabeledTextarea label="11. Valores-creencias" value={data.pattern_values} onChange={(v) => set("pattern_values", v)} rows={2} placeholder="Creencias religiosas, valores espirituales, prácticas..." />
        <LabeledTextarea label="Necesidades de Henderson" value={data.henderson_needs} onChange={(v) => set("henderson_needs", v)} rows={3} placeholder="Hallazgos por las 14 necesidades..." />
        <LabeledInput label="Laboratorios" value={data.labs} onChange={(v) => set("labs", v)} placeholder="Ej. Hb 7.2, glucemia 185" />
        <LabeledInput label="Estudios diagnósticos relevantes" value={data.diagnostic_studies} onChange={(v) => set("diagnostic_studies", v)} placeholder="Ej. RX tórax, ecografía" />
      </div>
    </div>
  );
}