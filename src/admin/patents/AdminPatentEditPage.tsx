import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import PatentForm from './PatentForm'
import { updatePatent, deletePatent } from './adminApi'
import type { PatentInput } from './adminApi'
import type { Patent } from '@/lib/types'
import { getOk } from '@/config/api'
import { Button } from '@/components/ui/button'

export default function AdminPatentEditPage() {
  const nav = useNavigate()
  const params = useParams<{ slug: string }>()
  const [sp] = useSearchParams()
  const loc = useLocation() as any

  const slug = params.slug || sp.get('slug') || loc?.state?.row?.slug || ''

  const [row, setRow] = useState<Patent | null>(loc?.state?.row ?? null)
  const [err, setErr] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    ;(async () => {
      if (row || !slug) return
      try {
        setBusy(true)
        const res = await getOk<Patent>(`/patents/${slug}`)
        if (active) setRow(res.data)
      } catch (e: any) {
        if (active) setErr(e?.response?.data?.message || e?.message || 'Failed to load patent')
      } finally {
        if (active) setBusy(false)
      }
    })()
    return () => { active = false }
  }, [slug, row])

  const title = useMemo(() => row?.title || 'Edit Patent', [row?.title])

  async function handleSave(payload: PatentInput) {
    if (!row?.id) return
    await updatePatent(row.id, payload)
    nav('/admin/patents', { replace: true })
  }

  async function handleDelete() {
    if (!row?.id) return
    if (!confirm(`Delete this patent? This cannot be undone.`)) return
    await deletePatent(row.id)
    nav('/admin/patents', { replace: true })
  }

  return (
    <section className="container py-8">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">Update patent details and inventors.</p>
          {busy && <div className="text-xs text-muted-foreground mt-1">Loading…</div>}
          {err && <div className="mt-2 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>}
        </div>
        <Button variant="destructive" onClick={handleDelete} disabled={!row?.id}>Delete</Button>
      </div>

      <PatentForm
        initial={row ?? undefined}
        onSave={handleSave}
        onCancel={() => nav('/admin/patents')}
      />
    </section>
  )
}
