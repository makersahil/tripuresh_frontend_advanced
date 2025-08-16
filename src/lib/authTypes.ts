export type Role = 'admin' | 'user'
export type User = {
  id: string
  email: string
  name?: string
  role?: Role
}
