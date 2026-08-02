import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

export function LabeledInput({ label, value, onChange, ...props }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <Input value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-1" {...props} />
    </div>
  );
}

export function LabeledTextarea({ label, value, onChange, rows = 3, ...props }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <Textarea value={value || ""} onChange={(e) => onChange(e.target.value)} rows={rows} className="mt-1" {...props} />
    </div>
  );
}

export function LabeledSelect({ label, value, onChange, options }) {
  return (
    <div>
      <Label className="text-xs font-semibold text-slate-600">{label}</Label>
      <select value={value || ""} onChange={(e) => onChange(e.target.value)} className="mt-1 h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
        <option value="">Seleccionar...</option>
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}