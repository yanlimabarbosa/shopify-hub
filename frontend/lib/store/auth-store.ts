import { create } from "zustand";
import type { User } from "../types";

type AuthState = {
  user: User | null;
  token: string | null;
  setAuth: (user: User, token: string) => void;
  clearAuth: () => void;
  isAdmin: () => boolean;
};

const getInitialToken = (): string | null => {
  if (typeof globalThis.window !== "undefined") {
    return globalThis.window.localStorage.getItem("token");
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: getInitialToken(),
  setAuth: (user, token) => {
    if (typeof globalThis.window !== "undefined") {
      globalThis.window.localStorage.setItem("token", token);
    }
    set({ user, token });
  },
  clearAuth: () => {
    if (typeof globalThis.window !== "undefined") {
      globalThis.window.localStorage.removeItem("token");
    }
    set({ user: null, token: null });
  },
  isAdmin: () => {
    const user = get().user;
    return user?.role === "ADMIN";
  },
}));
