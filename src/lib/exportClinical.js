import jsPDF from "jspdf";

function addSection(doc, title, y, content) {
  if (!content) return y;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 45, 98);
  doc.text(title, 14, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(50, 50, 50);
  const lines = doc.splitTextToSize(String(content), 180);
  doc.text(lines, 14, y);
  y += lines.length * 4 + 4;
  return y;
}

export function exportMedicationToPdf(med) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 45, 98);
  doc.text("Nurse Master IA - Guía de Medicamento", 14, y);
  y += 8;
  doc.setFontSize(14);
  doc.text(med.generic_name || "Medicamento", 14, y);
  y += 6;
  if (med.trade_name) { doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Nombre comercial: ${med.trade_name}`, 14, y); y += 5; }
  if (med.pharmacological_class) { doc.text(`Clase: ${med.pharmacological_class}`, 14, y); y += 5; }
  y += 3;
  doc.setDrawColor(0, 168, 181);
  doc.setLineWidth(0.5);
  doc.line(14, y, 196, y);
  y += 6;

  y = addSection(doc, "Mecanismo de acción", y, med.mechanism_of_action);
  y = addSection(doc, "Indicaciones", y, med.main_indications);
  if (med.off_label_uses) y = addSection(doc, "Usos off-label", y, med.off_label_uses);
  y = addSection(doc, "Contraindicaciones", y, med.contraindications);
  y = addSection(doc, "Precauciones", y, med.precautions);
  y = addSection(doc, "Dosis adultos", y, med.dose_adults);
  if (med.dose_pediatrics) y = addSection(doc, "Dosis pediatría", y, med.dose_pediatrics);
  if (med.dose_geriatrics) y = addSection(doc, "Dosis geriatría", y, med.dose_geriatrics);
  if (med.dose_pregnancy) y = addSection(doc, "Embarazo y lactancia", y, med.dose_pregnancy);
  if (med.dose_renal) y = addSection(doc, "Insuficiencia renal", y, med.dose_renal);
  if (med.dose_hepatic) y = addSection(doc, "Insuficiencia hepática", y, med.dose_hepatic);
  y = addSection(doc, "Vías de administración", y, med.administration_routes);
  if (med.dilution_reconstitution) y = addSection(doc, "Dilución y reconstitución", y, med.dilution_reconstitution);
  if (med.iv_compatibility) y = addSection(doc, "Compatibilidad IV", y, med.iv_compatibility);
  if (med.iv_incompatibility) y = addSection(doc, "Incompatibilidad IV", y, med.iv_incompatibility);
  if (med.infusion_rate) y = addSection(doc, "Velocidad de infusión", y, med.infusion_rate);
  if (med.stability_after_prep) y = addSection(doc, "Estabilidad", y, med.stability_after_prep);
  if (med.storage) y = addSection(doc, "Conservación", y, med.storage);
  y = addSection(doc, "Valoración previa (enfermería)", y, med.nursing_pre_assessment);
  y = addSection(doc, "Durante la administración", y, med.nursing_during_admin);
  y = addSection(doc, "Cuidados posteriores", y, med.nursing_post_admin);
  y = addSection(doc, "Parámetros a monitorizar", y, med.monitoring_parameters);
  y = addSection(doc, "Signos de alarma", y, med.warning_signs);
  y = addSection(doc, "Educación al paciente", y, med.patient_education);
  if (med.nanda_related) y = addSection(doc, "NANDA relacionados", y, med.nanda_related);
  if (med.nic_suggested) y = addSection(doc, "NIC sugeridas", y, med.nic_suggested);
  if (med.noc_expected) y = addSection(doc, "NOC esperados", y, med.noc_expected);
  y = addSection(doc, "Reacciones adversas", y, med.adverse_reactions);
  y = addSection(doc, "Efectos secundarios", y, med.frequent_side_effects);
  y = addSection(doc, "Interacciones medicamentosas", y, med.drug_interactions);
  if (med.food_interactions) y = addSection(doc, "Interacciones con alimentos", y, med.food_interactions);
  if (med.antidote) y = addSection(doc, "Antídoto", y, med.antidote);
  if (med.overdose_management) y = addSection(doc, "Sobredosis", y, med.overdose_management);
  if (med.lasa_classification) y = addSection(doc, "Clasificación LASA", y, med.lasa_classification);
  if (med.high_risk_ismp) { y = addSection(doc, "Medicamento de alto riesgo (ISMP)", y, "SÍ - Medicamento de alto riesgo. Requiere doble verificación."); }
  if (med.pregnancy_risk_level) y = addSection(doc, "Riesgo en embarazo", y, `Categoría ${med.pregnancy_risk_level}`);

  doc.save(`Medicamento_${med.generic_name || "export"}.pdf`);
}

export function exportLabToPdf(lab) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 45, 98);
  doc.text("Nurse Master IA - Guía de Laboratorio", 14, y);
  y += 8;
  doc.setFontSize(14);
  doc.text(lab.test_name || "Laboratorio", 14, y);
  y += 6;
  if (lab.category) { doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Categoría: ${lab.category}`, 14, y); y += 5; }
  if (lab.unit) { doc.text(`Unidad: ${lab.unit}`, 14, y); y += 5; }
  y += 3;
  doc.setDrawColor(0, 168, 181);
  doc.line(14, y, 196, y);
  y += 6;

  y = addSection(doc, "Rango de referencia (adulto masculino)", y, lab.reference_range_adult_male);
  y = addSection(doc, "Rango de referencia (adulto femenino)", y, lab.reference_range_adult_female);
  if (lab.reference_range_pediatric) y = addSection(doc, "Rango pediátrico", y, lab.reference_range_pediatric);
  if (lab.reference_range_elderly) y = addSection(doc, "Rango geriátrico", y, lab.reference_range_elderly);
  y = addSection(doc, "Tipo de muestra", y, lab.sample_type);
  y = addSection(doc, "Instrucciones de recolección", y, lab.collection_instructions);
  if (lab.patient_preparation) y = addSection(doc, "Preparación del paciente", y, lab.patient_preparation);
  y = addSection(doc, "Interpretación: valor bajo", y, lab.interpretation_low);
  y = addSection(doc, "Interpretación: valor alto", y, lab.interpretation_high);
  y = addSection(doc, "Interpretación: valor normal", y, lab.interpretation_normal);
  if (lab.critical_values) y = addSection(doc, "Valores críticos", y, lab.critical_values);
  if (lab.nanda_related) y = addSection(doc, "NANDA relacionados", y, lab.nanda_related);
  if (lab.nic_suggested) y = addSection(doc, "NIC sugeridas", y, lab.nic_suggested);
  if (lab.noc_expected) y = addSection(doc, "NOC esperados", y, lab.noc_expected);
  y = addSection(doc, "Implicaciones de enfermería", y, lab.nursing_implications);
  y = addSection(doc, "Acciones de seguimiento", y, lab.follow_up_actions);
  if (lab.related_medications) y = addSection(doc, "Medicamentos relacionados", y, lab.related_medications);

  doc.save(`Lab_${lab.test_name || "export"}.pdf`);
}

