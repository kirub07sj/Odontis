"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AppointmentForm({ patientId }: { patientId: string }) {
  const router = useRouter();
  const [datetime, setDatetime] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientId, datetime }),
      });
      if (!res.ok) throw new Error(await res.text());
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-xs font-bold text-slate-400">Appointment Date</label>
        <input
          type="datetime-local"
          value={datetime}
          onChange={(e) => setDatetime(e.target.value)}
          className="mt-2 w-full rounded-md border px-3 py-2"
        />
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end">
        <button type="submit" disabled={loading} className="rounded-md bg-blue-600 px-4 py-2 text-white">
          {loading ? "Creating..." : "Make an Appointment"}
        </button>
      </div>
    </form>
  );
}
