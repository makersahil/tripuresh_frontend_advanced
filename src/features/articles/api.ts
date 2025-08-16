import { getListOk, getOk } from '@/config/api'
import type { Article, PageMeta } from '@/lib/types'

export async function listArticles(params: { page?: number; pageSize?: number; sort?: string; q?: string; year?: number } = {}) {
  const { items, meta } = await getListOk<Article>('/articles', params)
  return { items, meta }
}

export async function getArticle(slug: string) {
  const res = await getOk<Article>(`/articles/${slug}`)
  return res.data
}
