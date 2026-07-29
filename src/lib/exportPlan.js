import { jsPDF } from "jspdf";

const lines = (plan) => [
  plan.title, `Paciente: ${plan.patient_name}`, `Estado: ${plan.status}`, "", "Valoración", plan.assessment || "—", "",
  "Diagnósticos NANDA", ...(plan.diagnoses || []).map((d, i) => `${i + 1}. ${d.nanda}\nRelacionado con: ${d.related_to}\nEvidenciado por: ${d.evidence}`), "",
  "Resultados NOC", ...(plan.outcomes || []).map((o, i) => `${i + 1}. ${o.noc} — ${o.indicator} — Meta: ${o.target}`), "",
  "Intervenciones NIC", ...(plan.interventions || []).map((n, i) => `${i + 1}. ${n.nic}\n${(n.activities || []).map(a => `• ${a}`).join("\n")}`), "",
  "Evaluación", plan.evaluation || "Pendiente"
];

export function exportPdf(plan) {
  const pdf = new jsPDF(); let y = 18;
  lines(plan).forEach((text) => pdf.splitTextToSize(String(text), 175).forEach((line) => { if (y > 280) { pdf.addPage(); y = 18; } pdf.text(line, 18, y); y += 6; }));
  pdf.save(`PAE-${plan.patient_name}.pdf`);
}

export function exportWord(plan) {
  const body = lines(plan).map((line) => `<p>${String(line).replaceAll("\n", "<br>")}</p>`).join("");
  const blob = new Blob([`<html><meta charset="utf-8"><body>${body}</body></html>`], { type: "application/msword" });
  const link = document.createElement("a"); link.href = URL.createObjectURL(blob); link.download = `PAE-${plan.patient_name}.doc`; link.click(); URL.revokeObjectURL(link.href);
}