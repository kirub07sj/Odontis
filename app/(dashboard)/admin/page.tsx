"use client";

import { useState } from "react";

const staffList = [
  { id: "101", name: "Sarah Nahom", role: "Receptionist", email: "sarah@odontis.test", status: "Active" },
  { id: "102", name: "Dr. Daniel Beyene", role: "Doctor", email: "daniel@odontis.test", status: "Active" },
  { id: "103", name: "Dr. Yonas Asefa", role: "Doctor", email: "yonas@odontis.test", status: "Active" },
  { id: "104", name: "Dr. Kirubel Dagne", role: "Doctor", email: "kirubel@odontis.test", status: "Offline" },
  { id: "105", name: "Adminstrator", role: "Admin", email: "admin@odontis.test", status: "Active" },
];

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("Overview");

  return (
    <div className="w-full flex flex-col gap-8 bg-white shadow-sm rounded-3xl p-6 md:p-10 font-sans">
      
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div className="flex items-center gap-4 text-[15px] font-bold">
          <button 
            onClick={() => setActiveTab("Overview")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Overview" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Overview
          </button>
          <button 
            onClick={() => setActiveTab("Staff Management")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Staff Management" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Staff Management
          </button>
          <button 
            onClick={() => setActiveTab("System config")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "System config" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            System config
          </button>
        </div>
        
        <button className="bg-[#111] hover:bg-[#333] text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-colors">
          + Add New Staff
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
        <div className="flex-1 bg-[#0ea5e9]/10 rounded-3xl p-8 border border-[#0ea5e9]/20">
          <h2 className="text-[16px] font-bold text-[#0ea5e9] mb-2">Total Patients</h2>
          <p className="text-[36px] font-black text-[#111]">1,248</p>
        </div>
        <div className="flex-1 bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-500 mb-2">Active Doctors</h2>
          <p className="text-[36px] font-black text-[#111]">12</p>
        </div>
        <div className="flex-1 bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-500 mb-2">Today's Appointments</h2>
          <p className="text-[36px] font-black text-[#111]">45</p>
        </div>
      </div>

      {/* Staff Management Table */}
      <div className="bg-[#fafafa] rounded-3xl p-8 mt-2">
        <h2 className="text-[22px] font-extrabold text-[#4a4a4a] mb-8">Registered Clinic Staff</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[15px] text-gray-500 font-bold border-b border-gray-200">
                <th className="pb-4 pl-2 font-bold min-w-[200px]">Full Name</th>
                <th className="pb-4 font-bold min-w-[150px]">Role</th>
                <th className="pb-4 font-bold min-w-[200px]">Email Address</th>
                <th className="pb-4 font-bold min-w-[100px] text-center">Status</th>
              </tr>
            </thead>
            <tbody className="text-[15px] font-bold text-[#111]">
              {staffList.map((staff, index) => (
                <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="py-5 pl-2">{staff.name}</td>
                  <td className="py-5 text-gray-500">{staff.role}</td>
                  <td className="py-5 text-gray-500 font-medium">{staff.email}</td>
                  <td className="py-5 text-center">
                    <span className={`inline-block px-5 py-1.5 rounded-full text-[13px] font-bold ${
                      staff.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-200 text-gray-700'
                    }`}>
                      {staff.status}
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
