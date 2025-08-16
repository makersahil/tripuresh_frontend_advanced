import { http } from '@/config/api'
import type { User } from '@/lib/authTypes'

type LoginBody = { email: string; password: string }
type LoginResp = { success: true; data: { token: string } }

export async function login(data: LoginBody): Promise<string> {
  const res = await http.post<LoginResp>('/auth/login', data)
  if (res.data?.success && res.data.data?.token) return res.data.data.token
  throw new Error('Invalid login response')
}

export async function me(): Promise<User> {
  const res = await http.get<{ success: true; data: User }>('/auth/me')
  if (res.data?.success) return res.data.data
  throw new Error('Failed to load profile')
}
