"use client";

import { useState, useEffect } from "react";
import { Edit2, Trash2 } from "lucide-react";
import { useUserStore } from "@/features/users/user.store";
import { Modal } from "@/components/ui/modal";

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState("Staff Management");
  
  const { 
    users, isLoading, error, fetchUsers, deleteUser,
    isModalOpen, modalMode, editingUser, openModal, closeModal,
    addUser, updateUser
  } = useUserStore();

  const [formData, setFormData] = useState<{name: string, email: string, password: string, role: "RECEPTIONIST" | "ADMIN" | "DOCTOR"}>({
    name: "",
    email: "",
    password: "",
    role: "RECEPTIONIST",
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Sync form data when modal opens for editing
  useEffect(() => {
    if (isModalOpen && modalMode === "edit" && editingUser) {
      setFormData({
        name: editingUser.name,
        email: editingUser.email,
        password: "", // Leave blank for update
        role: editingUser.role,
      });
    } else if (isModalOpen && modalMode === "create") {
      setFormData({ name: "", email: "", password: "", role: "RECEPTIONIST" });
    }
  }, [isModalOpen, modalMode, editingUser]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      if (modalMode === "create") {
        await addUser(formData);
      } else if (modalMode === "edit" && editingUser) {
        await updateUser(editingUser.id, formData);
      }
      closeModal();
    } catch (err: any) {
      setFormError(err.message || "Something went wrong.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete ${name}?`)) {
      try {
        await deleteUser(id);
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="w-full flex flex-col gap-8 bg-white shadow-sm rounded-3xl p-6 md:p-10 font-sans relative">
      
      {/* Top Navigation Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-2">
        <div className="flex items-center gap-4 text-[15px] font-bold">
          <button 
            onClick={() => setActiveTab("Staff Management")}
            className={`px-6 py-2.5 rounded-[8px] transition-colors ${activeTab === "Staff Management" ? "bg-[#0ea5e9] text-white shadow-sm" : "bg-transparent text-[#111] hover:text-[#0ea5e9]"}`}
          >
            Staff Management
          </button>
        </div>
        
        {activeTab === "Staff Management" && (
          <button 
            onClick={() => openModal("create")}
            className="bg-[#111] hover:bg-[#333] text-white px-6 py-3 rounded-xl font-bold text-[14px] shadow-sm transition-colors"
          >
            + Add New Staff
          </button>
        )}
      </div>

      {activeTab === "Staff Management" && (
        <div className="space-y-8">
          {/* Metrics Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <div className="flex-1 bg-[#0ea5e9]/10 rounded-3xl p-8 border border-[#0ea5e9]/20">
              <h2 className="text-[16px] font-bold text-[#0ea5e9] mb-2">Total Managed Users</h2>
              <p className="text-[36px] font-black text-[#111]">{users.length}</p>
            </div>
            <div className="flex-1 bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
              <h2 className="text-[16px] font-bold text-gray-500 mb-2">Active Doctors</h2>
              <p className="text-[36px] font-black text-[#111]">{users.filter(u => u.role === "DOCTOR").length}</p>
            </div>
            <div className="flex-1 bg-[#fafafa] rounded-3xl p-8 border border-gray-100">
              <h2 className="text-[16px] font-bold text-gray-500 mb-2">Total Receptionists</h2>
              <p className="text-[36px] font-black text-[#111]">{users.filter(u => u.role === "RECEPTIONIST").length}</p>
            </div>
          </div>

        <div className="bg-[#fafafa] rounded-3xl p-8 mt-2">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-[22px] font-extrabold text-[#4a4a4a]">Registered Clinic Staff</h2>
            {isLoading && <span className="text-sm font-bold text-gray-500">Loading Data...</span>}
            {error && <span className="text-sm font-bold text-red-500">Error: {error}</span>}
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[15px] text-gray-500 font-bold border-b border-gray-200">
                  <th className="pb-4 pl-2 font-bold min-w-[200px]">Full Name</th>
                  <th className="pb-4 font-bold min-w-[150px]">Role</th>
                  <th className="pb-4 font-bold min-w-[200px]">Email Address</th>
                  <th className="pb-4 font-bold min-w-[100px] text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="text-[15px] font-bold text-[#111]">
                {users.map((staff) => (
                  <tr key={staff.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="py-5 pl-2">{staff.name}</td>
                    <td className="py-5 text-gray-500">{staff.role}</td>
                    <td className="py-5 text-gray-500 font-medium">{staff.email}</td>
                    <td className="py-5 text-right flex justify-end gap-3 items-center">
                      <button 
                        onClick={() => openModal("edit", staff)}
                        className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(staff.id, staff.name)}
                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
                
                {users.length === 0 && !isLoading && (
                  <tr>
                    <td colSpan={4} className="py-10 text-center text-gray-500">No staff members found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        </div>
      )}

      {/* Reusable Modal for Create/Edit */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={closeModal} 
        title={modalMode === "create" ? "Add New Staff" : "Edit Staff Member"}
      >
        <form onSubmit={handleFormSubmit} className="space-y-5">
          {formError && (
            <div className="p-3 bg-red-50 text-red-600 text-sm font-bold rounded-lg text-center">
              {formError}
            </div>
          )}

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-600">Full Name</label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] font-bold"
              placeholder="e.g. Dr. John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-600">Email Address</label>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] font-bold"
              placeholder="email@odontis.test"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-600">
              {modalMode === "create" ? "Password" : "New Password (leave blank to keep current)"}
            </label>
            <input
              required={modalMode === "create"}
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] font-mono font-bold"
              placeholder="••••••••"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-600">Assigned Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
              className="w-full p-4 bg-[#fcfcfc] border border-gray-200 rounded-xl outline-none focus:ring-[3px] focus:ring-[#0ea5e9]/20 focus:border-[#0ea5e9] transition-all text-[15px] font-bold appearance-none cursor-pointer"
            >
              <option value="RECEPTIONIST">Receptionist</option>
              <option value="DOCTOR">Doctor</option>
              <option value="ADMIN">Administrator</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={closeModal}
              className="px-6 py-3 font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={formLoading}
              className="px-6 py-3 font-bold text-white bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-[#0ea5e9]/70 rounded-xl shadow-sm transition-colors"
            >
              {formLoading ? "Saving..." : modalMode === "create" ? "Create Staff" : "Update Staff"}
            </button>
          </div>
        </form>
      </Modal>

    </div>
  );
}
