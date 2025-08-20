// src/admin/articles/AdminArticleEditPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ArticleForm from './ArticleForm'
import { updateArticle, deleteArticle } from './adminApi'
import type { ArticleInput } from './adminApi'
import type { Article } from '@/lib/types'
import { getOk } from '@/config/api'
import { Button } from '@/components/ui/button'

export default function AdminArticleEditPage() {
  const nav = useNavigate()
  const params = useParams<{ slug: string }>()
  const [sp] = useSearchParams()
  const loc = useLocation() as { state?: { row?: Article } }

  // Resolve slug from param or state or query string
  const slug = useMemo(() => {
    return params.slug || (loc.state?.row as any)?.slug || sp.get('slug') || ''
  }, [params.slug, sp, loc.state])

  const [row, setRow] = useState<Article | null>(loc.state?.row ?? null)
  const [busy, setBusy] = useState<boolean>(!loc.state?.row)
  const [err, setErr] = useState<string | null>(null)

  // Always fetch full row by slug (list row is partial)
  useEffect(() => {
    if (!slug) return
    let active = true
    ;(async () => {
      try {
        if (!row) setBusy(true)
        setErr(null)
        const res = await getOk<any>(`/articles/${encodeURIComponent(slug)}`)
        // Unwrap { success, data } → article
        const article: Article = res?.data?.data ?? res?.data ?? res
        if (!active) return
        setRow(article)
      } catch (e: any) {
        if (!active) return
        setErr(e?.response?.data?.message || e?.message || 'Failed to load article')
      } finally {
        if (active && !row) setBusy(false)
      }
    })()
    return () => { active = false }
    // Only when slug changes; we don't want to loop on row
  }, [slug])

  async function handleSave(payload: ArticleInput) {
    if (!row?.id) return
    await updateArticle(row.id, payload)
    nav('/admin/articles', { replace: true })
  }

  async function handleDelete() {
    if (!row?.id) return
    const ok = confirm(`Delete article "${row.title}"? This cannot be undone.`)
    if (!ok) return
    await deleteArticle(row.id)
    nav('/admin/articles', { replace: true })
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Edit Article</h1>
          <p className="text-sm text-muted-foreground">{slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
          <Button onClick={() => nav('/admin/articles')}>Back</Button>
        </div>
      </div>

      {err && <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>}
      {busy && <div className="text-sm text-muted-foreground">Loading…</div>}

      {row && (
        <ArticleForm
          key={`${row.id}:${row.updatedAt ?? ''}`} // force remount when hydrated record arrives
          initial={row}
          onSave={handleSave}
          onCancel={() => nav('/admin/articles')}
        />
      )}

      {!row && !busy && !err && (
        <div className="text-sm text-muted-foreground">No article loaded.</div>
      )}
    </section>
  )
}
