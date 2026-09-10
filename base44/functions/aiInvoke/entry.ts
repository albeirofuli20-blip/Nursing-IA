import { createClientFromRequest } from 'npm:@base44/sdk@0.8.44';

/**
 * aiInvoke — Punto único y seguro para todas las llamadas a InvokeLLM.
 *
 * Protege los créditos de integración:
 *   1. Autentica al usuario (debe estar logueado).
 *   2. Valida que la acción esté en una lista de operaciones permitidas de la app.
 *   3. Restringe el modelo a opciones económicas para usuarios no-admin.
 *   4. Registra auditoría de uso para trazabilidad de créditos.
 *
 * El cliente nunca llama base44.integrations.Core.InvokeLLM directamente;
 * siempre pasa por aquí con un action específico.
 */

const ALLOWED_ACTIONS = new Set([
  "generate_pae",
  "generate_nanda",
  "suggest_nic",
  "suggest_noc",
  "create_evolution",
  "summarize_history",
  "ai_chat",
  "analyze_case",
  "generate_educational",
  "clinical_chat",
  "check_interactions",
  "recognize_medication",
  "autofill_medication",
  "search_web_guide",
  "generate_plan",
]);

// Modelos económicos permitidos para todos los usuarios.
// Modelos costosos (claude_opus, gpt_5_4, etc.) solo para admins.
const ECONOMICAL_MODELS = new Set(["automatic", "gemini_3_flash", "gpt_5_mini"]);

export default async function(req) {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { action, prompt, response_json_schema, file_urls, model, add_context_from_internet } = body;

    if (!action || !ALLOWED_ACTIONS.has(action)) {
      return Response.json({ error: "Acción no permitida" }, { status: 400 });
    }
    if (!prompt || typeof prompt !== "string") {
      return Response.json({ error: "Prompt requerido" }, { status: 400 });
    }

    // Restringir modelo: económico por defecto; costosos solo para admin.
    let resolvedModel = model || "gemini_3_flash";
    if (!ECONOMICAL_MODELS.has(resolvedModel) && user.role !== "admin") {
      resolvedModel = "gemini_3_flash";
    }
    // add_context_from_internet solo funciona con modelos gemini.
    if (add_context_from_internet && resolvedModel !== "gemini_3_flash" && resolvedModel !== "gemini_3_1_pro") {
      resolvedModel = "gemini_3_flash";
    }

    const params = { prompt, model: resolvedModel };
    if (response_json_schema) params.response_json_schema = response_json_schema;
    if (file_urls && Array.isArray(file_urls) && file_urls.length > 0) params.file_urls = file_urls;
    if (add_context_from_internet) params.add_context_from_internet = true;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM(params);

    // Auditoría no bloqueante para trazabilidad de créditos.
    try {
      await base44.entities.AuditLog.create({
        action: "ai_generate",
        description: `AI invoke: ${action}`,
        user_email: user.email || "",
        entity_type: "AI",
        metadata: JSON.stringify({ model: resolvedModel, action }),
      });
    } catch { /* la auditoría no debe bloquear el flujo */ }

    return Response.json(result);
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}