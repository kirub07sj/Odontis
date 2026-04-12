import { create } from "zustand";

export interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "DOCTOR" | "RECEPTIONIST";
  createdAt: string;
}

interface UserStore {
  users: User[];
  isLoading: boolean;
  error: string | null;
  
  isModalOpen: boolean;
  modalMode: "create" | "edit";
  editingUser: User | null;

  fetchUsers: () => Promise<void>;
  addUser: (data: Partial<User> & { password?: string }) => Promise<void>;
  updateUser: (id: string, data: Partial<User> & { password?: string }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;

  openModal: (mode: "create" | "edit", user?: User) => void;
  closeModal: () => void;
}

export const useUserStore = create<UserStore>((set, get) => ({
  users: [],
  isLoading: false,
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

  openModal: (mode, user = null) => {
    set({ isModalOpen: true, modalMode: mode, editingUser: user });
  },

  closeModal: () => {
    set({ isModalOpen: false, editingUser: null });
  },
}));
