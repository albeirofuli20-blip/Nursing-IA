import { base44 } from "@/api/base44Client";

/**
 * AIService — Capa desacoplada de inteligencia artificial para Nurse Master IA.
 *
 * Arquitectura:
 *   Usuario → Base44 → AIService → [Base44 InvokeLLM | Abacus.AI API] → Respuesta → BD → UI
 *
 * Esta capa abstrae el proveedor de IA. Si en el futuro se desea cambiar
 * de Abacus.AI a OpenAI, Claude, Gemini u otro, solo se reemplaza este módulo.
 * Toda la aplicación consume AIService, no el proveedor directamente.
 */

let _config = null;

async function loadConfig() {
  if (_config) return _config;
  try {
    const configs = await base44.entities.AiConfig.list();
    _config = configs[0] || null;
  } catch {
    _config = null;
  }
  return _config;
}

async function refreshConfig() {
  _config = null;
  return loadConfig();
}

/**
 * Registra una auditoría de operación sensible.
 */
async function logAudit(action, description, extra = {}) {
  try {
    const me = await base44.auth.me().catch(() => null);
    await base44.entities.AuditLog.create({
      action,
      description,
      user_email: me?.email || "",
      entity_type: extra.entity_type || "",
      entity_id: extra.entity_id || "",
      metadata: extra.metadata ? JSON.stringify(extra.metadata) : ""
    });
  } catch {
    /* la auditoría no debe bloquear el flujo principal */
  }
}

/**
 * Llamada unificada al proveedor de IA configurado.
 * - provider "base44": usa base44.integrations.Core.InvokeLLM
 * - provider "abacus": usa Abacus.AI mediante API REST (requiere backend function / Builder+)
 *
 * @param {object} params - { prompt, response_json_schema, file_urls, model, action }
 */
async function invokeAI({ prompt, response_json_schema, file_urls, model, action, add_context_from_internet }) {
  // Todas las llamadas a InvokeLLM se enrutan por el backend function aiInvoke,
  // que autentica al usuario, valida la acción y restringe el modelo para proteger créditos.
  return invokeBase44({ prompt, response_json_schema, file_urls, model, action, add_context_from_internet });
}

async function invokeBase44({ prompt, response_json_schema, file_urls, model, action, add_context_from_internet }) {
  const config = await loadConfig();
  const payload = { action, prompt };
  if (response_json_schema) payload.response_json_schema = response_json_schema;
  if (file_urls && file_urls.length > 0) payload.file_urls = file_urls;
  if (model || config?.default_model) payload.model = model || config.default_model;
  if (add_context_from_internet) payload.add_context_from_internet = true;
  const response = await base44.functions.invoke("aiInvoke", payload);
  return response.data;
}

// ─── Funciones de IA para Nurse Master IA ───

/**
 * Genera Planes de Atención de Enfermería (PAE) desde datos estructurados.
 */
async function generatePAE(captureData, guides, options = {}) {
  const config = await loadConfig();
  const paeType = (captureData.pae_type || "intrahospitalario").toLowerCase() === "comunitario" ? "comunitario" : "intrahospitalario";
  const clinicalImages = captureData.clinical_images || [];
  const context = guides.slice(0, 5).map((g) => `${g.title}: ${g.content}`).join("\n");

  const basePrompt = config?.prompt_pae || `Actúa como enfermero especialista en Proceso de Atención de Enfermería (PAE), NANDA-I, NOC, NIC, seguridad del paciente y valoración clínica hospitalaria y comunitaria.`;

  const prompt = `${basePrompt}

Tipo de PAE: ${paeType}

${clinicalImages.length > 0 ? `IMÁGENES CLÍNICAS ADJUNTAS: Se han proporcionado ${clinicalImages.length} imagen(es) clínica(s). Analízalas visualmente para identificar hallazgos relevantes (tipo y estado de heridas, lesiones, signos clínicos, resultados de estudios imagenológicos, etc.) e intégralos en la valoración y diagnósticos NANDA. Describe lo que observas en cada imagen y relaciónalo con los datos clínicos.` : ""}

Analiza la siguiente valoración estructurada y genera mínimo 4 Planes de Atención de Enfermería (PAE) independientes, basados en NANDA-I, NOC y NIC. No inventes información ni signos que no estén en los datos. Si faltan datos críticos para un diagnóstico, omítelo. Cada PAE debe ser independiente y completo.

Datos de valoración estructurada (incluye los 11 patrones funcionales de Gordon):
${JSON.stringify(captureData, null, 2)}

Guías clínicas disponibles:
${context}

Para cada PAE genera:
1. Título descriptivo del PAE
2. Valoración resumida
3. Diagnóstico médico (si se puede inferir)
4. Diagnósticos NANDA-I: código, dominio, clase, definición, factores relacionados, características definitorias
5. Resultados NOC: código, indicadores, escala inicial y esperada (1-5)
6. Intervenciones NIC: mínimo 4 intervenciones bien descriptas, cada una con código, actividades detalladas paso a paso y fundamentación científica
7. Escalas aplicadas: nombre, puntuación, interpretación
8. Ejecución: plan de implementación
9. Evaluación: criterios incluyendo comparación de escalas
10. Educación al paciente y cuidador
11. Recomendaciones para el seguimiento
12. Puntuación DIANA si aplica

Genera todos los PAE que la valoración justifique, mínimo 4. Cada PAE debe incluir mínimo 4 intervenciones NIC bien descriptas con actividades detalladas y fundamentación científica.`;

  const result = await invokeAI({
    prompt,
    file_urls: clinicalImages.length > 0 ? clinicalImages : undefined,
    model: options.model,
    action: "generate_pae",
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

  await logAudit("ai_generate", `Generación de PAE (${paeType}) — ${result?.plans?.length || 0} planes`, { entity_type: "CarePlan" });
  return result;
}

/**
 * Genera diagnósticos NANDA-I a partir de datos clínicos.
 */
async function generateNANDA(clinicalData) {
  const config = await loadConfig();
  const basePrompt = config?.prompt_nanda || "Actúa como experto en taxonomía NANDA-I.";
  const result = await invokeAI({
    prompt: `${basePrompt}\n\nGenera diagnósticos NANDA-I pertinentes a partir de los siguientes datos clínicos. Para cada uno incluye código, dominio, clase, definición, factores relacionados y características definitorias.\n\n${JSON.stringify(clinicalData, null, 2)}`,
    action: "generate_nanda",
    response_json_schema: {
      type: "object",
      properties: {
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
        }
      },
      required: ["diagnoses"]
    }
  });
  await logAudit("ai_generate", "Generación de diagnósticos NANDA");
  return result;
}

/**
 * Sugiere intervenciones NIC para un diagnóstico NANDA.
 */
async function suggestNIC(nandaDiagnosis) {
  const result = await invokeAI({
    prompt: `Actúa como experto en taxonomía NIC. Sugiere intervenciones NIC para el siguiente diagnóstico NANDA-I. Para cada intervención incluye código, actividades detalladas y fundamentación científica.\n\n${JSON.stringify(nandaDiagnosis, null, 2)}`,
    action: "suggest_nic",
    response_json_schema: {
      type: "object",
      properties: {
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
        }
      },
      required: ["interventions"]
    }
  });
  await logAudit("ai_generate", "Sugerencia de NIC");
  return result;
}

