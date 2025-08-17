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

  const params = useMemo(() => {
    const p: Record<string, any> = { page, pageSize: 10 }
    if (q.trim()) p.q = q.trim()
    if (year.trim()) p.year = Number(year)
    return p
  }, [q, year, page])

  async function load() {
    try {
      setBusy(true); setErr(null)
      const { items, meta } = await getListOk<Article>('/articles', params)
      setItems(items)
      setMeta(meta)
    } catch (e: any) {
      console.error('[articles list error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to load articles')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { load() }, [params.page, params.q, params.year])

  function goNew() {
    nav('/admin/articles/new')
  }

  function goEdit(row: Article) {
    // pass row and also provide slug in URL for refresh rehydrate
    const slug = (row as any).slug
    nav(`/admin/articles/${row.id}${slug ? `?slug=${encodeURIComponent(slug)}` : ''}`, { state: { row } })
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <div className="text-xl font-semibold">Articles</div>
          <p className="text-sm text-muted-foreground">Create, edit, and remove research articles.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={q}
            onChange={e => { setPage(1); setQ(e.target.value) }}
            className="w-56"
          />
          <Input
            placeholder="Year"
            inputMode="numeric"
            value={year}
            onChange={e => { setPage(1); setYear(e.target.value) }}
            className="w-28"
          />
          <Button onClick={goNew}>New article</Button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Journal</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Published</th>
              <th className="px-4 py-2 text-right">Actions</th>
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
                    {/* Delete from list would need admin DELETE; safer to do it from the edit page or add here later */}
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
