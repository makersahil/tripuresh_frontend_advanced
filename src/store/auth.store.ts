import { create } from 'zustand'

type AuthState = { token: string | null; setToken: (t:string|null)=>void }
export const useAuthStore = create<AuthState>((set)=>({
  token: typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null,
  setToken: (t) => { if (t) localStorage.setItem('admin_token', t); else localStorage.removeItem('admin_token'); set({ token: t }) }
}))
