"use client";

import Image from "next/image";

import { useState, useEffect, useMemo } from "react";
import { useUserStore } from "@/features/users/user.store";
import {
  usePatientStore,
  type PatientRecord,
} from "@/features/patients/patient.store";
import { PatientRegistrationModal } from "@/components/patients/patient-registration-modal";
import { PatientProfileModal } from "@/components/patients/patient-profile-modal";

export default function ReceptionDashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  const { availableDoctors, fetchDoctorAvailability, isFetchingDoctors } = useUserStore();
  const { recentPatients, fetchRecentPatients, openRegistrationModal, openProfileModal } = usePatientStore();

  useEffect(() => {
    fetchDoctorAvailability();
    fetchRecentPatients();
  }, [fetchDoctorAvailability, fetchRecentPatients]);

  const docsToDisplay = useMemo(() => {
    return availableDoctors.map((doc, index) => ({
      ...doc,
      isActive: index === 0,
    }));
  }, [availableDoctors]);

  return (
    <div className="w-full flex flex-col gap-10 bg-white shadow-sm rounded-3xl p-6 md:p-10 font-sans">

      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div className="flex items-center gap-4 text-[15px] font-bold">
          <button
            onClick={() => setActiveTab("Dashboard")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Dashboard" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setActiveTab("Patients")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Patients" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Patients
          </button>
        </div>

        <button 
          onClick={openRegistrationModal}
          className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-colors"
        >
          + Register New Patient
        </button>
      </div>

      {/* Available Doctors Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[20px] font-extrabold text-gray-700">Available Doctors</h2>
          {isFetchingDoctors && <span className="text-sm font-bold text-gray-500">Updating roster...</span>}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {docsToDisplay.length === 0 && !isFetchingDoctors && (
            <p className="text-gray-500 col-span-full">No active doctors found in the system.</p>
          )}
          {docsToDisplay.map((doc) => (
            <div
              key={doc.id}
              className="relative w-full aspect-[4/3] flex flex-col justify-between p-5 md:p-6 cursor-pointer hover:-translate-y-1 transition-transform"
            >
              {/* Folder Background Image */}
              <div className="absolute inset-0 z-0">
                <Image
                  src={doc.isActive ? "/images/activeFolder.png" : "/images/normalFolder.png"}
                  alt="Folder BG"
                  fill
                  className="object-contain object-bottom"
                />
              </div>

              {/* Card Content - Z-index to put above the background image */}
              <div className="relative z-10 flex flex-col h-full justify-between pt-6 pr-2">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-white flex-shrink-0 overflow-hidden shadow-sm border border-white/50">
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">Img</div>
                  </div>
                  <div>
                    <h3 className={`text-[15px] font-extrabold leading-tight shadow-sm-text ${doc.isActive ? "text-white" : "text-white"}`}>
                      {doc.name}
                    </h3>
                    <p className={`text-[11px] font-medium mt-0.5 ${doc.isActive ? "text-blue-100" : "text-gray-100"}`}>
                      Currently Assigned
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-end mt-4">
                  <p className={`text-[13px] font-bold leading-tight ${doc.isActive ? "text-white" : "text-white"}`}>
                    Number of<br />
                    Assigned Patients
                  </p>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[20px] font-black shadow-sm ${doc.isActive ? "bg-white/20 text-white backdrop-blur-md" : "bg-white/40 text-white backdrop-blur-md"}`}>
                    {doc.assignedPatients}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Patients Section */}
      <div className="mt-4">
        <h2 className="text-[20px] font-extrabold text-gray-700 mb-6">Recent Patients</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 text-[14px] text-gray-500 font-bold">
                <th className="pb-4 pl-2 font-bold min-w-[180px]">Full Name</th>
                <th className="pb-4 font-bold min-w-[160px]">Assigned Doctor</th>
                <th className="pb-4 font-bold min-w-[100px]">Patient ID</th>
                <th className="pb-4 font-bold min-w-[180px]">Date & Time</th>
                <th className="pb-4 font-bold min-w-[100px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[14px] font-bold text-gray-900">
              {recentPatients.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-gray-500">No patients registered yet.</td>
                </tr>
              )}
              {recentPatients.map((patient: PatientRecord) => (
                <tr 
                  key={patient.id} 
                  onClick={() => openProfileModal(patient.id)}
                  className="border-b border-gray-50 hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <td className="py-5 pl-2">{patient.name}</td>
                  <td className="py-5">{patient.doctor}</td>
                  <td className="py-5 text-gray-400 font-mono text-xs">{patient.id}</td>
                  <td className="py-5 text-gray-500 font-semibold">{new Date(patient.datetime).toLocaleString()}</td>
                  <td className="py-5 text-center">
                    <span className="inline-block bg-[#0ea5e9] text-white px-5 py-1.5 rounded-full text-[13px] capitalize">
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <PatientRegistrationModal />
      <PatientProfileModal />
    </div>
  );
}