export function exportProcedureToPdf(proc) {
  const doc = new jsPDF();
  let y = 20;
  doc.setFontSize(16);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 45, 98);
  doc.text("Nurse Master IA - Guía de Procedimiento", 14, y);
  y += 8;
  doc.setFontSize(14);
  doc.text(proc.name || "Procedimiento", 14, y);
  y += 6;
  if (proc.category) { doc.setFontSize(10); doc.setTextColor(100, 100, 100); doc.text(`Categoría: ${proc.category}`, 14, y); y += 5; }
  if (proc.difficulty_level) { doc.text(`Dificultad: ${proc.difficulty_level}`, 14, y); y += 5; }
  if (proc.estimated_duration) { doc.text(`Duración estimada: ${proc.estimated_duration}`, 14, y); y += 5; }
  y += 3;
  doc.setDrawColor(0, 168, 181);
  doc.line(14, y, 196, y);
  y += 6;

  y = addSection(doc, "Objetivo", y, proc.objective);
  y = addSection(doc, "Indicaciones", y, proc.indications);
  y = addSection(doc, "Contraindicaciones", y, proc.contraindications);
  if (proc.precautions) y = addSection(doc, "Precauciones", y, proc.precautions);
  y = addSection(doc, "Material requerido", y, proc.required_materials);
  if (proc.patient_preparation) y = addSection(doc, "Preparación del paciente", y, proc.patient_preparation);
  if (proc.steps && proc.steps.length) {
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 45, 98);
    doc.text("Pasos del procedimiento", 14, y);
    y += 5;
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(50, 50, 50);
    proc.steps.forEach((s, i) => {
      const lines = doc.splitTextToSize(`${i + 1}. ${s}`, 180);
      doc.text(lines, 14, y);
      y += lines.length * 4 + 2;
    });
    y += 2;
  }
  y = addSection(doc, "Complicaciones", y, proc.complications);
  if (proc.complication_prevention) y = addSection(doc, "Prevención de complicaciones", y, proc.complication_prevention);
  y = addSection(doc, "Cuidados posteriores", y, proc.aftercare);
  y = addSection(doc, "Parámetros a monitorizar", y, proc.monitoring_parameters);
  if (proc.nanda_related) y = addSection(doc, "NANDA relacionados", y, proc.nanda_related);
  if (proc.nic_suggested) y = addSection(doc, "NIC sugeridas", y, proc.nic_suggested);
  if (proc.noc_expected) y = addSection(doc, "NOC esperados", y, proc.noc_expected);
  if (proc.patient_education) y = addSection(doc, "Educación al paciente", y, proc.patient_education);

  doc.save(`Procedimiento_${proc.name || "export"}.pdf`);
}