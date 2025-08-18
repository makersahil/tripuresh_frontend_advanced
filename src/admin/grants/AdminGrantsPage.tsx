// src/admin/grants/AdminGrantsPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { getListOk } from '@/config/api'
import type { ResearchGrant } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Modal from '@/components/overlays/Modal'
import GrantForm from './GrantForm'
import { createGrant, updateGrant, deleteGrant } from './adminApi'
import ConfirmDialog from '@/components/overlays/ConfirmDialog'


type PageMeta = { page: number; pages: number; total: number; pageSize: number }

export default function AdminGrantsPage() {
  const [items, setItems] = useState<ResearchGrant[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [q, setQ] = useState('')
  const [year, setYear] = useState<string>('')
  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<ResearchGrant | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const [confirmOpen, setConfirmOpen] = useState(false)
  const [busyDelete, setBusyDelete] = useState(false)
  const [target, setTarget] = useState<Grant | null>(null)


  const params = useMemo(() => {
    const p: Record<string, any> = { page, pageSize: 10 }
    if (q.trim()) p.q = q.trim()
    if (year.trim()) p.year = Number(year)
    return p
  }, [q, year, page])

  async function load() {
    try {
      setBusy(true); setErr(null)
      const { items, meta } = await getListOk<ResearchGrant>('/grants', params)
      setItems(items)
      setMeta(meta)
    } catch (e: any) {
      console.error('[grants list error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to load grants')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { load() }, [params.page, params.q, params.year, params.type])
  function openCreate() {
    setEditing(null)
    setOpen(true)
  }
  function openEdit(row: ResearchGrant) {
    setEditing(row)
    setOpen(true)
  }

  async function handleSave(input: Parameters<typeof createGrant>[0]) {
    if (editing) {
      await updateGrant(editing.id, input)
    } else {
      await createGrant(input)
    }
    setOpen(false)
    await load()
  }

  async function handleDelete(row: ResearchGrant) {
    if (!confirm(`Delete grant "${row.title}"? This cannot be undone.`)) return
    await deleteGrant(row.id)
    await load()
  }

  function askDelete(row: Grant) {
    setTarget(row)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!target?.id) return
    try {
      setBusyDelete(true)
      await deleteGrant(target.id)
      setConfirmOpen(false)
      setTarget(null)
      await load() // reuse your existing list loader
    } finally {
      setBusyDelete(false)
    }
  }


  return (
    <section className="container py-8">
      <div className="mb-5 flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <div className="text-xl font-semibold">Research Grants</div>
          <p className="text-sm text-muted-foreground">Create, edit, and remove grants.</p>
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
          <Button type="button" variant="secondary" onClick={() => load()}>
            Refresh
          </Button>
          <Button onClick={openCreate}>New grant</Button>
        </div>
      </div>

      {err && (
        <div className="mb-4 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      <div className="grid gap-3">
        <div className="overflow-hidden rounded-2xl border">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-4 py-2 text-left">Title</th>
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-left">Amount</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    {busy ? 'Loading…' : 'No grants found'}
                  </td>
                </tr>
              )}
              {items.map(row => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2">{row.title}</td>
                  <td className="px-4 py-2">{row.year}</td>
                  <td className="px-4 py-2">{row.amount?.toLocaleString?.() ?? '—'}</td>
                  <td className="px-4 py-2">{row.published ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => openEdit(row)}>Edit</Button>
                      <Button variant="destructive" onClick={() => askDelete(row)}>Delete</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Simple pager */}
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
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Grant' : 'New Grant'}
        size="lg"
        footer={null}
      >
        <GrantForm
          initial={editing}
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      </Modal>

      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        busy={busyDelete}
        title="Delete grant?"
        message={
          target ? <>This will permanently remove <strong>{target.title}</strong>.</> : 'Delete?'
        }
        confirmText="Delete"
      />
    </section>
  )
}
