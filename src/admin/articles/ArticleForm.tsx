// src/admin/articles/ArticleForm.tsx
import { useEffect, useMemo, useState } from 'react'
import type { Article } from '@/lib/types'
import type { ArticleInput, AuthorInput } from './adminApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'

export default function ArticleForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Article | null
  onSave: (payload: ArticleInput) => Promise<void> | void
  onCancel: () => void
}) {
  // Main fields
  const [title, setTitle] = useState(initial?.title ?? '')
  const [journal, setJournal] = useState(initial?.journal ?? '')
  const [year, setYear] = useState<string>(initial?.year ? String(initial.year) : '')
  const [abstract, setAbstract] = useState(initial?.abstract ?? '')
  const [doi, setDoi] = useState(initial?.doi ?? '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '))
  const [legacyAuthors, setLegacyAuthors] = useState(initial?.legacyAuthors ?? '')
  const [published, setPublished] = useState<boolean>(initial?.published ?? true)

  // Authors manager
  const [aFirst, setAFirst] = useState('')
  const [aLast, setALast] = useState('')
  const [authors, setAuthors] = useState<AuthorInput[]>(
    // try to shape from initial.authors as [{firstName,lastName}]
    (initial as any)?.authors?.map((a: any) => ({ firstName: a.firstName, lastName: a.lastName })) ?? []
  )

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    if (!initial) return
    setTitle(initial.title ?? '')
    setJournal(initial.journal ?? '')
    setYear(initial.year ? String(initial.year) : '')
    setAbstract(initial.abstract ?? '')
    setDoi(initial.doi ?? '')
    setLink(initial.link ?? '')
    setTagsText((initial.tags ?? []).join(', '))
    setLegacyAuthors(initial.legacyAuthors ?? '')
    setPublished(initial.published ?? true)
    setAuthors(((initial as any)?.authors ?? []).map((a: any) => ({ firstName: a.firstName, lastName: a.lastName })))
  }, [initial?.id])

  const canSubmit = useMemo(() => {
    const y = Number(year)
    return Boolean(title.trim()) && Boolean(journal.trim()) && Number.isFinite(y)
  }, [title, journal, year])

  function addAuthor() {
    const fn = aFirst.trim(); const ln = aLast.trim()
    if (!fn || !ln) return
    setAuthors(prev => [...prev, { firstName: fn, lastName: ln }])
    setAFirst(''); setALast('')
  }
  function removeAuthor(i: number) {
    setAuthors(prev => prev.filter((_, idx) => idx !== i))
  }
  function moveAuthorUp(i: number) {
    if (i <= 0) return
    setAuthors(prev => {
      const next = [...prev]
      const t = next[i - 1]; next[i - 1] = next[i]; next[i] = t
      return next
    })
  }
  function moveAuthorDown(i: number) {
    setAuthors(prev => {
      if (i >= prev.length - 1) return prev
      const next = [...prev]
      const t = next[i + 1]; next[i + 1] = next[i]; next[i] = t
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!canSubmit) {
      setErr('Please fill all required fields (Title, Journal, Year).')
      return
    }
    // tags: comma-separated → string[]
    const tags = tagsText
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)

    const authorsList = authors.filter(a => a.firstName.trim() && a.lastName.trim())

    const payload: ArticleInput = {
      title: title.trim(),
      journal: journal.trim(),
      year: Number(year),
      abstract: abstract.trim() || undefined,
      doi: doi.trim() || undefined,
      link: link.trim() || undefined,
      tags: tags.length ? tags : undefined,
      legacyAuthors: legacyAuthors.trim() || undefined,
      published,
      authorsList: authorsList.length ? authorsList : undefined,
    }

    try {
      setBusy(true); setErr(null)
      await onSave(payload)
    } catch (e: any) {
      console.error('[article save error]', e?.response?.data || e)
      setErr(e?.response?.data?.message || e?.message || 'Failed to save article')
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
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Journal *</span>
            <Input value={journal} onChange={e => setJournal(e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Year *</span>
            <Input type="number" inputMode="numeric" value={year} onChange={e => setYear(e.target.value)} required />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Abstract</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={4}
            value={abstract}
            onChange={e => setAbstract(e.target.value)}
          />
        </label>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm font-medium">DOI (URL)</span>
            <Input value={doi} onChange={e => setDoi(e.target.value)} placeholder="https://doi.org/..." />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Link (URL)</span>
            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com/article" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <Input value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="ML, Vision, Robotics" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Legacy Authors (optional note)</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={2}
            value={legacyAuthors}
            onChange={e => setLegacyAuthors(e.target.value)}
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
            {busy ? 'Saving…' : (initial ? 'Save changes' : 'Create article')}
          </Button>
        </div>
      </div>

      {/* Right: Authors manager */}
      <aside className="md:col-span-1">
        <div className="rounded-2xl border p-4 grid gap-3">
          <div className="text-sm font-semibold">Authors (ordered)</div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Input placeholder="First name" value={aFirst} onChange={e => setAFirst(e.target.value)} />
            <Input placeholder="Last name" value={aLast} onChange={e => setALast(e.target.value)} />
          </div>
          <Button type="button" onClick={addAuthor} disabled={!aFirst.trim() || !aLast.trim()}>
            Add author
          </Button>

          <div className="grid gap-2">
            {authors.length === 0 && (
              <div className="text-xs text-muted-foreground">No authors added.</div>
            )}
            {authors.map((a, idx) => (
              <div key={`${a.firstName}-${a.lastName}-${idx}`} className="flex items-center justify-between rounded-xl border px-3 py-2">
                <div className="text-sm">{idx + 1}. {a.firstName} {a.lastName}</div>
                <div className="flex items-center gap-1">
                  <Button type="button" variant="ghost" onClick={() => moveAuthorUp(idx)} disabled={idx === 0}>↑</Button>
                  <Button type="button" variant="ghost" onClick={() => moveAuthorDown(idx)} disabled={idx === authors.length - 1}>↓</Button>
                  <Button type="button" variant="destructive" onClick={() => removeAuthor(idx)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>
    </form>
  )
}
