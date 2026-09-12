import { jsPDF } from "jspdf";
import moment from "moment";

const GREEN = [77, 128, 51];
const GREEN_LIGHT = [234, 242, 233];
const GREEN2 = [141, 198, 63];

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
  y += 24; y = bar(doc, "INDICADORES / ESCALA DE MEDICIÓN / PUNTUACIÓN DIANA", 15, y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 180, 16); let yInd = y + 5; (plan.outcomes || []).forEach(o => { yInd = text(doc, `• ${o.noc}: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}`, 17, yInd, { maxWidth: 176, lineHeight: 4 }); }); yInd = text(doc, `Puntuación Diana: ${plan.diana_score || "—"}`, 17, yInd + 1, { maxWidth: 176, lineHeight: 4 }); y = yInd + 4;
  y = bar(doc, "EDUCACIÓN AL PACIENTE Y CUIDADOR", 15, y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 180, 16); y = text(doc, plan.patient_education || "—", 17, y + 5, { maxWidth: 176 }) + 4;
  y = bar(doc, "RECOMENDACIONES DE SEGUIMIENTO", 15, y) + 1; doc.setDrawColor(180, 180, 180); doc.rect(15, y, 180, 16); text(doc, plan.follow_up || "—", 17, y + 5, { maxWidth: 176 });
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
  <h4 style="color:#4d8033">Educación al Paciente y Cuidador</h4><p>${plan.patient_education || "—"}</p>
  <h4 style="color:#4d8033">Recomendaciones de Seguimiento</h4><p>${plan.follow_up || "—"}</p>
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `PAE-${plan.pae_number || ""}-${plan.patient_name}.doc`; link.click(); URL.revokeObjectURL(link.href);
}

function subBar(doc, label, x, y, w) {
  doc.setFillColor(...GREEN2); doc.rect(x, y, w, 5, "F");
  doc.setTextColor(255, 255, 255); doc.setFont("helvetica", "bold"); doc.setFontSize(6);
  doc.text(label, x + 1.5, y + 3.5, { maxWidth: w - 3 });
  doc.setTextColor(0, 0, 0);
  return y + 5;
}

function boxBorder(doc, x, y, w, h) {
  doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.3); doc.rect(x, y, w, h);
}

function bulletsText(doc, items, x, y, w, lh = 4) {
  let cy = y;
  (items || []).forEach(it => { cy = text(doc, `• ${it}`, x, cy, { maxWidth: w, lineHeight: lh }); });
  return cy;
}

