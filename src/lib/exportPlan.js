import { jsPDF } from "jspdf";

const GREEN = [77, 128, 51];
const GREEN_LIGHT = [234, 242, 233];

function text(doc, str, x, y, opts = {}) {
  const lines = doc.splitTextToSize(String(str ?? ""), opts.maxWidth || 175);
  lines.forEach((line, i) => {
    if (y + i * (opts.lineHeight || 5) > 280) { doc.addPage(); y = 18 - i * (opts.lineHeight || 5); }
    doc.text(line, x, y + i * (opts.lineHeight || 5));
  });
  return y + lines.length * (opts.lineHeight || 5);
}

function bar(doc, label, y) {
  doc.setFillColor(...GREEN); doc.rect(15, y, 180, 6, "F"); doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(8); doc.text(label, 17, y + 4); doc.setTextColor(0, 0, 0); return y + 6;
}

function cell(doc, label, value, x, y, w, h = 12) {
  doc.setDrawColor(180, 180, 180); doc.rect(x, y, w, h); doc.setFont("helvetica", "bold"); doc.setFontSize(6); doc.setTextColor(100, 100, 100); doc.text(label.toUpperCase(), x + 2, y + 4); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(0, 0, 0); const nextY = text(doc, value || "—", x + 2, y + 8, { maxWidth: w - 4, lineHeight: 4 }); return Math.max(h, nextY - y);
}

export function exportPaePdf(plan, patient) {
  const doc = new jsPDF(); let y = 18; const p = patient || { full_name: plan.patient_name, code: plan.medical_record };
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(...GREEN); doc.text("AREANDINA", 15, y); doc.setTextColor(0, 0, 0); doc.setFontSize(8); doc.text("FACULTAD CIENCIAS DE LA SALUD\nENFERMERÍA", 80, y - 4, { align: "center" });
  doc.setFontSize(7); [["VERSIÓN:", plan.version || "01"], ["CÓDIGO:", plan.code || "—"], ["FECHA:", plan.pae_date || "—"]].forEach(([l, v], i) => { doc.text(l, 155, y - 6 + i * 5); doc.text(v, 172, y - 6 + i * 5); });
  y += 8; doc.setDrawColor(...GREEN); doc.setLineWidth(0.8); doc.line(15, y, 195, y); y += 4;
  doc.setFillColor(...GREEN); doc.rect(15, y, 180, 7, "F"); doc.setTextColor(255, 255, 255); doc.setFontSize(10); doc.text(`PLAN DE ATENCIÓN DE ENFERMERÍA – PAE N.º ${plan.pae_number || "—"}`, 100, y + 5, { align: "center" }); doc.setTextColor(0, 0, 0); y += 10;
  const rows = [["NOMBRES Y APELLIDOS", p.full_name, "SERVICIO", plan.service], ["EDAD", p.birth_date || "—", "N.° DE CAMA", plan.bed_number], ["N.° HISTORIA CLÍNICA", plan.medical_record || p.code, "N.° DE INGRESO", plan.admission_number]];
  rows.forEach(([l1, v1, l2, v2]) => { const h1 = cell(doc, l1, v1, 15, y, 90); const h2 = cell(doc, l2, v2, 105, y, 90); y += Math.max(h1, h2) + 1; });
  y = bar(doc, "DIAGNÓSTICO MÉDICO", y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 180, 16); y = text(doc, plan.medical_diagnosis || "—", 17, y + 5, { maxWidth: 176 }) + 3;
  const colW = 60; const colX = [15, 75, 135]; const startY = y;
  y = bar(doc, "DIAGNÓSTICO DE ENFERMERÍA (NANDA)", colX[0], y); let y1 = y;
  (plan.diagnoses || []).forEach((d) => { y1 = text(doc, `${d.nanda} ${d.code ? `(${d.code})` : ""}`, colX[0] + 2, y1, { maxWidth: colW - 4, lineHeight: 4 }); if (d.definition) y1 = text(doc, `Definición: ${d.definition}`, colX[0] + 2, y1, { maxWidth: colW - 4, lineHeight: 4 }); if (d.related_to) y1 = text(doc, `R/C: ${d.related_to}`, colX[0] + 2, y1, { maxWidth: colW - 4, lineHeight: 4 }); if (d.evidence) y1 = text(doc, `M/P: ${d.evidence}`, colX[0] + 2, y1, { maxWidth: colW - 4, lineHeight: 4 }); y1 = text(doc, `Dominio y Clase: ${d.domain || "—"} / ${d.class || "—"}`, colX[0] + 2, y1, { maxWidth: colW - 4, lineHeight: 4 }); y1 += 3; });
  let y2 = bar(doc, "RESULTADOS ESPERADOS (NOC)", colX[1], startY);
  (plan.outcomes || []).forEach((o, i) => { y2 = text(doc, `${i + 1}. ${o.noc} ${o.code ? `(${o.code})` : ""}`, colX[1] + 2, y2, { maxWidth: colW - 4, lineHeight: 4 }); (o.indicators || []).forEach(ind => { y2 = text(doc, `• ${ind}`, colX[1] + 4, y2, { maxWidth: colW - 6, lineHeight: 4 }); }); y2 = text(doc, `Escala: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}`, colX[1] + 2, y2, { maxWidth: colW - 4, lineHeight: 4 }); y2 += 3; });
  let y3 = bar(doc, "INTERVENCIÓN (NIC)", colX[2], startY);
  (plan.interventions || []).forEach((n, i) => { y3 = text(doc, `${i + 1}. ${n.nic} ${n.code ? `(${n.code})` : ""}`, colX[2] + 2, y3, { maxWidth: colW - 4, lineHeight: 4 }); (n.activities || []).forEach(a => { y3 = text(doc, `• ${a}`, colX[2] + 4, y3, { maxWidth: colW - 6, lineHeight: 4 }); }); if (n.rationale) y3 = text(doc, `Fundamentación: ${n.rationale}`, colX[2] + 2, y3, { maxWidth: colW - 4, lineHeight: 4 }); y3 += 3; });
  y = Math.max(y1, y2, y3) + 4;
  y = bar(doc, "EJECUCIÓN", 15, y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 90, 20); y = text(doc, plan.execution || "—", 17, y + 5, { maxWidth: 86 }) + 2;
  const yEval = bar(doc, "EVALUACIÓN", 105, y - 7); doc.setDrawColor(180, 180, 180); doc.rect(105, yEval, 90, 20); text(doc, plan.evaluation || "—", 107, yEval + 5, { maxWidth: 86 });
  y += 24; y = bar(doc, "INDICADORES / ESCALA DE MEDICIÓN / PUNTUACIÓN DIANA", 15, y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 180, 16); let yInd = y + 5; (plan.outcomes || []).forEach(o => { yInd = text(doc, `• ${o.noc}: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}`, 17, yInd, { maxWidth: 176, lineHeight: 4 }); }); yInd = text(doc, `Puntuación Diana: ${plan.diana_score || "—"}`, 17, yInd + 1, { maxWidth: 176, lineHeight: 4 });
  doc.save(`PAE-${plan.pae_number || ""}-${plan.patient_name}.pdf`);
}

