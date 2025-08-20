import { http } from '@/config/api'
import type { Publication, PublicationInput } from '@/lib/types'

// Shape the backend expects on create/update
// export type PublicationInput = {
//   title: string
//   description: string
//   type: 'Book' | 'Conference' | 'Chapter'
//   year: number
//   publisher?: string
//   link?: string
//   tags?: string[]
//   published?: boolean
// }

export async function createPublication(payload: PublicationInput): Promise<Publication> {
  const res = await http.post('/api/v1/admin/publications', payload)
  return res.data?.data as Publication
}

export async function updatePublication(id: string, payload: PublicationInput): Promise<Publication> {
  const res = await http.put(`/api/v1/admin/publications/${id}`, payload)
  return res.data?.data as Publication
}

export async function deletePublication(id: string): Promise<void> {
  await http.delete(`/api/v1/admin/publications/${id}`)
}