export function exportPaeIntraPdf(plan, patient) {
  const doc = new jsPDF(); let y = 18; const p = patient || { full_name: plan.patient_name, code: plan.medical_record };
  const age = p.birth_date ? `${moment().diff(moment(p.birth_date), "years")} años` : "—";
  const leftX = 15, rightX = 105, colW = 90;
  doc.setFont("helvetica", "bold"); doc.setFontSize(18); doc.setTextColor(...GREEN2); doc.text("AREANDINA", 15, y);
  doc.setFontSize(7); doc.setTextColor(0, 0, 0); doc.text("Fundación Universitaria del Área Andina", 15, y + 4);
  doc.setFontSize(8); doc.text("FACULTAD CIENCIAS DE LA SALUD\nENFERMERÍA", 105, y - 4, { align: "center" });
  doc.setFontSize(7); [["VERSIÓN:", plan.version || "01"], ["CÓDIGO:", plan.code || "—"], ["FECHA:", plan.pae_date || "—"]].forEach(([l, v], i) => { doc.text(l, 155, y - 6 + i * 5); doc.text(v, 172, y - 6 + i * 5); });
  y += 8; doc.setDrawColor(0, 0, 0); doc.setLineWidth(0.8); doc.line(15, y, 195, y); y += 4;
  doc.setFillColor(212, 237, 218); doc.rect(15, y, 180, 7, "F"); doc.setTextColor(0, 0, 0); doc.setFontSize(10); doc.setFont("helvetica", "bold"); doc.text("PLAN DE ATENCIÓN DE ENFERMERÍA", 105, y + 5, { align: "center" }); y += 7;
  const rows = [["NOMBRES Y APELLIDOS", p.full_name, "SERVICIO", plan.service], ["EDAD", age, "N.° DE CAMA", plan.bed_number], ["N.° DE HISTORIA CLÍNICA", plan.medical_record || p.code, "N.° DE INGRESO", plan.admission_number]];
  rows.forEach(([l1, v1, l2, v2]) => { const h1 = cell(doc, l1, v1, 15, y, 90); const h2 = cell(doc, l2, v2, 105, y, 90); y += Math.max(h1, h2) + 0.5; });
  boxBorder(doc, 15, y, 180, 12); doc.setFont("helvetica", "bold"); doc.setFontSize(6); doc.setTextColor(100, 100, 100); doc.text("DIAGNÓSTICO MÉDICO", 17, y + 4); doc.setFont("helvetica", "normal"); doc.setFontSize(9); doc.setTextColor(0, 0, 0); text(doc, plan.medical_diagnosis || "—", 17, y + 8, { maxWidth: 176, lineHeight: 4 }); y += 14;

  const diagnoses = plan.diagnoses?.length ? plan.diagnoses : [{}];
  diagnoses.forEach((d, i) => {
    const o = plan.outcomes?.[i] || {}; const n = plan.interventions?.[i] || {};
    if (i > 0) { doc.addPage(); y = 18; }
    const factors = (d.related_to || "").split(/[,;]\s*/).filter(Boolean);
    const chars = (d.evidence || "").split(/[,;]\s*/).filter(Boolean);
    const education = (plan.patient_education || "").split("\n").filter(Boolean);
    const followup = (plan.follow_up || "").split("\n").filter(Boolean);

    const rowH = [30, 36, 30, 30];
    let ry = y;
    for (let r = 0; r < 4; r++) {
      boxBorder(doc, leftX, ry, colW, rowH[r]); boxBorder(doc, rightX, ry, colW, rowH[r]);
      let ly = ry, ryt = ry;
      if (r === 0) {
        ly = subBar(doc, "DIAGNÓSTICO ENFERMERO (ETIQUETA NANDA)", leftX, ly, colW);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); ly = text(doc, `${d.nanda || "—"} ${d.code ? `(${d.code})` : ""}`, leftX + 2, ly + 3, { maxWidth: colW - 4, lineHeight: 4 }) + 1;
        doc.setFont("helvetica", "normal"); ly = text(doc, `Relacionado con ${d.related_to || "—"}, manifestado por ${d.evidence || "—"}.`, leftX + 2, ly, { maxWidth: colW - 4, lineHeight: 4 });
        ryt = subBar(doc, "INTERVENCIÓN: (NIC)", rightX, ryt, colW);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); ryt = text(doc, `${n.nic || "—"} ${n.code ? `(${n.code})` : ""}`, rightX + 2, ryt + 3, { maxWidth: colW - 4, lineHeight: 4 }) + 1;
        doc.setFont("helvetica", "normal"); ryt = bulletsText(doc, n.activities, rightX + 2, ryt, colW - 4);
      } else if (r === 1) {
        ly = subBar(doc, "FACTORES RELACIONADOS: (CAUSAS) E:", leftX, ly, colW);
        ly = bulletsText(doc, factors, leftX + 2, ly + 1, colW - 4) + 2;
        ly = subBar(doc, "CARACTERÍSTICAS DEFINITORIAS (SIGNOS Y SÍNTOMAS)", leftX, ly, colW);
        ly = bulletsText(doc, chars, leftX + 2, ly + 1, colW - 4);
        ryt = subBar(doc, "ACTIVIDADES:", rightX, ryt, colW);
        ryt = bulletsText(doc, n.activities, rightX + 2, ryt + 1, colW - 4);
      } else if (r === 2) {
        ly = subBar(doc, "RESULTADO ESPERADO: (NOC)", leftX, ly, colW);
        doc.setFont("helvetica", "bold"); doc.setFontSize(8); ly = text(doc, `${o.noc || "—"} ${o.code ? `(${o.code})` : ""}`, leftX + 2, ly + 3, { maxWidth: colW - 4, lineHeight: 4 }) + 1;
        doc.setFont("helvetica", "normal"); ly = text(doc, o.definition || "", leftX + 2, ly, { maxWidth: colW - 4, lineHeight: 4 });
        ryt = subBar(doc, "INDICADORES / ESCALA DE MEDICIÓN / PUNTUACIÓN DIANA", rightX, ryt, colW);
        ryt = bulletsText(doc, o.indicators, rightX + 2, ryt + 1, colW - 4) + 1;
        doc.setFont("helvetica", "normal"); ryt = text(doc, `Escala: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}`, rightX + 2, ryt, { maxWidth: colW - 4, lineHeight: 4 }) + 1;
        doc.setFont("helvetica", "bold"); ryt = text(doc, `Puntuación Diana: ${plan.diana_score || "—"}`, rightX + 2, ryt, { maxWidth: colW - 4, lineHeight: 4 });
      } else {
        ly = subBar(doc, "EDUCACIÓN AL PACIENTE Y CUIDADOR", leftX, ly, colW);
        ly = bulletsText(doc, education, leftX + 2, ly + 1, colW - 4);
        ryt = subBar(doc, "RECOMENDACIONES DE SEGUIMIENTO", rightX, ryt, colW);
        ryt = bulletsText(doc, followup, rightX + 2, ryt + 1, colW - 4);
      }
      ry += rowH[r];
    }
    y = ry + 4;
  });
  doc.save(`PAE-Intrahospitalario-${plan.patient_name || ""}.pdf`);
}

