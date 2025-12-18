import type { LoginFormData } from "@/schemas/login-schema";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface PublicUserDTO {
  username: string;
  email: string;
  password: string;
}

interface AuthState {
  user: PublicUserDTO | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  hydrate: () => Promise<void>;

  signIn: (payload: LoginFormData) => Promise<any>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;

  getAccessToken: () => string | null;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  accessToken: null,
  isAuthenticated: false,
  isLoading: true,

  hydrate: async () => {
    try {
      set({ isLoading: true });

      const refreshRes = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });

      if (!refreshRes.ok) {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const { accessToken, user } = await refreshRes.json();

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },

  signIn: async ({ email, password }) => {
    set({ isLoading: true });

    const res = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const resBody = await res.json();

    console.log(resBody);

    if (!res.ok) {
      set({ isLoading: false });
      throw new Error("Credenciais inválidas");
    }

    const { accessToken, user } = resBody;

    set({
      user,
      accessToken,
      isAuthenticated: true,
      isLoading: false,
    });

    return resBody;
  },

  refresh: async () => {
    const res = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
      return;
    }

    const { accessToken } = await res.json();
    set({ accessToken });
  },

  signOut: async () => {
    try {
      await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } finally {
      set({
        user: null,
        accessToken: null,
        isAuthenticated: false,
      });
    }
  },

  getAccessToken: () => get().accessToken,
}));

export type AuthContext = ReturnType<typeof useAuth>;
