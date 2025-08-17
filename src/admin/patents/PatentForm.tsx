import { useEffect, useMemo, useState } from 'react'
import type { Patent } from '@/lib/types'
import type { PatentInput, InventorInput } from './adminApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'

function ensureUrl(u?: string) {
  const s = (u || '').trim()
  if (!s) return undefined
  if (/^https?:\/\//i.test(s)) return s
  return `https://${s}`
}

export default function PatentForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Patent | null
  onSave: (payload: PatentInput) => Promise<void> | void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [country, setCountry] = useState(initial?.country ?? '')
  const [patentNo, setPatentNo] = useState(initial?.patentNo ?? '')
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [legacyInventors, setLegacyInventors] = useState(initial?.legacyInventors ?? '')
  const [published, setPublished] = useState<boolean>(initial?.published ?? true)

  // shape inventors from initial (public detail returns embedded people on some builds)
  const [invFirst, setInvFirst] = useState('')
  const [invLast, setInvLast] = useState('')
  const [inventors, setInventors] = useState<InventorInput[]>(
    ((initial as any)?.inventors ?? []).map((i: any) => ({ firstName: i.firstName, lastName: i.lastName })) ?? []
  )

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) return
    setTitle(initial.title ?? '')
    setCountry(initial.country ?? '')
    setPatentNo(initial.patentNo ?? '')
    setYear(initial.year ? String(initial.year) : '')
    setLink(initial.link ?? '')
    setLegacyInventors(initial.legacyInventors ?? '')
    setPublished(initial.published ?? true)
    setInventors(((initial as any)?.inventors ?? []).map((i: any) => ({ firstName: i.firstName, lastName: i.lastName })))
  }, [initial?.id])

  const canSubmit = useMemo(() => {
    const y = Number(year)
    return Boolean(title.trim()) && Boolean(country.trim()) && Boolean(patentNo.trim()) && Number.isFinite(y)
  }, [title, country, patentNo, year])

  function addInventor() {
    const fn = invFirst.trim()
    const ln = invLast.trim()
    if (!fn || !ln) return
    setInventors(prev => [...prev, { firstName: fn, lastName: ln }])
    setInvFirst(''); setInvLast('')
  }
  function removeInventor(i: number) {
    setInventors(prev => prev.filter((_, idx) => idx !== i))
  }
  function moveInventorUp(i: number) {
    if (i <= 0) return
    setInventors(prev => {
      const next = [...prev]
      const t = next[i - 1]; next[i - 1] = next[i]; next[i] = t
      return next
    })
  }
  function moveInventorDown(i: number) {
    setInventors(prev => {
      if (i >= prev.length - 1) return prev
      const next = [...prev]
      const t = next[i + 1]; next[i + 1] = next[i]; next[i] = t
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setErr('Please fill all required fields (Title, Country, Patent No, Year).')
      return
    }
    const payload: PatentInput = {
      title: title.trim(),
      country: country.trim(),
      patentNo: patentNo.trim(),
      year: Number(year),
      link: ensureUrl(link),
      legacyInventors: legacyInventors.trim() || undefined,
      published,
      inventorsList: inventors.length ? inventors : undefined,
    }
    try {
      setBusy(true); setErr(null)
      await onSave(payload)
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Failed to save patent'
      setErr(msg)
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-3">
      {/* Left: main form */}
      <div className="md:col-span-2 grid gap-4">
        {err && (
          <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <label className="grid gap-1">
          <span className="text-sm font-medium">Title *</span>
          <Input value={title} onChange={e => setTitle(e.target.value)} required />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Country *</span>
            <Input value={country} onChange={e => setCountry(e.target.value)} required />
          </label>
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Patent No. *</span>
            <Input value={patentNo} onChange={e => setPatentNo(e.target.value)} required />
          </label>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Year *</span>
            <Input type="number" inputMode="numeric" value={year} onChange={e => setYear(e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Link (URL)</span>
            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://patents.google.com/..." />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Legacy Inventors (optional note)</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={2}
            value={legacyInventors}
            onChange={e => setLegacyInventors(e.target.value)}
          />
        </label>

        <label className="inline-flex items-center gap-2 select-none">
          <input
            type="checkbox"
            className="h-4 w-4 rounded border-border"
            checked={published}
            onChange={e => setPublished(e.target.checked)}
          />
          <span className="text-sm">Published</span>
        </label>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={!canSubmit || busy}>
            {busy ? 'Saving…' : (initial ? 'Save changes' : 'Create patent')}
          </Button>
        </div>
      </div>

      {/* Right: Inventors manager */}
      <aside className="md:col-span-1">
        <div className="rounded-2xl border p-4 grid gap-3">
          <div className="text-sm font-semibold">Inventors (ordered)</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input placeholder="First name" value={invFirst} onChange={e => setInvFirst(e.target.value)} />
            <Input placeholder="Last name" value={invLast} onChange={e => setInvLast(e.target.value)} />
          </div>
          <Button type="button" onClick={addInventor} disabled={!invFirst.trim() || !invLast.trim()}>
            Add inventor
          </Button>

          <div className="grid gap-2">
            {inventors.length === 0 && (
              <div className="text-xs text-muted-foreground">No inventors added.</div>
            )}
            {inventors.map((i, idx) => (
              <div key={`${i.firstName}-${i.lastName}-${idx}`} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div className="text-sm">{idx + 1}. {i.firstName} {i.lastName}</div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" onClick={() => moveInventorUp(idx)} disabled={idx === 0}>↑</Button>
                  <Button type="button" variant="ghost" onClick={() => moveInventorDown(idx)} disabled={idx === inventors.length - 1}>↓</Button>
                  <Button type="button" variant="destructive" onClick={() => removeInventor(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </form>
  )
}
