"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { Modal } from "@/components/ui/modal";
import { useUserStore } from "@/features/users/user.store";
import { usePatientStore, PatientFormData } from "@/features/patients/patient.store";

export function PatientProfileModal() {
  const { isProfileModalOpen, closeProfileModal, selectedPatientProfile, updatePatient, isLoading: isFetchingProfile } = usePatientStore();
  const { availableDoctors, fetchDoctorAvailability, isFetchingDoctors } = useUserStore();

  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    age: "",
    gender: "",
    address: "",
    additionalInfo: "",
    doctorId: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isProfileModalOpen) {
      fetchDoctorAvailability();
    }
  }, [isProfileModalOpen, fetchDoctorAvailability]);

  // Sync profile data down to local form
  useEffect(() => {
    if (selectedPatientProfile) {
      const parts = (selectedPatientProfile.fullName || " ").split(" ");
      const firstName = parts[0];
      const lastName = parts.slice(1).join(" ");
      
      const activeDoctorId = selectedPatientProfile.appointments?.[0]?.doctorId || "";
      
      setFormData({
        firstName,
        lastName,
        phoneNumber: selectedPatientProfile.phoneNumber || "",
        age: selectedPatientProfile.age || "",
        gender: selectedPatientProfile.gender || "",
        address: selectedPatientProfile.address || "",
        additionalInfo: selectedPatientProfile.additionalInfo || "",
        doctorId: activeDoctorId
      });
    }
  }, [selectedPatientProfile]);

  const sortedDoctors = useMemo(() => {
    return availableDoctors.map((doc, index) => ({
      ...doc,
      isMostAvailable: index === 0
    }));
  }, [availableDoctors]);

  const selectedDoctor = sortedDoctors.find(d => d.id === formData.doctorId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientProfile) return;
    
    setError("");
    setLoading(true);

    try {
      await updatePatient(selectedPatientProfile.id, formData);
      closeProfileModal();
    } catch (err: any) {
      setError(err.message || "Failed to update patient");
    } finally {
      setLoading(false);
    }
  };

  const visits = selectedPatientProfile?.appointments || [];

  return (
    <Modal 
      isOpen={isProfileModalOpen} 
      onClose={closeProfileModal} 
      title="Update Patient Information"
      maxWidth="max-w-5xl"
    >
      <div className="flex flex-col gap-6 font-sans w-full p-2 h-full overflow-y-auto hide-scrollbar max-h-[80vh]">
        {isFetchingProfile ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <div className="w-12 h-12 border-4 border-gray-100 border-t-[#0ea5e9] rounded-full animate-spin"></div>
            <p className="text-gray-500 font-bold text-[14px]">Loading patient records...</p>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
              
              {/* Left Column: Demographics */}
              <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 space-y-4">
                <h3 className="font-extrabold text-[18px] text-[#111]">Patient Information</h3>
                {error && <p className="text-red-500 font-bold text-sm">{error}</p>}
                
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-400">First Name</label>
                  <input required type="text" value={formData.firstName} onChange={(e) => setFormData(p => ({...p, firstName: e.target.value}))} 
                    className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-400">Last Name</label>
                  <input required type="text" value={formData.lastName} onChange={(e) => setFormData(p => ({...p, lastName: e.target.value}))} 
                    className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-400">Phone Number</label>
                  <input required type="tel" value={formData.phoneNumber} onChange={(e) => setFormData(p => ({...p, phoneNumber: e.target.value}))} 
                    className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700" 
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-gray-400">Address (Optional)</label>
                  <input type="text" value={formData.address} onChange={(e) => setFormData(p => ({...p, address: e.target.value}))} 
                    className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700" 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-400">Age</label>
                    <input required type="number" min="0" value={formData.age} onChange={(e) => setFormData(p => ({...p, age: e.target.value}))} 
                      className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700" 
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[13px] font-bold text-gray-400">Gender</label>
                    <select required value={formData.gender} onChange={(e) => setFormData(p => ({...p, gender: e.target.value}))} 
                      className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700 appearance-none cursor-pointer"
                    >
                      <option value="" disabled className="text-gray-400">Select</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                </div>
                
                {/* Service Charge Element appended strictly below the demographics for alignment */}
                <div className="bg-white border rounded-2xl p-6 mt-4 flex items-center gap-6 shadow-sm">
                  <div className="flex flex-col">
                    <span className="text-[15px] font-extrabold text-[#111]">Service Charge</span>
                    <span className="text-[13px] font-semibold text-gray-400">Tooth Extraction</span>
                  </div>
                  <div className="h-10 w-px bg-gray-200"></div>
                  <span className="text-[24px] font-black text-[#111]">450 ETB</span>
                </div>
                
              </div>

              {/* Right Column: Doctor Assignment & Extra Info */}
              <div className="flex flex-col gap-6">
                <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 flex-1 flex flex-col">
                  <h3 className="font-extrabold text-[18px] text-[#111]">Assign Doctor</h3>
                  <p className="text-[12px] font-medium text-gray-500 mb-4">Assign a Doctor with the least patients</p>
                  
                  <div className="flex items-end gap-4 mb-4">
                    <div className="flex-1 space-y-1.5">
                      <label className="text-[13px] font-bold text-gray-400">Doctor's Name</label>
                      <div className="w-full p-4 bg-[#f8f8f8] border border-gray-100 rounded-2xl font-bold text-gray-900 shadow-inner">
                         {selectedDoctor ? selectedDoctor.name : isFetchingDoctors ? "Loading..." : "Select below"}
                      </div>
                    </div>
                    <div className="w-24 space-y-1.5">
                      <label className="text-[13px] font-bold text-gray-400">Patients</label>
                      <div className="w-full p-4 bg-[#f8f8f8] border border-gray-100 rounded-2xl font-black text-center text-gray-900 shadow-inner">
                         {selectedDoctor ? selectedDoctor.assignedPatients : "-"}
                      </div>
                    </div>
                  </div>

                  <h4 className="text-[14px] font-extrabold text-gray-700 mb-4">Available Doctors</h4>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 snap-x hide-scrollbar">
                    {sortedDoctors.map((doc) => (
                      <div 
                        key={doc.id} 
                        onClick={() => setFormData(p => ({...p, doctorId: doc.id}))}
                        className={`relative w-[220px] aspect-[4/3] flex-shrink-0 flex flex-col justify-between p-4 cursor-pointer hover:-translate-y-1 transition-transform snap-start select-none ${formData.doctorId === doc.id ? 'ring-2 ring-offset-2 ring-[#0ea5e9] rounded-2xl' : ''}`}
                      >
                        <div className="absolute inset-0 z-0">
                          <Image 
                            src={doc.isMostAvailable ? "/images/activeFolder.png" : "/images/normalFolder.png"} 
                            alt="Folder BG" fill sizes="220px" className="object-contain object-bottom"
                          />
                        </div>
                        <div className="relative z-10 flex flex-col h-full justify-between pt-4 pr-1">
                          <div className="flex items-center gap-3">
                            <div className={`rounded-full bg-white flex-shrink-0 overflow-hidden shadow-sm border border-white/50 flex items-center justify-center text-gray-300 font-bold ${doc.isMostAvailable ? "w-12 h-12" : "w-10 h-10"}`}>
                               Img
                            </div>
                            <div>
                              <h3 className={`font-extrabold leading-tight shadow-sm-text truncate w-24 ${doc.isMostAvailable ? "text-white text-[12px]" : "text-white text-[11px]"}`}>
                                {doc.name}
                              </h3>
                              <p className={`text-[9px] font-medium mt-0.5 ${doc.isMostAvailable ? "text-blue-100" : "text-gray-100"}`}>
                                Currently Assigned
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-between items-end mb-1">
                            <p className={`text-[10px] font-bold leading-tight ${doc.isMostAvailable ? "text-white" : "text-white"}`}>
                              Number of<br/> Assigned Patients
                            </p>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-[16px] font-black shadow-sm ${doc.isMostAvailable ? "bg-white/20 text-white backdrop-blur-md" : "bg-white/30 text-white backdrop-blur-md"}`}>
                              {doc.assignedPatients}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#fcfcfc] border border-gray-100 rounded-3xl p-6 space-y-4 flex flex-col">
                  <h3 className="font-bold text-[14px] text-gray-500">Additional Information (Optional)</h3>
                  <textarea 
                    value={formData.additionalInfo}
                    onChange={(e) => setFormData(p => ({...p, additionalInfo: e.target.value}))}
                    className="w-full p-4 bg-[#f8f8f8] border-none rounded-2xl outline-none focus:ring-2 focus:ring-[#0ea5e9] transition-all font-bold text-gray-700 min-h-[60px] flex-1 resize-none"
                  ></textarea>
                  
                  <button 
                    type="submit" 
                    disabled={loading || !formData.doctorId}
                    className="w-full py-4 mt-2 bg-[#0ea5e9] hover:bg-[#0284c7] disabled:bg-[#0ea5e9]/70 text-white font-bold rounded-2xl shadow-md hover:shadow-lg transition-all"
                  >
                    {loading ? "Updating..." : "Save & Update"}
                  </button>
                </div>
              </div>
            </form>

            {/* Visit History Timeline full width under the main grid */}
            <div className="mt-2 w-full flex flex-col gap-4">
              <h3 className="font-extrabold text-[18px] text-[#111]">Patient's Visit History</h3>
              <div className="flex flex-col gap-3 relative pb-4">
                {/* Timeline vertical line */}
                <div className="absolute left-[38px] top-6 bottom-6 w-0.5 bg-gray-200 z-0"></div>
                
                {visits.map((visit: any, idx: number) => (
                    <div key={visit.id} className="relative z-10 flex items-center gap-6">
                      {/* Circle Node */}
                      <div className="w-20 flex justify-center">
                        <div className="w-5 h-5 rounded-full bg-white border-[4px] border-[#0ea5e9] shadow-sm"></div>
                      </div>
                      {/* Card */}
                      <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
                        <p className="text-[14px] font-bold text-gray-800">
                          <span className="text-[#111] font-extrabold mr-2">Date & Time:</span>
                          {new Date(visit.datetime).toLocaleString(undefined, {
                              month: 'short', 
                              day: 'numeric', 
                              year: 'numeric', 
                              hour: 'numeric', 
                              minute: '2-digit'
                          })}
                          {visit.doctor?.name && <span className="text-gray-400 ml-4 font-semibold text-xs">({visit.doctor.name})</span>}
                        </p>
                      </div>
                    </div>
                ))}
                
                {visits.length === 0 && (
                    <p className="text-gray-400 font-bold ml-6">No historical records found for this patient.</p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
      
      <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </Modal>
  );
}
