import { create } from "zustand";
import { useUserStore } from "@/features/users/user.store";

export interface PatientRecord {
  id: string;
  name: string;
  doctor: string;
  datetime: string | Date;
  status: string;
}

export interface PatientFormData {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  age: string;
  gender: string;
  address?: string;
  additionalInfo?: string;
  doctorId: string;
}

interface PatientStore {
  recentPatients: PatientRecord[];
  isLoading: boolean;
  error: string | null;
  
  isRegistrationModalOpen: boolean;
  openRegistrationModal: () => void;
  closeRegistrationModal: () => void;
  
  selectedPatientProfile: {
    id: string;
    fullName: string;
    phoneNumber: string;
    age: string;
    gender: string;
    address?: string | null;
    additionalInfo?: string | null;
    appointments?: Array<{
      id: string;
      doctorId: string;
      datetime: string | Date;
      doctor?: { name?: string };
    }>;
  } | null;
  isProfileModalOpen: boolean;
  openProfileModal: (id: string) => Promise<void>;
  closeProfileModal: () => void;

  fetchRecentPatients: () => Promise<void>;
  registerPatient: (data: PatientFormData) => Promise<void>;
  updatePatient: (id: string, data: PatientFormData) => Promise<void>;
}

export const usePatientStore = create<PatientStore>((set, get) => ({
  recentPatients: [],
  isLoading: false,
  error: null,
  
  isRegistrationModalOpen: false,
  openRegistrationModal: () => set({ isRegistrationModalOpen: true }),
  closeRegistrationModal: () => set({ isRegistrationModalOpen: false }),

  selectedPatientProfile: null,
  isProfileModalOpen: false,
  openProfileModal: async (id: string) => {
    set({ isProfileModalOpen: true, isLoading: true, error: null });
    try {
      const res = await fetch(`/api/patients/${id}`);
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      set({ selectedPatientProfile: data, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Failed to fetch profile";
      set({ error: message, isLoading: false });
    }
  },
  closeProfileModal: () => set({ isProfileModalOpen: false, selectedPatientProfile: null }),

  fetchRecentPatients: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/patients");
      if (!res.ok) throw new Error("Failed to fetch recent patients");
      const data = await res.json();
      set({ recentPatients: data, isLoading: false });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Failed to fetch recent patients";
      set({ error: message, isLoading: false });
    }
  },

  registerPatient: async (data: PatientFormData) => {
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to register patient");
      }
      
      // Auto-refresh the recent patients list
      await get().fetchRecentPatients();
      await useUserStore.getState().fetchDoctorAvailability();
    } catch (error: unknown) {
      throw error;
    }
  },

  updatePatient: async (id: string, data: PatientFormData) => {
    try {
      const res = await fetch(`/api/patients/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const message = await res.text();
        throw new Error(message || "Failed to update patient");
      }
      
      // Auto-refresh the recent patients list and update local selected profile
      await get().fetchRecentPatients();
      await useUserStore.getState().fetchDoctorAvailability();
      const updatedProfile = await res.json();
      set({ selectedPatientProfile: updatedProfile });
    } catch (error: unknown) {
      throw error;
    }
  }
}));
