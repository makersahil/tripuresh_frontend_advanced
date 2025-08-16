import { useAuth } from './useAuth'
import type { Role } from '@/lib/authTypes'
export function useRole(role: Role) {
  const { user } = useAuth()
  return user?.role === role
}
