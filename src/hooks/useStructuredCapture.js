import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { SCALES } from "@/lib/scales";
import { AIService } from "@/lib/aiService";

export default function useStructuredCapture(onSaved) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function generate(captureData, patient, guides) {
    setLoading(true);
    setError("");
    try {
      const scales = captureData.scales || {};
      const scalesSummary = Object.keys(scales).length > 0
        ? Object.entries(scales).map(([key, val]) => `${SCALES[key]?.name || key}: ${val.score} puntos (${val.interpretation})`).join("\n")
        : "No se aplicaron escalas en esta valoración.";

      const enrichedData = { ...captureData, scales_summary: scalesSummary };
      const result = await AIService.generatePAE(enrichedData, guides);
      const plans = result?.plans || [];

      const paeType = (captureData.pae_type || "intrahospitalario").toLowerCase() === "comunitario" ? "comunitario" : "intrahospitalario";
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