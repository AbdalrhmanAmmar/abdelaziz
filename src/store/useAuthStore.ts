import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { IUser, ILoginInput } from "@/shared";
import { userServices } from "@/api/user";
import { supabase } from "@/lib/supabase";

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (data: ILoginInput) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: async (credentials) => {
        const response = await userServices.login(credentials);
        if (response.success) {
          const { user, token } = response.data;
          set({ user, token, isAuthenticated: true });
        }
      },

      logout: () => {
        supabase.auth.signOut();
        set({ user: null, token: null, isAuthenticated: false });
        localStorage.removeItem("auth-storage");
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
