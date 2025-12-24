import { getAllUsers } from "@/lib/fetch/crud/user/get-all-users";
import type { LoginFormData } from "@/schemas/login-schema";
import type { UserDTO } from "@/types/user.dto";
import { UserMinus } from "lucide-react";
import { create } from "zustand";

const API_URL = import.meta.env.VITE_BACKEND_API_URL;

interface AuthState {
  user: UserDTO | null;
  allUsers: UserDTO[] | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  hydrate: () => Promise<void>;

  signIn: (payload: LoginFormData) => Promise<any>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;

  getAccessToken: () => string | null;
  getUser: () => UserDTO | null;
}

export const useAuth = create<AuthState>((set, get) => ({
  user: null,
  allUsers: null,
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

      const { user, accessToken } = await refreshRes.json();

      set({
        user,
        accessToken,
        isAuthenticated: true,
        isLoading: false,
      });

      const allUsers = await getAllUsers();

      set({
        allUsers,
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
  getUser: () => {
    console.log(get().user);
    return get().user;
  },
}));

export type AuthContext = ReturnType<typeof useAuth>;
