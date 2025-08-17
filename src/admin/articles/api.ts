import { http } from '@/config/api'

export type AdminArticlePayload = {
  title: string
  abstract?: string | null
  journal: string
  year: number
  doi?: string | null
  link?: string | null
  tags?: string[]
  legacyAuthors?: string | null
  published?: boolean
  authorsList?: Array<{ firstName: string; lastName: string }>
}

export async function createArticle(payload: AdminArticlePayload) {
  const res = await http.post('/api/v1/admin/articles', payload)
  return res.data?.data
}

export async function updateArticle(id: string, payload: AdminArticlePayload) {
  const res = await http.put(`/api/v1/admin/articles/${id}`, payload)
  return res.data?.data
}

export async function deleteArticle(id: string) {
  const res = await http.delete(`/api/v1/admin/articles/${id}`)
  return res.data?.data
}
