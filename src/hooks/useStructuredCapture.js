import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { SCALES } from "@/lib/scales";

export default function useStructuredCapture(onSaved) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(captureData, patient, guides) {
    setLoading(true);
    setError("");
    try {
      const context = guides.slice(0, 5).map((g) => `${g.title}: ${g.content}`).join("\n");
      const paeType = (captureData.pae_type || "intrahospitalario").toLowerCase() === "comunitario" ? "comunitario" : "intrahospitalario";
      const scales = captureData.scales || {};
      const scalesSummary = Object.keys(scales).length > 0
        ? Object.entries(scales).map(([key, val]) => `${SCALES[key]?.name || key}: ${val.score} puntos (${val.interpretation})`).join("\n")
        : "No se aplicaron escalas en esta valoración.";

      const clinicalImages = captureData.clinical_images || [];
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Actúa como enfermero especialista en Proceso de Atención de Enfermería (PAE), NANDA-I, NOC, NIC, seguridad del paciente y valoración clínica hospitalaria y comunitaria.

${clinicalImages.length > 0 ? `IMÁGENES CLÍNICAS ADJUNTAS: Se han proporcionado ${clinicalImages.length} imagen(es) clínica(s). Analízalas visualmente para identificar hallazgos relevantes (tipo y estado de heridas, lesiones, signos clínicos, resultados de estudios imagenológicos, etc.) e intégralos en la valoración y diagnósticos NANDA. Describe lo que observas en cada imagen y relaciónalo con los datos clínicos.` : ""}

Tipo de PAE: ${paeType}

Analiza la siguiente valoración estructurada y genera mínimo 4 Planes de Atención de Enfermería (PAE) independientes, basados en NANDA-I, NOC y NIC. No inventes información ni signos que no estén en los datos. Si faltan datos críticos para un diagnóstico, omítelo. Cada PAE debe ser independiente y completo.

INSTRUCCIONES SOBRE ESCALAS DE VALORACIÓN:
- Utiliza los resultados de las escalas para identificar riesgos, priorizar problemas, generar diagnósticos NANDA, recomendar intervenciones NIC y evaluar la respuesta al tratamiento.
- Interpreta clínicamente cada escala: no te limites al puntaje. Relaciona el resultado con la evolución del paciente y con NANDA, NOC y NIC.
- Para cada PAE, indica qué escalas sustentan el diagnóstico y los resultados esperados (escala inicial vs escala esperada).
- Si es PAE comunitario, prioriza promoción de la salud, educación al paciente y cuidador, adherencia terapéutica y seguimiento en el domicilio.
- Si es PAE intrahospitalario, prioriza seguridad del paciente, prevención de riesgos (UPP, caídas, dolor) y cuidado agudo.

Datos de valoración estructurada (incluye los 11 patrones funcionales de Gordon):
${JSON.stringify(captureData, null, 2)}

Escalas aplicadas y resultados:
${scalesSummary}

Guías clínicas disponibles:
${context}

Para cada PAE genera:
1. Título descriptivo del PAE
2. Valoración resumida
3. Diagnóstico médico (si se puede inferir de los datos)
4. Diagnósticos NANDA-I: código, dominio, clase, definición, factores relacionados o de riesgo, características definitorias
5. Resultados NOC: código, indicadores, escala inicial y esperada (1-5)
6. Intervenciones NIC: código, actividades detalladas, fundamentación científica
7. Escalas aplicadas: nombre, puntuación, interpretación y relación con el diagnóstico
8. Ejecución: plan de implementación
9. Evaluación: criterios de evaluación incluyendo comparación de escalas inicial vs esperada
10. Educación al paciente y cuidador
11. Recomendaciones para el seguimiento
12. Puntuación DIANA si aplica

Genera todos los PAE que la valoración justifique, mínimo 4.`,
        file_urls: clinicalImages.length > 0 ? clinicalImages : undefined,
        response_json_schema: {
          type: "object",
          properties: {
            plans: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  medical_diagnosis: { type: "string" },
                  assessment: { type: "string" },
                  diagnoses: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        nanda: { type: "string" },
                        code: { type: "string" },
                        definition: { type: "string" },
                        related_to: { type: "string" },
                        evidence: { type: "string" },
                        domain: { type: "string" },
                        class: { type: "string" }
                      }
                    }
                  },
                  outcomes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        noc: { type: "string" },
                        code: { type: "string" },
                        indicators: { type: "array", items: { type: "string" } },
                        scale_initial: { type: "string" },
                        scale_expected: { type: "string" }
                      }
                    }
                  },
                  interventions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        nic: { type: "string" },
                        code: { type: "string" },
                        activities: { type: "array", items: { type: "string" } },
                        rationale: { type: "string" }
                      }
                    }
                  },
                  execution: { type: "string" },
                  evaluation: { type: "string" },
                  patient_education: { type: "string" },
                  follow_up: { type: "string" },
                  diana_score: { type: "string" },
                  scale_assessments: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        scale: { type: "string" },
                        score: { type: "string" },
                        interpretation: { type: "string" }
                      }
                    }
                  }
                },
                required: ["title", "assessment", "diagnoses", "outcomes", "interventions"]
              }
            }
          },
          required: ["plans"]
        }
      });

      const plans = result.plans || [];
      const saved = await Promise.all(
        plans.map((plan) =>
          base44.entities.CarePlan.create({
            ...plan,
            patient_id: patient.id,
            patient_name: patient.full_name,
            pae_type: paeType,
            status: "borrador",
            ai_generated: true
          })
        )
      );

      onSaved();
      return saved;
    } catch {
      setError("No se pudieron generar los PAE. Revisa los datos e inténtalo de nuevo.");
      return null;
    } finally {
      setLoading(false);
    }
  }

  return { generate, loading, error };
}