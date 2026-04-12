"use client";

import { useState } from "react";

const todayPatients = [
  { id: "3245", name: "Yonathan Nega", status: "In Treatment" },
  { id: "3245", name: "Yonathan Nega", status: "waiting" },
  { id: "3245", name: "Yonathan Nega", status: "waiting" },
  { id: "3245", name: "Yonathan Nega", status: "waiting" },
  { id: "3245", name: "Yonathan Nega", status: "Done" },
];

const appointedPatients = [
  { id: "3245", name: "Yonathan Nega", date: "Jan 31, 2026" },
  { id: "3245", name: "Yonathan Nega", date: "Jan 31, 2026" },
  { id: "3245", name: "Yonathan Nega", date: "Jan 31, 2026" },
];

export default function DoctorDashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

  return (
    <div className="w-full flex flex-col gap-8 bg-white shadow-sm rounded-3xl p-6 md:p-10 font-sans">
      
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
          <button 
            onClick={() => setActiveTab("Appointment")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Appointment" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Appointment
          </button>
        </div>
      </div>

      {/* Main Content Columns */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        
        {/* Left Column - Today's Patients */}
        <div className="flex-1 bg-[#fafafa] rounded-3xl p-8">
          <h2 className="text-[22px] font-extrabold text-[#4a4a4a] mb-8">Today’s Patients List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[15px] text-gray-500 font-bold">
                  <th className="pb-6 font-bold w-[40%]">Full Name</th>
                  <th className="pb-6 font-bold w-[30%]">Patient ID</th>
                  <th className="pb-6 font-bold w-[30%] text-center">Status</th>
                </tr>
              </thead>
              <tbody className="text-[15px] font-bold text-[#111]">
                {todayPatients.map((patient, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-5">{patient.name}</td>
                    <td className="py-5">{patient.id}</td>
                    <td className="py-5 text-center">
                      <span className="inline-block bg-[#0ea5e9] text-white px-5 py-2 rounded-full text-[13px] font-bold min-w-[120px]">
                        {patient.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right Column - Appointed Patients */}
        <div className="flex-1 bg-[#fafafa] rounded-3xl p-8">
          <h2 className="text-[22px] font-extrabold text-[#4a4a4a] mb-8">Appointed Patients List</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[15px] text-gray-500 font-bold">
                  <th className="pb-6 font-bold w-[40%]">Full Name</th>
                  <th className="pb-6 font-bold w-[30%]">Patient ID</th>
                  <th className="pb-6 font-bold w-[30%]">Date</th>
                </tr>
              </thead>
              <tbody className="text-[15px] font-bold text-[#111]">
                {appointedPatients.map((patient, index) => (
                  <tr key={index} className="border-t border-gray-300">
                    <td className="py-5">{patient.name}</td>
                    <td className="py-5">{patient.id}</td>
                    <td className="py-5 text-gray-500 font-semibold">{patient.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
