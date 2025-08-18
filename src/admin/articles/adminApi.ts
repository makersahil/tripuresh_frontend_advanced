// src/admin/articles/adminApi.ts
import { http } from '@/config/api'
import type { Article } from '@/lib/types'

export type AuthorInput = { firstName: string; lastName: string }
export type ArticleInput = {
  title: string
  abstract?: string
  journal: string
  year: number
  doi?: string
  link?: string
  tags?: string[]
  legacyAuthors?: string
  published?: boolean
  authorsList?: AuthorInput[] // ordered, 1..n
}

const ADMIN_BASE = '/api/v1/admin'

// Drop undefined/empty fields to keep payloads clean
function compact<T extends Record<string, any>>(obj: T): Partial<T> {
  const out: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v === undefined || v === null) continue
    if (Array.isArray(v) && v.length === 0) continue
    if (typeof v === 'string' && v.trim() === '') continue
    out[k] = v
  }
  return out as Partial<T>
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const res = await http.post(`${ADMIN_BASE}/articles`, compact(input))
  return (res?.data?.data ?? res?.data ?? res) as Article
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  const res = await http.put(`${ADMIN_BASE}/articles/${id}`, compact(input))
  return (res?.data?.data ?? res?.data ?? res) as Article
}

export async function deleteArticle(id: string): Promise<void> {
  await http.delete(`${ADMIN_BASE}/articles/${id}`)
}
