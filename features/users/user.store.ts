import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  createdAt: string;
}

export interface DoctorAvailability {
  id: string;
  name: string;
  assignedPatients: number;
}

interface UserStore {
  users: User[];
  availableDoctors: DoctorAvailability[];
  isLoading: boolean;
  isFetchingDoctors: boolean;
  error: string | null;
  
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  editingUser: User | null;

  fetchUsers: () => Promise<void>;
  fetchDoctorAvailability: () => Promise<void>;
  addUser: (data: Partial<User> & { password?: string }) => Promise<void>;
  updateUser: (id: string, data: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  openModal: (mode: "create" | "edit", user?: User) => void;
  closeModal: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  availableDoctors: [],
  isLoading: false,
  isFetchingDoctors: false,
  error: null,
  
  isModalOpen: false,
  modalMode: "create",
  editingUser: null,

  fetchUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await fetch("/api/users");
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      set({ users: data, isLoading: false });
    } catch (error: any) {
      set({ error: error.message, isLoading: false });
    }
  },

  fetchDoctorAvailability: async () => {
    set({ isFetchingDoctors: true, error: null });
    try {
      const res = await fetch("/api/doctors/availability");
      if (!res.ok) throw new Error("Failed to fetch doctor availability");
      const data = await res.json();
      set({ availableDoctors: data, isFetchingDoctors: false });
    } catch (error: any) {
      set({ error: error.message, isFetchingDoctors: false });
    }
  },

  addUser: async (data) => {
    const res = await fetch("/api/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg);
    }
    
    await get().fetchUsers();
  },

  updateUser: async (id, data) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errorMsg = await res.text();
      throw new Error(errorMsg);
    }
    
    await get().fetchUsers();
  },

  deleteUser: async (id) => {
    const res = await fetch(`/api/users/${id}`, {
      method: "DELETE",
    });
    
    if (!res.ok) {
        const errorMsg = await res.text();
        throw new Error(errorMsg);
    }
    
    set((state) => ({ users: state.users.filter((u) => u.id !== id) }));
  },

  openModal: (mode, user) => {
    set({ isModalOpen: true, modalMode: mode, editingUser: user ?? null });
  },

  closeModal: () => {
    set({ isModalOpen: false, editingUser: null });
  },
}));
