import { getListOk, getOk } from '@/config/api'
import type { Publication } from '@/lib/types'

export async function listPublications(params: { page?: number; pageSize?: number; sort?: string; q?: string; year?: number; type?: string } = {}) {
  const { items, meta } = await getListOk<Publication>('/publications', params)
  return { items, meta }
}

export async function getPublication(slug: string) {
  const res = await getOk<Publication>(`/publications/${slug}`)
  return res.data
}