export function exportPaeWord(plan, patient) {
  const p = patient || { full_name: plan.patient_name, code: plan.medical_record };
  const nanda = (plan.diagnoses || []).map((d, i) => `<p><b>${i + 1}. ${d.nanda} ${d.code ? `(${d.code})` : ""}</b><br>Definición: ${d.definition || "—"}<br>R/C: ${d.related_to || "—"}<br>M/P: ${d.evidence || "—"}<br>Dominio y Clase: ${d.domain || "—"} / ${d.class || "—"}</p>`).join("");
  const noc = (plan.outcomes || []).map((o, i) => `<p><b>${i + 1}. ${o.noc} ${o.code ? `(${o.code})` : ""}</b><br>Indicadores: ${(o.indicators || []).join(", ") || "—"}<br>Escala: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}</p>`).join("");
  const nic = (plan.interventions || []).map((n, i) => `<p><b>${i + 1}. ${n.nic} ${n.code ? `(${n.code})` : ""}</b><br>Actividades: ${(n.activities || []).join("; ") || "—"}<br>Fundamentación: ${n.rationale || "—"}</p>`).join("");
  const html = `<html><meta charset="utf-8"><body style="font-family:Arial">
  <h2 style="color:#4d8033">AREANDINA — Facultad Ciencias de la Salud — Enfermería</h2>
  <p>Versión: ${plan.version || "01"} | Código: ${plan.code || "—"} | Fecha: ${plan.pae_date || "—"}</p>
  <h3 style="background:#4d8033;color:#fff;padding:4px">PLAN DE ATENCIÓN DE ENFERMERÍA – PAE N.º ${plan.pae_number || "—"}</h3>
  <table border="1" cellpadding="4"><tr><td><b>Nombres y Apellidos:</b> ${p.full_name}</td><td><b>Servicio:</b> ${plan.service || "—"}</td></tr><tr><td><b>Edad:</b> ${p.birth_date || "—"}</td><td><b>N.° de Cama:</b> ${plan.bed_number || "—"}</td></tr><tr><td><b>N.° Historia Clínica:</b> ${plan.medical_record || p.code}</td><td><b>N.° de Ingreso:</b> ${plan.admission_number || "—"}</td></tr></table>
  <p><b>Diagnóstico Médico:</b> ${plan.medical_diagnosis || "—"}</p>
  <h4 style="color:#4d8033">Diagnóstico de Enfermería (NANDA)</h4>${nanda}
  <h4 style="color:#4d8033">Resultados Esperados (NOC)</h4>${noc}
  <h4 style="color:#4d8033">Intervención (NIC)</h4>${nic}
  <h4 style="color:#4d8033">Ejecución</h4><p>${plan.execution || "—"}</p>
  <h4 style="color:#4d8033">Evaluación</h4><p>${plan.evaluation || "—"}</p>
  <h4 style="color:#4d8033">Puntuación Diana</h4><p>${plan.diana_score || "—"}</p>
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `PAE-${plan.pae_number || ""}-${plan.patient_name}.doc`; link.click(); URL.revokeObjectURL(link.href);
}

export function exportPdf(plan) { exportPaePdf(plan); }
export function exportWord(plan) { exportPaeWord(plan); }