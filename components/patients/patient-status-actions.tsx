"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function PatientStatusActions({
  patientId,
  status,
  startedAt,
  completedAt,
}: {
  patientId: string;
  status: string;
  startedAt?: string | null;
  completedAt?: string | null;
}) {
  const getErrorMessage = (error: unknown) =>
    error instanceof Error ? error.message : "Failed to update status";
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function updateStatus(newStatus: "IN_TREATMENT" | "COMPLETED") {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/patients/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, status: newStatus }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err: unknown) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  const normalizedStatusRaw = status.toUpperCase().replace(/-/g, "_");
  const normalizedStatus =
    normalizedStatusRaw === "DONE" ? "COMPLETED" : normalizedStatusRaw;
  const canStart = normalizedStatus === "WAITING";
  const canComplete = normalizedStatus === "IN_TREATMENT";
  const isCompleted = normalizedStatus === "COMPLETED";
  const actionLabel = canStart
    ? "Start"
    : canComplete
      ? "Done"
      : null;
  const actionStatus = canStart ? "IN_TREATMENT" : canComplete ? "COMPLETED" : null;

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Patient Status
          </p>
          <p className="text-sm font-extrabold text-slate-900">
            {normalizedStatus.replace(/_/g, " ")}
          </p>
          {startedAt ? (
            <p className="text-xs text-slate-500">
              Started: {new Date(startedAt).toLocaleString()}
            </p>
          ) : null}
          {completedAt ? (
            <p className="text-xs text-slate-500">
              Completed: {new Date(completedAt).toLocaleString()}
            </p>
          ) : null}
        </div>
        <div className="flex items-center">
          {actionStatus && actionLabel ? (
            <button
              className="rounded-lg bg-[#0ea5e9] px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-[#0284c7] disabled:cursor-not-allowed disabled:opacity-70"
              onClick={() => updateStatus(actionStatus)}
              disabled={loading}
            >
              {loading ? "Working..." : actionLabel}
            </button>
          ) : null}
          {isCompleted ? (
            <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700">
              Completed
            </span>
          ) : null}
        </div>
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
}
