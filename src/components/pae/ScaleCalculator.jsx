import { useState, useEffect } from "react";
import { Activity, RotateCcw } from "lucide-react";
import { SCALES } from "@/lib/scales";
import { Button } from "@/components/ui/button";

export default function ScaleCalculator({ scaleKey, onScoreChange }) {
  const scale = SCALES[scaleKey];
  const [values, setValues] = useState({});
  const [evaValue, setEvaValue] = useState(0);
  const score = scale.single ? evaValue : Object.values(values).reduce((sum, v) => sum + (Number(v) || 0), 0);
  const interpretation = scale.interpret(score);
  const reset = () => { setValues({}); setEvaValue(0); };

  useEffect(() => { onScoreChange?.(score, interpretation); }, [score, interpretation, onScoreChange]);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-teal-50 p-2 text-teal-700"><Activity className="h-4 w-4" /></div>
          <div><h3 className="font-bold text-slate-900">{scale.name}</h3><p className="text-xs text-slate-500">{scale.category}</p></div>
        </div>
        <Button variant="ghost" size="icon" onClick={reset}><RotateCcw className="h-4 w-4" /></Button>
      </div>
      {scale.single ? (
        <div className="space-y-3">
          <input type="range" min="0" max="10" value={evaValue} onChange={(e) => setEvaValue(Number(e.target.value))} className="w-full accent-teal-700" />
          <div className="flex justify-between text-xs text-slate-400"><span>0</span><span>5</span><span>10</span></div>
        </div>
      ) : (
        <div className="space-y-3">
          {scale.items.map((item) => (
            <div key={item.key}>
              <label className="mb-1 block text-sm font-medium text-slate-700">{item.label}</label>
              <div className="flex flex-wrap gap-2">
                {item.options.map(([val, label]) => (
                  <button key={val} type="button" onClick={() => setValues({ ...values, [item.key]: val })} className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition ${values[item.key] === val ? "border-teal-700 bg-teal-700 text-white" : "border-slate-200 bg-white text-slate-600 hover:border-teal-300"}`}>{label} <span className="opacity-60">({val})</span></button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <div className="mt-5 flex items-center justify-between rounded-xl bg-slate-50 p-4">
        <div><p className="text-xs font-semibold uppercase text-slate-500">Puntuación</p><p className="text-3xl font-bold text-slate-900">{score}<span className="text-base text-slate-400">/{scale.max}</span></p></div>
        <div className="text-right"><p className="text-xs font-semibold uppercase text-slate-500">Interpretación</p><p className="text-lg font-bold text-teal-700">{interpretation}</p></div>
      </div>
    </div>
  );
}