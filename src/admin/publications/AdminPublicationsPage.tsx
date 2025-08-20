import { useEffect, useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

// pick the Pagination you want:
// - simple one: '@/components/shared/pagination'
// - or your richer nav one: '@/components/navigation/Pagination'
import SimplePagination from '@/components/shared/Pagination'

import { listPublications } from '@/features/publications/api'
import type { Publication, PublicationInput } from '@/lib/types'
import Modal from '@/components/overlays/Modal'
import ConfirmDialog from '@/components/overlays/ConfirmDialog'
import PublicationForm from './PublicationForm'
import { createPublication, updatePublication, deletePublication, } from './adminApi'


export default function AdminPublicationsPage() {
  // filters
  const [q, setQ] = useState('')
  const [type, setType] = useState<string>('')
  const [year, setYear] = useState<string>('')

  // paging
  const [page, setPage] = useState(1)
  const pageSize = 10

  // data
  const [items, setItems] = useState<Publication[]>([])
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // modal / edit
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Publication | null>(null)

  // delete confirm
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [target, setTarget] = useState<Publication | null>(null)
  const [busyDelete, setBusyDelete] = useState(false)

  const params = useMemo(() => ({
    q: q || undefined,
    type: type || undefined,
    year: year ? Number(year) : undefined,
    page,
    pageSize
  }), [q, type, year, page])

  async function load() {
    try {
      setLoading(true); setErr(null)
      const { items, meta } = await listPublications(params)
      setItems(items)
      setPages(meta?.pages ?? 1)
    } catch (e: any) {
      setErr(e?.message || 'Failed to load publications')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [params.page, params.q, params.year, params.type])
  function openCreate() {
    setEditing(null)
    setOpen(true)
  }
  function openEdit(row: Publication) {
    setEditing(row)
    setOpen(true)
  }

  async function handleSave(payload: PublicationInput) {
    if (editing) {
      await updatePublication(editing.id, payload)
    } else {
      await createPublication(payload)
    }
    setOpen(false)
    await load()
  }

  function askDelete(row: Publication) {
    setTarget(row)
    setConfirmOpen(true)
  }

  async function confirmDelete() {
    if (!target) return
    try {
      setBusyDelete(true)
      await deletePublication(target.id)
      setConfirmOpen(false)
      setTarget(null)
      await load()
    } catch (e: any) {
      alert(e?.message || 'Failed to delete')
    } finally {
      setBusyDelete(false)
    }
  }

  return (
    <section className="p-4 sm:p-6 space-y-4">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex-1 grid gap-2">
          <h1 className="text-xl font-semibold">Publications</h1>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
            <Input placeholder="Search…" value={q} onChange={(e) => { setPage(1); setQ(e.target.value) }} />
            <select
              className="rounded-2xl border px-3 py-2 text-sm"
              value={type}
              onChange={(e) => { setPage(1); setType(e.target.value) }}
            >
              <option value="">All types</option>
              <option value="Book">Book</option>
              <option value="Conference">Conference</option>
              <option value="Chapter">Chapter</option>
            </select>
            <Input
              placeholder="Year"
              inputMode="numeric"
              value={year}
              onChange={(e) => { setPage(1); setYear(e.target.value.replace(/[^\d]/g, '')) }}
            />
            <div className="flex items-center gap-2">
              <Button type="button" variant="secondary" onClick={() => load()}>Refresh</Button>
              <Button onClick={openCreate}>New</Button>
            </div>
          </div>
        </div>
      </header>

      {err && <div className="rounded-xl border border-red-300 bg-red-50 p-2 text-sm text-red-700">{err}</div>}

      <div className="overflow-x-auto rounded-2xl border">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-50 text-gray-600">
            <tr>
              <th className="px-4 py-2 text-left">Title</th>
              <th className="px-4 py-2 text-left">Type</th>
              <th className="px-4 py-2 text-left">Year</th>
              <th className="px-4 py-2 text-left">Published</th>
              <th className="px-4 py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">Loading…</td></tr>}
            {!loading && items.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-gray-500">No publications found.</td></tr>}
            {!loading && items.map(row => (
              <tr key={row.id} className="border-t">
                <td className="px-4 py-2">{row.title}</td>
                <td className="px-4 py-2">{row.type}</td>
                <td className="px-4 py-2">{row.year}</td>
                <td className="px-4 py-2">{row.published ? 'Yes' : 'No'}</td>
                <td className="px-4 py-2">
                  <div className="flex items-center justify-end gap-2">
                    <Button variant="secondary" onClick={() => openEdit(row)}>Edit</Button>
                    <Button variant="destructive" onClick={() => askDelete(row)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* simple prev/next pager that matches your shared component */}
      <SimplePagination
        page={page}
        pages={pages}
        onChange={setPage}
      />

      {/* create/edit modal */}
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Publication' : 'New Publication'}
        size="lg"
        footer={null}
      >
        <PublicationForm
          initial={editing}
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      </Modal>

      {/* delete confirm */}
      <ConfirmDialog
        open={confirmOpen}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
        busy={busyDelete}
        title="Delete publication?"
        message={target ? <>This will permanently remove <strong>{target.title}</strong>.</> : 'Delete?'}
        confirmText="Delete"
      />
    </section>
  )
}
