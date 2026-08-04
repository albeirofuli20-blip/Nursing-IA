import { useState, useEffect } from "react";
import { Brain, Database, Sliders, BarChart3, DollarSign, FileCheck, Shield, AlertTriangle, Key, Save, RefreshCw, Cpu, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { base44 } from "@/api/base44Client";
import { AIService } from "@/lib/aiService";

const DEFAULT_PROMPTS = {
  prompt_pae: "Actúa como enfermero especialista en Proceso de Atención de Enfermería (PAE), NANDA-I, NOC, NIC, seguridad del paciente y valoración clínica hospitalaria y comunitaria.",
  prompt_nanda: "Actúa como experto en taxonomía NANDA-I.",
  prompt_chat: "Actúa como asistente inteligente de enfermería. Responde preguntas clínicas, explica patologías, ayuda con farmacología, interpreta laboratorios, ayuda con cálculos de medicamentos y cuidados de enfermería. Toda respuesta debe incluir aviso de validación humana.",
  prompt_evolution: "Actúa como enfermero especialista en registro de evoluciones clínicas.",
  prompt_educational: "Actúa como enfermero educador. Genera un plan educativo estructurado para el paciente y cuidador."
};

export default function AiConfigPanel() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("provider");

  useEffect(() => { loadConfig(); }, []);

  async function loadConfig() {
    setLoading(true);
    try {
      const configs = await base44.entities.AiConfig.list();
      if (configs.length > 0) {
        setConfig(configs[0]);
      } else {
        setConfig({
          provider: "base44",
          abacus_endpoint: "https://api.abacus.ai/api/v1",
          default_model: "automatic",
          max_tokens_per_request: 8000,
          monthly_token_limit: 500000,
          tokens_used_this_month: 0,
          guardrails_enabled: true,
          citation_required: true,
          two_factor_required: false,
          is_active: true,
          ...DEFAULT_PROMPTS
        });
      }
    } catch { setConfig(null); }
    finally { setLoading(false); }
  }

  const set = (key, val) => { setConfig((c) => ({ ...c, [key]: val })); setSaved(false); };

  async function save() {
    setSaving(true);
    try {
      if (config.id) {
        await base44.entities.AiConfig.update(config.id, config);
      } else {
        await base44.entities.AiConfig.create(config);
      }
      await AIService.refreshConfig();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch { /* error */ }
    finally { setSaving(false); }
  }

  if (loading) return <div className="p-8 text-center text-slate-400">Cargando configuración...</div>;
  if (!config) return <div className="p-8 text-center text-red-500">No se pudo cargar la configuración.</div>;

  const tokenUsage = config.tokens_used_this_month || 0;
  const tokenLimit = config.monthly_token_limit || 500000;
  const usagePct = Math.min(100, (tokenUsage / tokenLimit) * 100);

  const TABS = [
    { id: "provider", label: "Proveedor IA", icon: Cpu },
    { id: "prompts", label: "Prompts", icon: Brain },
    { id: "tokens", label: "Tokens y consumo", icon: Activity },
    { id: "security", label: "Seguridad", icon: Shield }
  ];

  return (
    <section>
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wider text-[#00A8B5]">Configuración de IA</p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">Panel de gestión de IA</h2>
        <p className="mt-2 text-slate-600">El Super Administrador configura el proveedor de IA (Base44 o Abacus.AI), administra prompts, controla consumo de tokens y supervisa métricas.</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${activeTab === t.id ? "bg-white text-[#002D62] shadow-sm" : "text-slate-500"}`}>
              <Icon className="h-4 w-4" />{t.label}
            </button>
          );
        })}
      </div>

      {/* Provider tab */}
      {activeTab === "provider" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Cpu className="h-5 w-5 text-[#002D62]" />Proveedor de Inteligencia Artificial</h3>
          <p className="text-sm text-slate-500">Selecciona el motor de IA. La capa AIService está desacoplada: si cambias de proveedor, no necesitas reconstruir la aplicación.</p>

          <div className="grid gap-3 sm:grid-cols-2">
            <button onClick={() => set("provider", "base44")} className={`rounded-xl border-2 p-4 text-left transition ${config.provider === "base44" ? "border-[#002D62] bg-[#002D62]/5" : "border-slate-200"}`}>
              <div className="mb-1 flex items-center justify-between"><span className="font-semibold text-slate-900">Base44 (InvokeLLM)</span>{config.provider === "base44" && <Badge className="bg-[#002D62] text-white">Activo</Badge>}</div>
              <p className="text-xs text-slate-500">Proveedor integrado. Modelos GPT, Claude, Gemini. Sin configuración extra.</p>
            </button>
            <button onClick={() => set("provider", "abacus")} className={`rounded-xl border-2 p-4 text-left transition ${config.provider === "abacus" ? "border-[#00A8B5] bg-[#00A8B5]/5" : "border-slate-200"}`}>
              <div className="mb-1 flex items-center justify-between"><span className="font-semibold text-slate-900">Abacus.AI</span>{config.provider === "abacus" && <Badge className="bg-[#00A8B5] text-white">Activo</Badge>}</div>
              <p className="text-xs text-slate-500">Motor de IA externo mediante API REST. Requiere API Key.</p>
            </button>
          </div>

          {config.provider === "abacus" && (
            <div className="space-y-3 rounded-xl border border-[#00A8B5]/30 bg-[#00A8B5]/5 p-4">
              <h4 className="flex items-center gap-2 text-sm font-bold text-[#002D62]"><Key className="h-4 w-4" />Credenciales de Abacus.AI</h4>
              <div>
                <Label className="text-xs font-semibold text-slate-600">API Key de Abacus.AI</Label>
                <Input type="password" value={config.abacus_api_key || ""} onChange={(e) => set("abacus_api_key", e.target.value)} placeholder="abk-xxxxxxxxxxxxx" className="mt-1" />
                <p className="mt-1 text-xs text-slate-400">La API Key se almacena cifrada y solo es accesible por administradores.</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <Label className="text-xs font-semibold text-slate-600">Endpoint de Abacus.AI</Label>
                  <Input value={config.abacus_endpoint || ""} onChange={(e) => set("abacus_endpoint", e.target.value)} className="mt-1" />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-slate-600">Model ID (Abacus)</Label>
                  <Input value={config.abacus_model_id || ""} onChange={(e) => set("abacus_model_id", e.target.value)} placeholder="ID del modelo desplegado" className="mt-1" />
                </div>
              </div>
              <div className="flex items-start gap-2 rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>La llamada a Abacus.AI requiere un <strong>backend function</strong> (plan Builder+) para no exponer la API Key en el frontend. Mientras tanto, el sistema usa el proveedor Base44 como respaldo automático.</p>
              </div>
            </div>
          )}

          <div>
            <Label className="text-xs font-semibold text-slate-600">Modelo por defecto (Base44)</Label>
            <select value={config.default_model || "automatic"} onChange={(e) => set("default_model", e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm">
              <option value="automatic">Automático</option>
              <option value="gpt_5_mini">GPT-5 Mini</option>
              <option value="gemini_3_flash">Gemini 3 Flash</option>
              <option value="claude_sonnet_4_6">Claude Sonnet 4.6</option>
              <option value="claude_opus_4_8">Claude Opus 4.8</option>
            </select>
          </div>
        </div>
      )}

      {/* Prompts tab */}
      {activeTab === "prompts" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Brain className="h-5 w-5 text-[#002D62]" />Prompts del sistema</h3>
          <p className="text-sm text-slate-500">Personaliza las instrucciones que recibe la IA para cada función. Usa "Restaurar" para volver al valor por defecto.</p>
          {Object.entries(DEFAULT_PROMPTS).map(([key, defaultVal]) => (
            <div key={key}>
              <div className="flex items-center justify-between">
                <Label className="text-xs font-semibold text-slate-600">{key.replace("prompt_", "").toUpperCase()}</Label>
                <button onClick={() => set(key, defaultVal)} className="text-xs text-[#00A8B5] hover:underline">Restaurar</button>
              </div>
              <Textarea value={config[key] || ""} onChange={(e) => set(key, e.target.value)} rows={3} className="mt-1" />
            </div>
          ))}
        </div>
      )}

      {/* Tokens tab */}
      {activeTab === "tokens" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Activity className="h-5 w-5 text-[#002D62]" />Control de consumo de tokens</h3>
          <div className="rounded-xl bg-slate-50 p-4">
            <div className="mb-2 flex items-center justify-between text-sm">
              <span className="font-medium text-slate-700">Consumo del mes</span>
              <span className="font-bold text-slate-900">{tokenUsage.toLocaleString()} / {tokenLimit.toLocaleString()} tokens</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-slate-200">
              <div className={`h-full rounded-full transition-all ${usagePct > 80 ? "bg-red-500" : usagePct > 50 ? "bg-amber-500" : "bg-[#00A8B5]"}`} style={{ width: `${usagePct}%` }} />
            </div>
            <p className="mt-2 text-xs text-slate-400">{usagePct.toFixed(1)}% utilizado</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <Label className="text-xs font-semibold text-slate-600">Límite mensual de tokens</Label>
              <Input type="number" value={config.monthly_token_limit || 0} onChange={(e) => set("monthly_token_limit", parseInt(e.target.value) || 0)} className="mt-1" />
            </div>
            <div>
              <Label className="text-xs font-semibold text-slate-600">Máximo tokens por solicitud</Label>
              <Input type="number" value={config.max_tokens_per_request || 0} onChange={(e) => set("max_tokens_per_request", parseInt(e.target.value) || 0)} className="mt-1" />
            </div>
          </div>
        </div>
      )}

      {/* Security tab */}
      {activeTab === "security" && (
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900"><Shield className="h-5 w-5 text-[#002D62]" />Seguridad y cumplimiento</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-1">
              <div><Label>Guardrails de seguridad</Label><p className="text-xs text-slate-500">Bloquea recomendaciones peligrosas o fuera de alcance.</p></div>
              <Switch checked={config.guardrails_enabled} onCheckedChange={(v) => set("guardrails_enabled", v)} />
            </div>
            <div className="flex items-center justify-between py-1">
              <div><Label>Citación obligatoria de fuentes</Label><p className="text-xs text-slate-500">La IA debe citar la fuente cuando usa RAG.</p></div>
              <Switch checked={config.citation_required} onCheckedChange={(v) => set("citation_required", v)} />
            </div>
            <div className="flex items-center justify-between py-1">
              <div><Label>Autenticación en dos pasos (2FA)</Label><p className="text-xs text-slate-500">Exigir verificación en dos pasos a todos los usuarios.</p></div>
              <Switch checked={config.two_factor_required} onCheckedChange={(v) => set("two_factor_required", v)} />
            </div>
          </div>
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4">
            <AlertTriangle className="h-5 w-5 shrink-0 text-amber-600" />
            <div>
              <h4 className="text-sm font-bold text-amber-900">Privacidad de la IA</h4>
              <p className="mt-1 text-sm text-amber-700">La IA no utiliza datos privados de un usuario para responder a otro. El administrador supervisa métricas agregadas pero no accede al contenido de consultas individuales. El historial de auditoría registra todas las operaciones sensibles.</p>
            </div>
          </div>
        </div>
      )}

      {/* Save bar */}
      <div className="mt-6 flex items-center gap-3">
        <Button onClick={save} disabled={saving} className="bg-[#002D62] hover:bg-[#001f4d]">
          {saving ? <><RefreshCw className="h-4 w-4 animate-spin" />Guardando...</> : <><Save className="h-4 w-4" />Guardar configuración</>}
        </Button>
        {saved && <span className="text-sm font-medium text-green-600">✓ Configuración guardada</span>}
      </div>
    </section>
  );
}