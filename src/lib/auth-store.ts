"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface User {
  id: string
  name: string
  email: string
  role: string
  tenantId: string | null
  entityId: string | null
  branchId: string | null
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

interface AuthActions {
  login: (user: User) => void
  logout: () => void
  setActiveEntity: (entityId: string) => void
  setActiveBranch: (branchId: string) => void
  setUser: (user: Partial<User>) => void
  setLoading: (loading: boolean) => void
}

type AuthStore = AuthState & AuthActions

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: true,

      // Actions
      login: (user: User) =>
        set({
          user,
          isAuthenticated: true,
          isLoading: false,
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        }),

      setActiveEntity: (entityId: string) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, entityId }
            : state.user,
        })),

      setActiveBranch: (branchId: string) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, branchId }
            : state.user,
        })),

      setUser: (updates: Partial<User>) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...updates }
            : state.user,
        })),

      setLoading: (isLoading: boolean) => set({ isLoading }),
    }),
    {
      name: "w-system-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)