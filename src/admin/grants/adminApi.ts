// src/admin/grants/adminApi.ts
import { http } from '@/config/api'
import type { ResearchGrant } from '@/lib/types'

export type GrantInput = {
  title: string
  summary?: string
  year: number
  amount?: number
  link?: string
  published?: boolean
}

function normalizeHttpUrl(u?: string) {
  if (!u) return undefined
  const t = u.trim()
  if (!t) return undefined
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

function compact<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => (k === 'link' ? [k, normalizeHttpUrl(v as string)] : [k, v]))
      .filter(([_, v]) => {
        if (v === '' || v === null || v === undefined) return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      })
  ) as T
}

// If your axios base is server root, keep "/api/v1/admin".
// If your axios base already has "/api/v1", change to "/admin".
const ADMIN_BASE = '/api/v1/admin'

export async function createGrant(input: GrantInput): Promise<ResearchGrant> {
  const res = await http.post(`${ADMIN_BASE}/grants`, compact(input))
  return res.data?.data as ResearchGrant
}

export async function updateGrant(id: string, input: GrantInput): Promise<ResearchGrant> {
  const res = await http.put(`${ADMIN_BASE}/grants/${id}`, compact(input))
  return res.data?.data as ResearchGrant
}

export async function deleteGrant(id: string): Promise<void> {
  await http.delete(`${ADMIN_BASE}/grants/${id}`)
}
