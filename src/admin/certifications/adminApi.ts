// src/admin/certifications/adminApi.ts
import { http } from '@/config/api'
import type { Certification } from '@/lib/types'

export type CertificationInput = {
  title: string
  issuer: string
  year: number
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

const ADMIN_BASE = '/api/v1/admin'

export async function createCertification(input: CertificationInput): Promise<Certification> {
  const res = await http.post(`${ADMIN_BASE}/certifications`, compact(input))
  return res.data?.data as Certification
}

export async function updateCertification(id: string, input: CertificationInput): Promise<Certification> {
  const res = await http.put(`${ADMIN_BASE}/certifications/${id}`, compact(input))
  return res.data?.data as Certification
}

export async function deleteCertification(id: string): Promise<void> {
  await http.delete(`${ADMIN_BASE}/certifications/${id}`)
}
