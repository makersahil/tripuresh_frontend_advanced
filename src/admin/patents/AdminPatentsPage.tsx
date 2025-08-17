import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import type { Patent } from '@/lib/types'
import { getListOk } from '@/config/api'
import Input from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Pagination from '@/components/shared/Pagination' // your simple Prev/Next pager

type Meta = { page: number; pages: number; total: number; pageSize: number }

export default function AdminPatentsPage() {
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()

  const page = Number(sp.get('page') || 1)
  const q = sp.get('q') || ''
  const year = sp.get('year') || ''

  const [rows, setRows] = useState<Patent[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  function updateSearch(next: Partial<{ q: string; year: string; page: number }>) {
    const n = new URLSearchParams(sp)
    if (next.q !== undefined) n.set('q', next.q)
    if (next.year !== undefined) n.set('year', next.year)
    if (next.page !== undefined) n.set('page', String(next.page))
    setSp(n, { replace: true })
  }

  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        setBusy(true); setErr(null)
        const { items, meta } = await getListOk<Patent>('/patents', {
          q: q || undefined,
          year: year ? Number(year) : undefined,
          page,
          pageSize: 10,
        })
        if (!active) return
        setRows(items)
        setMeta(meta as any)
      } catch (e: any) {
        if (!active) return
        setErr(e?.response?.data?.message || e?.message || 'Failed to load patents')
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => { active = false }
  }, [q, year, page])

  const hasRows = useMemo(() => rows.length > 0, [rows.length])

  return (
    <section className="container py-8">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">Patents</h1>
          <p className="text-sm text-muted-foreground">Manage patents. Use the New button to add one.</p>
        </div>
        <Button onClick={() => nav('/admin/patents/new')}>New</Button>
      </div>

      <div className="mb-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Input
          placeholder="Search…"
          value={q}
          onChange={e => updateSearch({ q: e.target.value, page: 1 })}
        />
        <Input
          placeholder="Year"
          inputMode="numeric"
          value={year}
          onChange={e => updateSearch({ year: e.target.value, page: 1 })}
        />
      </div>

      {err && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800 mb-4">{err}</div>}
      {busy && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!busy && !hasRows && (
        <div className="rounded-2xl border px-4 py-6 text-sm text-muted-foreground">No results.</div>
      )}

      {hasRows && (
        <div className="rounded-2xl border overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="[&>th]:text-left [&>th]:px-3 [&>th]:py-2">
                <th>Title</th>
                <th>Country</th>
                <th>Patent No.</th>
                <th>Year</th>
                <th>Published</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="[&>tr>td]:px-3 [&>tr>td]:py-2">
              {rows.map(r => (
                <tr key={r.id} className="border-t">
                  <td className="font-medium">{r.title}</td>
                  <td>{r.country}</td>
                  <td>{r.patentNo}</td>
                  <td>{r.year}</td>
                  <td>{r.published ? 'Yes' : 'No'}</td>
                  <td className="text-right">
                    <Link
                      to={`/admin/patents/${r.slug}`}
                      state={{ row: r }}
                      className="text-primary hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {meta && (
        <Pagination
          page={meta.page || 1}
          pages={meta.pages || 1}
          onChange={(next) => updateSearch({ page: next })}
        />
      )}
    </section>
  )
}
