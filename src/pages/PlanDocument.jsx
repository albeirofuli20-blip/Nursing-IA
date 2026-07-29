import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import PaeDocument from "@/components/pae/PaeDocument";

export default function PlanDocument() {
  const { id } = useParams(); const navigate = useNavigate(); const [plan, setPlan] = useState(null); const [patient, setPatient] = useState(null); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const p = await base44.entities.CarePlan.get(id); setPlan(p); if (p.patient_id) { try { setPatient(await base44.entities.Patient.get(p.patient_id)); } catch {} } } finally { setLoading(false); } })(); }, [id]);
  if (loading) return <div className="grid min-h-screen place-items-center bg-slate-100"><div className="h-8 w-8 animate-spin rounded-full border-4 border-[#00A8B5]/30 border-t-[#002D62]" /></div>;
  if (!plan) return <div className="grid min-h-screen place-items-center bg-slate-100"><p className="text-slate-500">No se encontró el plan.</p></div>;
  return <PaeDocument plan={plan} patient={patient} onBack={() => navigate("/")} />;
}