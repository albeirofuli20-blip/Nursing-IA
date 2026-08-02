import { useState } from "react";
import { base44 } from "@/api/base44Client";

export default function useStructuredCapture(onSaved) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(captureData, patient, guides) {
    setLoading(true);
    setError("");
    try {
      const context = guides.slice(0, 5).map((g) => `${g.title}: ${g.content}`).join("\n");
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Actúa como asistente clínico de enfermería especializado. Analiza la siguiente valoración estructurada y genera mínimo 4 Planes de Atención de Enfermería (PAE) independientes, basados en las taxonomías NANDA-I, NOC y NIC. No inventes información ni signos que no estén en los datos. Si faltan datos críticos para un diagnóstico, omítelo. Cada PAE debe ser independiente y completo.

Datos de valoración estructurada:
${JSON.stringify(captureData, null, 2)}

Guías clínicas disponibles:
${context}

Para cada PAE genera:
1. Título descriptivo del PAE
2. Valoración resumida
3. Diagnóstico médico (si se puede inferir de los datos)
4. Diagnósticos NANDA-I: código, dominio, clase, definición, factores relacionados o de riesgo, características definitorias
5. Resultados NOC: código, indicadores, escala inicial y esperada (1-5)
6. Intervenciones NIC: código, actividades detalladas, fundamentación científica
7. Ejecución: plan de implementación
8. Evaluación: criterios de evaluación
9. Educación al paciente y cuidador
10. Recomendaciones para el seguimiento
11. Puntuación DIANA si aplica

Genera todos los PAE que la valoración justifique, mínimo 4.`,
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
                  diana_score: { type: "string" }
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