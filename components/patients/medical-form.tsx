"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function MedicalForm({
  patientId,
  initial = {},
}: {
  patientId: string;
  initial?: { diagnosis?: string; treatment?: string; prescription?: string; additionalInfo?: string };
}) {
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Failed to save";
  const router = useRouter();
  const [diagnosis, setDiagnosis] = useState(initial.diagnosis || "");
  const [treatment, setTreatment] = useState(initial.treatment || "");
  const [prescription, setPrescription] = useState(initial.prescription || "");
  const [additionalInfo, setAdditionalInfo] = useState(initial.additionalInfo || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/patients/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, diagnosis, treatment, prescription, additionalInfo }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-400">Diagnosed</label>
        <input value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400">Treatment</label>
        <input value={treatment} onChange={(e) => setTreatment(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400">Prescription</label>
        <input value={prescription} onChange={(e) => setPrescription(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2" />
      </div>
      <div>
        <label className="text-xs font-bold text-slate-400">Additional Notes</label>
        <textarea value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} className="mt-2 w-full rounded-md border px-3 py-2" />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-white">
          {loading ? "Saving..." : "Save & Update"}
        </button>
      </div>
    </form>
  );
}
