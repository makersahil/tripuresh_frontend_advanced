// src/admin/articles/AdminArticlesPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { getListOk } from '@/config/api'
import type { Article } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import { useNavigate } from 'react-router-dom'

type PageMeta = { page: number; pages: number; total: number; pageSize: number }

export default function AdminArticlesPage() {
  const nav = useNavigate()
  const [items, setItems] = useState<Article[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [q, setQ] = useState('')
  const [year, setYear] = useState<string>('')
  const [page, setPage] = useState(1)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const query = useMemo(() => ({
    q: q || undefined,
    year: year ? Number(year) : undefined,
    page,
    pageSize: 10,
  }), [q, year, page])

  async function load() {
    try {
      setBusy(true); setErr(null)
      const res = await getListOk<Article>('/articles', query)
      // Support both {items, meta} and direct array shapes
      const items = (res as any)?.items ?? (res as any)?.data?.items ?? (Array.isArray(res) ? res : [])
      const meta  = (res as any)?.meta  ?? (res as any)?.data?.meta  ?? null
      setItems(items)
      setMeta(meta)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load articles')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { load() }, [query.page, query.q, query.year, query.pageSize])

  function goEdit(row: Article) {
    // Use slug in route (refresh-safe), and pass the partial row for instant paint
    const slug = (row as any).slug
    nav(`/admin/articles/${encodeURIComponent(slug)}`, { state: { row } })
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <div className="text-xl font-semibold">Articles</div>
          <p className="text-sm text-muted-foreground">Create, edit, and manage research articles.</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={q}
            onChange={e => { setPage(1); setQ(e.target.value) }}
          />
          <Input
            placeholder="Year"
            inputMode="numeric"
            value={year}
            onChange={e => { setPage(1); setYear(e.target.value) }}
          />
          <Button type="button" variant="secondary" onClick={() => load()}>Refresh</Button>
          <Button onClick={() => nav('/admin/articles/new')}>New Article</Button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>
      )}

      <div className="overflow-x-auto rounded-2xl border">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="[&>th]:px-4 [&>th]:py-2 [&>th]:text-left">
              <th>Title</th>
              <th>Journal</th>
              <th>Year</th>
              <th>Published</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                  {busy ? 'Loading…' : 'No articles found'}
                </td>
              </tr>
            )}
            {items.map(row => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2">{row.title}</td>
                <td className="px-4 py-2">{row.journal}</td>
                <td className="px-4 py-2">{row.year}</td>
                <td className="px-4 py-2">{row.published ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2 text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" onClick={() => goEdit(row)}>Edit</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pager */}
      {meta && meta.pages > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <Button
            variant="ghost"
            disabled={meta.page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Prev
          </Button>
          <span className="text-sm">Page {meta.page} of {meta.pages}</span>
          <Button
            variant="ghost"
            disabled={meta.page >= meta.pages}
            onClick={() => setPage(p => Math.min(meta.pages, p + 1))}
          >
            Next
          </Button>
        </div>
      )}
    </section>
  )
}
