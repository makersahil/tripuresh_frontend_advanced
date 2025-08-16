import { getListOk, getOk } from '@/config/api'
import type { Grant } from '@/lib/types'

export async function listGrants(params: { page?: number; pageSize?: number; sort?: string; q?: string; year?: number } = {}) {
  const { items, meta } = await getListOk<Grant>('/grants', params)
  return { items, meta }
}

export async function getGrant(slug: string) {
  const res = await getOk<Grant>(`/grants/${slug}`)
  return res.data
}