/**
 * Sugiere resultados NOC para un diagnóstico NANDA.
 */
async function suggestNOC(nandaDiagnosis) {
  const result = await invokeAI({
    prompt: `Actúa como experto en taxonomía NOC. Sugiere resultados NOC para el siguiente diagnóstico NANDA-I. Para cada resultado incluye código, indicadores, escala inicial y escala esperada (1-5).\n\n${JSON.stringify(nandaDiagnosis, null, 2)}`,
    action: "suggest_noc",
    response_json_schema: {
      type: "object",
      properties: {
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
        }
      },
      required: ["outcomes"]
    }
  });
  await logAudit("ai_generate", "Sugerencia de NOC");
  return result;
}

/**
 * Crea una evolución de enfermería.
 */
async function createEvolution(patientData, carePlan) {
  const config = await loadConfig();
  const basePrompt = config?.prompt_evolution || "Actúa como enfermero especialista en registro de evoluciones clínicas.";
  const result = await invokeAI({
    prompt: `${basePrompt}\n\nGenera una nota de evolución de enfermería profesional basada en los siguientes datos del paciente y plan de cuidado.\n\nPaciente:\n${JSON.stringify(patientData, null, 2)}\n\nPlan:\n${JSON.stringify(carePlan, null, 2)}`,
    action: "create_evolution"
  });
  await logAudit("ai_generate", "Creación de evolución de enfermería");
  return result;
}

/**
 * Resume una historia clínica.
 */
async function summarizeHistory(clinicalHistory) {
  const result = await invokeAI({
    prompt: `Actúa como enfermero especialista. Resume la siguiente historia clínica destacando los hallazgos relevantes, diagnósticos, tratamiento y plan de cuidado.\n\n${JSON.stringify(clinicalHistory, null, 2)}`,
    action: "summarize_history"
  });
  await logAudit("ai_generate", "Resumen de historia clínica");
  return result;
}

/**
 * Responde preguntas clínicas del chat IA.
 */
async function chatAssistant(question, context = {}) {
  const config = await loadConfig();
  const basePrompt = config?.prompt_chat || "Actúa como asistente inteligente de enfermería. Responde preguntas clínicas, explica patologías, ayuda con farmacología, interpreta laboratorios, ayuda con cálculos de medicamentos y cuidados de enfermería. Toda respuesta debe incluir aviso de validación humana.";
  const result = await invokeAI({
    prompt: `${basePrompt}\n\nPregunta del usuario: ${question}\n\nContexto adicional: ${JSON.stringify(context)}`,
    action: "ai_chat"
  });
  await logAudit("ai_chat", `Chat IA: ${question.substring(0, 80)}`);
  return result;
}

/**
 * Analiza un caso clínico.
 */
async function analyzeCase(caseData) {
  const result = await invokeAI({
    prompt: `Actúa como enfermero especialista. Analiza el siguiente caso clínico y proporciona valoración, diagnósticos NANDA prioritarios, objetivos NOC, intervenciones NIC y recomendaciones.\n\n${JSON.stringify(caseData, null, 2)}`,
    action: "analyze_case"
  });
  await logAudit("ai_generate", "Análisis de caso clínico");
  return result;
}

/**
 * Genera un plan educativo para paciente/cuidador.
 */
async function generateEducationalPlan(patientData, diagnosis) {
  const config = await loadConfig();
  const basePrompt = config?.prompt_educational || "Actúa como enfermero educador. Genera un plan educativo estructurado para el paciente y cuidador.";
  const result = await invokeAI({
    prompt: `${basePrompt}\n\nDatos del paciente:\n${JSON.stringify(patientData, null, 2)}\n\nDiagnóstico:\n${diagnosis}`,
    action: "generate_educational"
  });
  await logAudit("ai_generate", "Plan educativo generado");
  return result;
}

export const AIService = {
  generatePAE,
  generateNANDA,
  suggestNIC,
  suggestNOC,
  createEvolution,
  summarizeHistory,
  chatAssistant,
  analyzeCase,
  generateEducationalPlan,
  refreshConfig,
  loadConfig,
  logAudit
};

export default AIService;