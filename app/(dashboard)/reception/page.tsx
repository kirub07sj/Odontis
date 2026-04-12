"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const availableDoctors = [
  {
    id: 1,
    name: "Dr. Daniel Beyene",
    assignedPatients: 2,
    avatar: "/images/doctor1.jpg", // placeholder
    isActive: true,
  },
  {
    id: 2,
    name: "Dr. Kirubel Dagne",
    assignedPatients: 4,
    avatar: "/images/doctor2.jpg",
    isActive: false,
  },
  {
    id: 3,
    name: "Dr. Yonas Asefa",
    assignedPatients: 5,
    avatar: "/images/doctor3.jpg",
    isActive: false,
  },
  {
    id: 4,
    name: "Dr. Eyu Ashenafi",
    assignedPatients: 7,
    avatar: "/images/doctor4.jpg",
    isActive: false,
  },
];

const recentPatients = [
  { id: "3245", name: "Yonathan Nega", doctor: "Dr. Yared Moha", datetime: "Jan 31, 2026, 6:11 PM", status: "waiting" },
  { id: "3246", name: "Yonathan Nega", doctor: "Dr. Yared Moha", datetime: "Jan 31, 2026, 6:11 PM", status: "waiting" },
  { id: "3247", name: "Yonathan Nega", doctor: "Dr. Yared Moha", datetime: "Jan 31, 2026, 6:11 PM", status: "waiting" },
  { id: "3248", name: "Yonathan Nega", doctor: "Dr. Yared Moha", datetime: "Jan 31, 2026, 6:11 PM", status: "waiting" },
];

export default function ReceptionDashboardPage() {
  const [activeTab, setActiveTab] = useState("Dashboard");

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

        <button className="bg-[#0ea5e9] hover:bg-[#0284c7] text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-colors">
          + Register New Patient
        </button>
      </div>

      {/* Available Doctors Section */}
      <div>
        <h2 className="text-[20px] font-extrabold text-gray-700 mb-6">Available Doctors</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {availableDoctors.map((doc) => (
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
                    Number of<br/>
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
              {recentPatients.map((patient, index) => (
                <tr key={index} className="border-b border-gray-50 hover:bg-gray-50">
                  <td className="py-5 pl-2">{patient.name}</td>
                  <td className="py-5">{patient.doctor}</td>
                  <td className="py-5">{patient.id}</td>
                  <td className="py-5 text-gray-500 font-semibold">{patient.datetime}</td>
                  <td className="py-5 text-center">
                    <span className="inline-block bg-[#0ea5e9] text-white px-5 py-1.5 rounded-full text-[13px]">
                      {patient.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
    </div>
  );
}
