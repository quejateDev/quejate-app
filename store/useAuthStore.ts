import { Entity, UserRole } from "@prisma/client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Client } from "@/services/api/Client";

interface User {
  id?: string;
  email: string;
  name?: string;
  role?: UserRole;
  entity?: Entity;
}

interface AuthStore {
  user: User | null;
  token?: string;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
}

// Helper function to set auth headers
const setAuthHeaders = (token: string | undefined) => {
  if (token) {
    Client.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete Client.defaults.headers.common["Authorization"];
  }
};

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: undefined,
      isAuthenticated: false,
      login: (user, token) => {
        setAuthHeaders(token);
        set({ user, token, isAuthenticated: true });
      },
      logout: async () => {
        setAuthHeaders(undefined);
        console.log("logout");
        set({ user: null, token: undefined, isAuthenticated: false });

        localStorage.removeItem("auth-storage");
        
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Error calling logout endpoint:", error);
        }
        document.cookie.split(";").forEach(function (c) {
          console.log(c);
          document.cookie = c
            .replace(/^ +/, "")
            .replace(
              /=.*/,
              "=;expires=" + new Date().toUTCString() + ";path=/"
            );
        });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        // When the store is rehydrated, set the auth headers if user exists
        if (state?.token) {
          setAuthHeaders(state.token);
        }
      },
    }
  )
);

export default useAuthStore;