export function exportPaeIntraWord(plan, patient) {
  const p = patient || { full_name: plan.patient_name, code: plan.medical_record };
  const age = p.birth_date ? `${moment().diff(moment(p.birth_date), "years")} años` : "—";
  const head = (label) => `<div style="background:#8DC63F;color:#fff;font-weight:bold;padding:3px;font-size:10px;text-transform:uppercase">${label}</div>`;
  const bul = (items) => (items?.length ? `<ul style="margin:4px 0;padding-left:18px">${items.map(x => `<li>${x}</li>`).join("")}</ul>` : "—");
  const diagnoses = plan.diagnoses?.length ? plan.diagnoses : [{}];
  const blocks = diagnoses.map((d, i) => {
    const o = plan.outcomes?.[i] || {}; const n = plan.interventions?.[i] || {};
    const factors = (d.related_to || "").split(/[,;]\s*/).filter(Boolean);
    const chars = (d.evidence || "").split(/[,;]\s*/).filter(Boolean);
    const education = (plan.patient_education || "").split("\n").filter(Boolean);
    const followup = (plan.follow_up || "").split("\n").filter(Boolean);
    const nandaHtml = `<b>${d.nanda || "—"} ${d.code ? `(${d.code})` : ""}</b><br>Relacionado con ${d.related_to || "—"}, manifestado por ${d.evidence || "—"}.`;
    const nicHtml = `<b>${n.nic || "—"} ${n.code ? `(${n.code})` : ""}</b>${bul(n.activities)}`;
    const factorsHtml = `${head("Factores Relacionados: (Causas) E:")}${bul(factors)}${head("Características Definitorias (Signos y Síntomas)")}${bul(chars)}`;
    const nocHtml = `<b>${o.noc || "—"} ${o.code ? `(${o.code})` : ""}</b><br>${o.definition || ""}`;
    const indHtml = `${bul(o.indicators)}Escala: Inicial ${o.scale_initial || "—"} → Esperada ${o.scale_expected || "—"}<br><b>Puntuación Diana: ${plan.diana_score || "—"}</b>`;
    return `<table border="1" cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse;border:1px solid #000;margin-bottom:16px">
      <tr><td style="width:50%;border:1px solid #000;vertical-align:top">${head("Diagnóstico Enfermero (Etiqueta NANDA)")}<div style="padding:4px">${nandaHtml}</div></td><td style="width:50%;border:1px solid #000;vertical-align:top">${head("Intervención: (NIC)")}<div style="padding:4px">${nicHtml}</div></td></tr>
      <tr><td style="border:1px solid #000;vertical-align:top">${factorsHtml}</td><td style="border:1px solid #000;vertical-align:top">${head("Actividades:")}${bul(n.activities)}</td></tr>
      <tr><td style="border:1px solid #000;vertical-align:top">${head("Resultado Esperado: (NOC)")}<div style="padding:4px">${nocHtml}</div></td><td style="border:1px solid #000;vertical-align:top">${head("Indicadores / Escala de Medición / Puntuación Diana")}<div style="padding:4px">${indHtml}</div></td></tr>
      <tr><td style="border:1px solid #000;vertical-align:top">${head("Educación al Paciente y Cuidador")}${bul(education)}</td><td style="border:1px solid #000;vertical-align:top">${head("Recomendaciones de Seguimiento")}${bul(followup)}</td></tr>
    </table>`;
  }).join("");
  const html = `<html><meta charset="utf-8"><body style="font-family:Arial">
  <div style="display:flex;justify-content:space-between;border-bottom:2px solid #000;padding-bottom:6px">
    <div><div style="font-size:20px;font-weight:bold;color:#8DC63F">AREANDINA</div><div style="font-size:10px">Fundación Universitaria del Área Andina</div></div>
    <div style="text-align:center;font-weight:bold;font-size:11px">FACULTAD CIENCIAS DE LA SALUD<br>ENFERMERÍA</div>
    <table style="font-size:10px;border-collapse:collapse"><tr><td style="border:1px solid #000;padding:2px"><b>VERSIÓN:</b></td><td style="border:1px solid #000;padding:2px">${plan.version || "01"}</td></tr><tr><td style="border:1px solid #000;padding:2px"><b>CÓDIGO:</b></td><td style="border:1px solid #000;padding:2px">${plan.code || "—"}</td></tr><tr><td style="border:1px solid #000;padding:2px"><b>FECHA:</b></td><td style="border:1px solid #000;padding:2px">${plan.pae_date || "—"}</td></tr></table>
  </div>
  <div style="background:#d4edda;text-align:center;font-weight:bold;padding:6px;margin:8px 0">PLAN DE ATENCIÓN DE ENFERMERÍA</div>
  <table border="1" cellpadding="4" style="width:100%;border-collapse:collapse;border:1px solid #000"><tr><td><b>Nombres y Apellidos:</b> ${p.full_name}</td><td><b>Servicio:</b> ${plan.service || "—"}</td></tr><tr><td><b>Edad:</b> ${age}</td><td><b>N° de Cama:</b> ${plan.bed_number || "—"}</td></tr><tr><td><b>N° Historia Clínica:</b> ${plan.medical_record || p.code}</td><td><b>N° de Ingreso:</b> ${plan.admission_number || "—"}</td></tr><tr><td colspan="2"><b>Diagnóstico Médico:</b> ${plan.medical_diagnosis || "—"}</td></tr></table>
  ${blocks}
  </body></html>`;
  const blob = new Blob([html], { type: "application/msword" }); const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `PAE-Intrahospitalario-${plan.patient_name || ""}.doc`; link.click(); URL.revokeObjectURL(link.href);
}

export function exportPdf(plan, patient) { if (plan.pae_type === "intrahospitalario") exportPaeIntraPdf(plan, patient); else exportPaePdf(plan, patient); }
export function exportWord(plan, patient) { if (plan.pae_type === "intrahospitalario") exportPaeIntraWord(plan, patient); else exportPaeWord(plan, patient); }