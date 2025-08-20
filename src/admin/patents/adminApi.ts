import { http } from '@/config/api'

export type InventorInput = { firstName: string; lastName: string }

export type PatentInput = {
  title: string
  country: string
  patentNo: string
  year: number
  link?: string
  legacyInventors?: string
  published?: boolean
  inventorsList?: InventorInput[]
}

export async function createPatent(payload: PatentInput) {
  const res = await http.post('/api/v1/admin/patents', payload)
  return res.data
}

export async function updatePatent(id: string, payload: PatentInput) {
  const res = await http.put(`/api/v1/admin/patents/${id}`, payload)
  return res.data
}

export async function deletePatent(id: string) {
  const res = await http.delete(`/api/v1/admin/patents/${id}`)
  return res.data
}
