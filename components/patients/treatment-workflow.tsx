"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type WorkflowStatus = "WAITING" | "IN_TREATMENT" | "COMPLETED";

interface TreatmentWorkflowProps {
  patientId: string;
  initialStatus: string;
  startedAt?: string | null;
  completedAt?: string | null;
  initial: {
    diagnosis?: string;
    treatment?: string;
    prescription?: string;
    additionalInfo?: string;
  };
}

function normalizeStatus(value: string): WorkflowStatus {
  const normalized = value.toUpperCase().replace(/-/g, "_");
  if (normalized === "DONE") return "COMPLETED";
  if (normalized === "IN_TREATMENT") return "IN_TREATMENT";
  if (normalized === "COMPLETED") return "COMPLETED";
  return "WAITING";
}

function statusTone(status: WorkflowStatus) {
  switch (status) {
    case "IN_TREATMENT":
      return "bg-amber-100 text-amber-700";
    case "COMPLETED":
      return "bg-emerald-100 text-emerald-700";
    default:
      return "bg-sky-100 text-sky-700";
  }
}

export default function TreatmentWorkflow({
  patientId,
  initialStatus,
  startedAt,
  completedAt,
  initial,
}: TreatmentWorkflowProps) {
  const getErrorMessage = (error: unknown, fallback: string) =>
    error instanceof Error ? error.message : fallback;
  const router = useRouter();
  const [status, setStatus] = useState<WorkflowStatus>(
    normalizeStatus(initialStatus),
  );
  const [diagnosis, setDiagnosis] = useState(initial.diagnosis ?? "");
  const [treatment, setTreatment] = useState(initial.treatment ?? "");
  const [prescription, setPrescription] = useState(initial.prescription ?? "");
  const [additionalInfo, setAdditionalInfo] = useState(initial.additionalInfo ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [startedAtLocal, setStartedAtLocal] = useState<string | null>(startedAt ?? null);
  const [completedAtLocal, setCompletedAtLocal] = useState<string | null>(
    completedAt ?? null,
  );

  const isEditable = status === "IN_TREATMENT";

  const completionValidationError = useMemo(() => {
    if (!isEditable) return null;
    if (!diagnosis.trim()) return "Diagnosis is required before completion.";
    if (!treatment.trim()) return "Treatment is required before completion.";
    return null;
  }, [diagnosis, isEditable, treatment]);

  async function updateStatus(nextStatus: "IN_TREATMENT" | "COMPLETED") {
    const res = await fetch("/api/patients/status", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ patientId, status: nextStatus }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  async function saveMedicalRecord() {
    const res = await fetch("/api/patients/update", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        patientId,
        diagnosis,
        treatment,
        prescription,
        additionalInfo,
      }),
    });
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res.json();
  }

  async function handleStartTreatment() {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await updateStatus("IN_TREATMENT");
      setStatus("IN_TREATMENT");
      setStartedAtLocal(new Date().toISOString());
      setCompletedAtLocal(null);
      setSuccess("Treatment started. Medical form is now editable.");
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to start treatment."));
    } finally {
      setLoading(false);
    }
  }

  async function handleCompleteTreatmentAndSave() {
    if (completionValidationError) {
      setError(completionValidationError);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await saveMedicalRecord();
      await updateStatus("COMPLETED");
      setStatus("COMPLETED");
      setCompletedAtLocal(new Date().toISOString());
      setSuccess("Treatment completed and medical record saved.");
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Failed to complete treatment."));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
              Treatment Status
            </p>
            <span
              className={`mt-2 inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusTone(
                status,
              )}`}
            >
              {status.replace(/_/g, " ")}
            </span>
            {startedAtLocal ? (
              <p className="mt-2 text-xs text-slate-500">
                Started: {new Date(startedAtLocal).toLocaleString()}
              </p>
            ) : null}
            {completedAtLocal ? (
              <p className="text-xs text-slate-500">
                Completed: {new Date(completedAtLocal).toLocaleString()}
              </p>
            ) : null}
          </div>

          {status === "WAITING" ? (
            <button
              type="button"
              disabled={loading}
              onClick={handleStartTreatment}
              className="rounded-lg bg-[#0ea5e9] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0284c7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Starting..." : "Start Treatment"}
            </button>
          ) : null}

          {status === "IN_TREATMENT" ? (
            <button
              type="button"
              disabled={loading || Boolean(completionValidationError)}
              onClick={handleCompleteTreatmentAndSave}
              className="rounded-lg bg-[#0ea5e9] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0284c7] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? "Saving..." : "Complete Treatment & Save"}
            </button>
          ) : null}
        </div>
      </div>

      <div className="rounded-2xl bg-white p-4 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
          Medical Record
        </p>
        <div className="mt-3 space-y-3">
          <div>
            <label className="text-xs font-bold text-slate-400">Diagnosed</label>
            <input
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              disabled={!isEditable || loading}
              className="mt-2 w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400">Treatment</label>
            <input
              value={treatment}
              onChange={(e) => setTreatment(e.target.value)}
              disabled={!isEditable || loading}
              className="mt-2 w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400">Prescription</label>
            <input
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              disabled={!isEditable || loading}
              className="mt-2 w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400">
              Additional Notes
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              disabled={!isEditable || loading}
              className="mt-2 min-h-[110px] w-full rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>
      </div>

      {completionValidationError && status === "IN_TREATMENT" ? (
        <p className="text-sm text-amber-700">{completionValidationError}</p>
      ) : null}
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      {success ? <p className="text-sm text-emerald-700">{success}</p> : null}
    </div>
  );
}
