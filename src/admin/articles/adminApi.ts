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

function normalizeHttpUrl(u?: string) {
  if (!u) return undefined
  const t = u.trim()
  if (!t) return undefined
  return /^https?:\/\//i.test(t) ? t : `https://${t}`
}

function compact<T extends Record<string, any>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj)
      .map(([k, v]) => {
        if (k === 'link' || k === 'doi') return [k, normalizeHttpUrl(v as string)]
        if (k === 'tags' && Array.isArray(v)) return [k, v.filter(Boolean)]
        return [k, v]
      })
      .filter(([_, v]) => {
        if (v === '' || v === null || v === undefined) return false
        if (Array.isArray(v) && v.length === 0) return false
        return true
      })
  ) as T
}

export async function createArticle(input: ArticleInput): Promise<Article> {
  const res = await http.post(`${ADMIN_BASE}/articles`, compact(input))
  return res.data?.data as Article
}

export async function updateArticle(id: string, input: ArticleInput): Promise<Article> {
  const res = await http.put(`${ADMIN_BASE}/articles/${id}`, compact(input))
  return res.data?.data as Article
}

export async function deleteArticle(id: string): Promise<void> {
  await http.delete(`${ADMIN_BASE}/articles/${id}`)
}
