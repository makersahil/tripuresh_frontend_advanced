import { getListOk, getOk } from '@/config/api'
import type { Patent } from '@/lib/types'

export async function listPatents(params: { page?: number; pageSize?: number; sort?: string; q?: string; year?: number } = {}) {
  const { items, meta } = await getListOk<Patent>('/patents', params)
  return { items, meta }
}

export async function getPatent(slug: string) {
  const res = await getOk<Patent>(`/patents/${slug}`)
  return res.data
}
