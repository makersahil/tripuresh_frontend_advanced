// src/admin/articles/AdminArticleEditPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import ArticleForm from './ArticleForm'
import { updateArticle, deleteArticle } from './adminApi' // NOTE: path is from THIS file
import type { ArticleInput } from './adminApi'
import type { Article } from '@/lib/types'
import { getOk } from '@/config/api'
import { Button } from '@/components/ui/button'

export default function AdminArticleEditPage() {
  const nav = useNavigate()
  const params = useParams<{ slug: string }>()
  const [sp] = useSearchParams()
  const loc = useLocation() as any

  // Slug resolution order:
  // 1) /admin/articles/:slug (route param)
  // 2) ?slug=... (query param fallback)
  // 3) location.state.row.slug (if deep-linked via state but URL lacks slug)
  const slug = params.slug || sp.get('slug') || loc?.state?.row?.slug || ''

  // If we navigated from the list with a row, prefill immediately
  const [row, setRow] = useState<Article | null>(loc?.state?.row ?? null)
  const [err, setErr] = useState<string | null>(!slug ? 'Missing article slug in URL.' : null)
  const [busy, setBusy] = useState<boolean>(!row && !!slug) // busy only if we need to fetch

  // Fetch on refresh/direct visit if we have a slug but no row yet
  useEffect(() => {
    let active = true
    ;(async () => {
      if (!slug || row) return
      try {
        setBusy(true); setErr(null)
        const res = await getOk<Article>(`/articles/${encodeURIComponent(slug)}`)
        if (active) setRow(res.data)
      } catch (e: any) {
        if (!active) return
        const msg =
          e?.response?.data?.message ||
          e?.message ||
          'Failed to load article'
        setErr(msg)
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => { active = false }
    // We intentionally do NOT include `row` in deps to avoid refetch after local state set.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  const title = useMemo(() => row?.title || 'Edit Article', [row?.title])

  async function handleSave(payload: ArticleInput) {
    if (!row?.id) return
    await updateArticle(row.id, payload)
    nav('/admin/articles', { replace: true })
  }

  async function handleDelete() {
    if (!row?.id) return
    if (!confirm('Delete this article? This cannot be undone.')) return
    await deleteArticle(row.id)
    nav('/admin/articles', { replace: true })
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">Update article details and authors.</p>
          {busy && <div className="text-xs text-muted-foreground mt-1">Loading…</div>}
          {err && <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>}
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={!row?.id || busy}>Delete</Button>
      </div>

      {/* Only render the form once we either have the row or we know we don't need to fetch */}
      {row && (
        <ArticleForm
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
