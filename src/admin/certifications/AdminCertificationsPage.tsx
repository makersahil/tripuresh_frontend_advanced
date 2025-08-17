// src/admin/certifications/AdminCertificationsPage.tsx
import { useEffect, useMemo, useState } from 'react'
import { getListOk } from '@/config/api'
import type { Certification } from '@/lib/types'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Modal from '@/components/overlays/Modal'
import CertificationForm from './CertificationForm'
import { createCertification, updateCertification, deleteCertification } from './adminApi'

type PageMeta = { page: number; pages: number; total: number; pageSize: number }

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([])
  const [meta, setMeta] = useState<PageMeta | null>(null)
  const [q, setQ] = useState('')
  const [year, setYear] = useState<string>('')
  const [page, setPage] = useState(1)

  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Certification | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const params = useMemo(() => {
    const p: Record<string, any> = { page, pageSize: 10 }
    if (q.trim()) p.q = q.trim()
    if (year.trim()) p.year = Number(year)
    return p
  }, [q, year, page])

  async function load() {
    try {
      setBusy(true); setErr(null)
      const { items, meta } = await getListOk<Certification>('/certifications', params)
      setItems(items)
      setMeta(meta)
    } catch (e: any) {
      console.error('[certifications list error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to load certifications')
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => { load() }, [params.page, params.q, params.year])

  function openCreate() {
    setEditing(null)
    setOpen(true)
  }
  function openEdit(row: Certification) {
    setEditing(row)
    setOpen(true)
  }

  async function handleSave(input: Parameters<typeof createCertification>[0]) {
    if (editing) {
      await updateCertification(editing.id, input)
    } else {
      await createCertification(input)
    }
    setOpen(false)
    await load()
  }

  async function handleDelete(row: Certification) {
    if (!confirm(`Delete certification "${row.title}"? This cannot be undone.`)) return
    await deleteCertification(row.id)
    await load()
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex flex-wrap items-end gap-2">
        <div className="grid gap-1">
          <div className="text-xl font-semibold">Certifications</div>
          <p className="text-sm text-muted-foreground">Create, edit, and remove certifications.</p>
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
          <Button onClick={openCreate}>New certification</Button>
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
                <th className="px-4 py-2 text-left">Issuer</th>
                <th className="px-4 py-2 text-left">Year</th>
                <th className="px-4 py-2 text-left">Published</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-muted-foreground">
                    {busy ? 'Loading…' : 'No certifications found'}
                  </td>
                </tr>
              )}
              {items.map(row => (
                <tr key={row.id} className="border-t">
                  <td className="px-4 py-2">{row.title}</td>
                  <td className="px-4 py-2">{row.issuer}</td>
                  <td className="px-4 py-2">{row.year}</td>
                  <td className="px-4 py-2">{row.published ? 'Yes' : 'No'}</td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" onClick={() => openEdit(row)}>Edit</Button>
                      <Button variant="destructive" onClick={() => handleDelete(row)}>Delete</Button>
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
      </div>

      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title={editing ? 'Edit Certification' : 'New Certification'}
        size="md"
        footer={null}
      >
        <CertificationForm
          initial={editing}
          onCancel={() => setOpen(false)}
          onSave={handleSave}
        />
      </Modal>
    </section>
  )
}
