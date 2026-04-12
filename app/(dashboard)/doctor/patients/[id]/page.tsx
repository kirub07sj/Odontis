"use client";
import { use } from "react";

export default function PatientDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  return <div>Patient Details: {resolvedParams.id}</div>;
}
