// src/admin/certifications/CertificationForm.tsx
import { useEffect, useMemo, useState } from 'react'
import type { Certification } from '@/lib/types'
import type { CertificationInput } from './adminApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import InlineAlert from '@/components/feedback/InlineAlert' // if missing, use a small red div
import YearInput from '@/components/forms/YearInput'         // if missing, fallback to <Input type="number" .../>
import UrlInput from '@/components/forms/UrlInput'           // if missing, fallback to <Input .../>

export default function CertificationForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Certification | null
  onSave: (payload: CertificationInput) => Promise<void> | void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [issuer, setIssuer] = useState(initial?.issuer ?? '')
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [published, setPublished] = useState<boolean>(initial?.published ?? true)

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) return
    setTitle(initial.title ?? '')
    setIssuer(initial.issuer ?? '')
    setYear(initial.year ? String(initial.year) : '')
    setLink(initial.link ?? '')
    setPublished(initial.published ?? true)
  }, [initial?.id])

  const canSubmit = useMemo(() => {
    const y = Number(year)
    return Boolean(title.trim()) && Boolean(issuer.trim()) && Number.isFinite(y)
  }, [title, issuer, year])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setErr('Please fill all required fields (Title, Issuer, Year).')
      return
    }
    const payload: CertificationInput = {
      title: title.trim(),
      issuer: issuer.trim(),
      year: Number(year),
      link: link.trim() || undefined,   // URL normalization done in adminApi
      published,
    }

    try {
      setBusy(true); setErr(null)
      await onSave(payload)
    } catch (e: any) {
      console.error('[certification save error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to save certification')
    } finally {
      setBusy(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      {err && <InlineAlert tone="error">{err}</InlineAlert>}

      <label className="grid gap-1">
        <span className="text-sm font-medium">Title *</span>
        <Input value={title} onChange={e => setTitle(e.target.value)} required />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Issuer *</span>
          <Input value={issuer} onChange={e => setIssuer(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Year *</span>
          <YearInput value={year} onChange={setYear} required />
          {/* Fallback:
          <Input type="number" value={year} onChange={e => setYear(e.target.value)} required />
          */}
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Link</span>
        <UrlInput value={link} onChange={setLink} placeholder="https://…" />
        {/* Fallback:
        <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://…" />
        */}
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

      <div className="mt-2 flex items-center justify-end gap-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={!canSubmit || busy}>
          {busy ? 'Saving…' : (initial ? 'Save changes' : 'Create certification')}
        </Button>
      </div>
    </form>
  )
}
