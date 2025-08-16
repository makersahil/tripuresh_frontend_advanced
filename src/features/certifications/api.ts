import { getListOk, getOk } from '@/config/api'
import type { Certification } from '@/lib/types'

export async function listCertifications(params: { page?: number; pageSize?: number; sort?: string; q?: string; year?: number } = {}) {
  const { items, meta } = await getListOk<Certification>('/certifications', params)
  return { items, meta }
}

export async function getCertification(slug: string) {
  const res = await getOk<Certification>(`/certifications/${slug}`)
  return res.data
}
