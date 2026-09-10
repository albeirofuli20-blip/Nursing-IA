import { useState, useRef, useEffect } from "react";
import { Sparkles, Send, Loader2, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function ClinicalAiAssistant({ contextLabel, contextData, placeholder }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, loading]);

  async function ask(question) {
    if (!question.trim() || loading) return;
    const userMsg = { role: "user", text: question };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);
    try {
      const prompt = `Eres un asistente clínico de enfermería experto. Responde en español, de forma clara y concisa, basándote en evidencia científica y taxonomía NANDA/NIC/NOC.\n\nContexto del recurso clínico (${contextLabel}):\n${JSON.stringify(contextData, null, 2)}\n\nPregunta del profesional de enfermería: ${question}\n\nProporciona una respuesta práctica, accionable y segura. Si la pregunta implica riesgo clínico, recomienda consultar siempre con el equipo médico.`;
      const response = await base44.functions.invoke("aiInvoke", { action: "clinical_chat", prompt, model: "gemini_3_flash" });
      const res = response.data;
      const text = typeof res === "string" ? res : res?.response || res?.text || JSON.stringify(res);
      setMessages((prev) => [...prev, { role: "assistant", text }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "No pude procesar la consulta. Intenta nuevamente." }]);
    } finally {
      setLoading(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)} className="gap-1.5 border-[#00A8B5] text-[#00A8B5] hover:bg-[#00A8B5]/10">
        <Sparkles className="h-4 w-4" /> Preguntar a la IA
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4 sm:items-center sm:justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
      <div className="relative flex h-[70vh] w-full max-w-lg flex-col rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b bg-[#002D62] px-4 py-3 text-white">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-[#00A8B5]" /><div><p className="text-sm font-bold">Asistente IA Clínico</p><p className="text-xs text-white/70">{contextLabel}</p></div></div>
          <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white"><X className="h-5 w-5" /></button>
        </div>
        <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
          {messages.length === 0 && (
            <div className="space-y-2">
              <p className="text-sm text-slate-500">Preguntas sugeridas:</p>
              {(placeholder || []).map((q, i) => (
                <button key={i} onClick={() => ask(q)} className="block w-full rounded-lg border border-slate-200 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50">{q}</button>
              ))}
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm ${m.role === "user" ? "bg-[#00A8B5] text-white" : "bg-slate-100 text-slate-800"}`}>{m.text}</div>
            </div>
          ))}
          {loading && <div className="flex items-center gap-2 text-sm text-slate-500"><Loader2 className="h-4 w-4 animate-spin" /> Procesando…</div>}
        </div>
        <form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="border-t p-3">
          <div className="flex gap-2">
            <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Escribe tu pregunta clínica…" disabled={loading} />
            <Button type="submit" size="icon" disabled={loading || !input.trim()} className="bg-[#00A8B5] hover:bg-[#00A8B5]/90"><Send className="h-4 w-4" /></Button>
          </div>
        </form>
      </div>
    </div>
  );
}