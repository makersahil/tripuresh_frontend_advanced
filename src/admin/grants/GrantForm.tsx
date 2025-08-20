// src/admin/grants/GrantForm.tsx
import { useEffect, useMemo, useState } from 'react'
import type { ResearchGrant } from '@/lib/types'
import type { GrantInput } from './adminApi'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import YearInput from '@/components/forms/YearInput'      // if missing, swap to <Input type="number" .../>
import UrlInput from '@/components/forms/UrlInput'        // if missing, swap to <Input .../>
import InlineAlert from '@/components/feedback/InlineAlert'// or replace with a small red div

export default function GrantForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: ResearchGrant | null
  onSave: (payload: GrantInput) => Promise<void> | void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(initial?.title ?? '')
  const [summary, setSummary] = useState(initial?.summary ?? '')
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : '')
  const [amount, setAmount] = useState<string>(initial?.amount ? String(initial.amount) : '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [published, setPublished] = useState<boolean>(initial?.published ?? true)

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) return
    setTitle(initial.title ?? '')
    setSummary(initial.summary ?? '')
    setYear(initial.year ? String(initial.year) : '')
    setAmount(initial.amount ? String(initial.amount) : '')
    setLink(initial.link ?? '')
    setPublished(initial.published ?? true)
  }, [initial?.id])

  const canSubmit = useMemo(() => {
    const y = Number(year)
    return Boolean(title.trim()) && Number.isFinite(y)
  }, [title, year])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setErr('Please fill all required fields (Title, Year).')
      return
    }
    const payload: GrantInput = {
      title: title.trim(),
      summary: summary.trim() || undefined,
      year: Number(year),
      amount: amount.trim() === '' ? undefined : Number(amount),
      link: link.trim() || undefined,
      published,
    }

    try {
      setBusy(true); setErr(null)
      await onSave(payload)
    } catch (e: any) {
      console.error('[grant save error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to save grant')
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

      <label className="grid gap-1">
        <span className="text-sm font-medium">Summary</span>
        <textarea
          className="rounded-xl border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/30"
          rows={4}
          value={summary}
          onChange={e => setSummary(e.target.value)}
          placeholder="Brief description"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Year *</span>
          <YearInput value={year} onChange={setYear} required /> 
          {/* If YearInput not available:
          <Input type="number" value={year} onChange={e => setYear(e.target.value)} required />
          */}
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Amount</span>
          <Input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            min={0}
            placeholder="(optional)"
          />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Link</span>
          <UrlInput value={link} onChange={setLink} placeholder="https://…" />
          {/* If UrlInput not available:
          <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://…" />
          */}
        </label>
      </div>

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
          {busy ? 'Saving…' : (initial ? 'Save changes' : 'Create grant')}
        </Button>
      </div>
    </form>
  )
}
