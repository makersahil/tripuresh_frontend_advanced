import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import type { Patent } from '@/lib/types'
import { getListOk } from '@/config/api'
import Input from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/overlays/ConfirmDialog'
import { deletePatent } from './adminApi'
import Pagination from '@/components/shared/Pagination'

type Meta = { page: number; pages: number; total: number; pageSize: number }

export default function AdminPatentsPage() {
  const nav = useNavigate()
  const [sp, setSp] = useSearchParams()

  const page = Number(sp.get('page') || 1)
  const q = sp.get('q') || ''
  const yearStr = sp.get('year') || ''

  const [rows, setRows] = useState<Patent[]>([])
  const [meta, setMeta] = useState<Meta | null>(null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busyDelete, setBusyDelete] = useState(false)
  const [target, setTarget] = useState<Patent | null>(null)

  // ---- useMemo: derive stable, primitive query inputs
  const year = useMemo(() => (yearStr ? Number(yearStr) : undefined), [yearStr])
  const query = useMemo(
    () => ({
      page,
      q: q || undefined,
      year,
      pageSize: 10 as const,
    }),
    [page, q, year]
  )

  function updateSearch(next: Partial<{ q: string; year: string; page: number }>) {
    const n = new URLSearchParams(sp)
    if (next.q !== undefined) n.set('q', next.q)
    if (next.year !== undefined) n.set('year', next.year)
    if (next.page !== undefined) n.set('page', String(next.page))
    setSp(n, { replace: true })
  }

  // ---- useCallback: stable loader used by effect + Refresh button
  const load = useCallback(async () => {
    try {
      setBusy(true)
      setErr(null)
      const { items, meta } = await getListOk<Patent>('/patents', query)
      setRows(items)
      setMeta(meta as any)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to load patents')
    } finally {
      setBusy(false)
    }
  }, [query.page, query.q, query.year, query.pageSize])

  // ---- useEffect: trigger load when query changes
  useEffect(() => {
    let active = true
    ;(async () => {
      await load()
    })()
    return () => {
      active = false
    }
  }, [load])

  const hasRows = useMemo(() => rows.length > 0, [rows.length])

  function goEdit(row: Patent) {
    nav(`/admin/patents/${row.slug}`, { state: { row } })
  }

  function askDelete(row: Patent) {
    setTarget(row)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!target?.id) return
    try {
      setBusyDelete(true)
      await deletePatent(target.id)
      setConfirmOpen(false)
      setTarget(null)
      await load()
    } finally {
      setBusyDelete(false)
    }
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <h1 className="text-xl font-semibold">Patents</h1>
          <p className="text-sm text-muted-foreground">Create, edit, and remove certifications.</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <Input
            placeholder="Search…"
            value={q}
            onChange={e => updateSearch({ q: e.target.value, page: 1 })}
          />
          <Input
            placeholder="Year"
            inputMode="numeric"
            value={yearStr}
            onChange={e => updateSearch({ year: e.target.value, page: 1 })}
          />
          <Button type="button" variant="secondary" onClick={load}>
            Refresh
          </Button>
          <Button onClick={() => nav('/admin/patents/new')}>New Patent</Button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}
      {busy && <div className="text-sm text-muted-foreground">Loading…</div>}

      {!busy && !hasRows && (
        <div className="rounded-2xl border px-4 py-6 text-sm text-muted-foreground">No results.</div>
      )}

      {hasRows && (
        <div className="overflow-x-auto rounded-2xl border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr className="[&>th]:px-3 [&>th]:py-2 [&>th]:text-left">
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
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => goEdit(r)}>
                        Edit
                      </Button>
                      <Button variant="destructive" onClick={() => askDelete(r)}>
                        Delete
                      </Button>
                    </div>
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
          onChange={next => updateSearch({ page: next })}
        />
      )}

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        busy={busyDelete}
        title="Delete patent?"
        message={target ? <>This will permanently remove <strong>{target.title}</strong>.</> : 'Delete?'}
        confirmText="Delete"
      />
    </section>
  )
}
