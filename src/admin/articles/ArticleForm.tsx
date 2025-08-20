// src/admin/articles/ArticleForm.tsx
import { useEffect, useMemo, useState } from 'react'
import type { Article } from '@/lib/types'
import type { ArticleInput, AuthorInput } from './adminApi'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import AuthorsManager from './AuthorsManager'

function pickAuthors(initial?: any): AuthorInput[] {
  // Prefer ordered list if present
  if (Array.isArray(initial?.authorsList) && initial.authorsList.length) {
    return initial.authorsList
      .map((x: any) => ({ firstName: x.firstName ?? '', lastName: x.lastName ?? '' }))
      .filter(a => a.firstName && a.lastName)
  }
  // Support join-shape: [{ author: { firstName, lastName }, position }]
  if (Array.isArray(initial?.authors) && initial.authors.length) {
    return initial.authors
      .map((x: any) => ({
        firstName: x.firstName ?? x.author?.firstName ?? '',
        lastName: x.lastName ?? x.author?.lastName ?? '',
      }))
      .filter(a => a.firstName && a.lastName)
  }
  // Fallback to legacyAuthors: "A B, C D"
  if (typeof initial?.legacyAuthors === 'string' && initial.legacyAuthors.trim()) {
    return initial.legacyAuthors
      .split(',')
      .map((s: string) => s.trim())
      .filter(Boolean)
      .map((full: string) => {
        const parts = full.split(/\s+/)
        const last = parts.pop() || ''
        return { firstName: parts.join(' ') || last, lastName: parts.length ? last : '' }
      })
      .filter(a => a.firstName)
  }
  return []
}

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
  const [year, setYear] = useState(initial?.year ? String(initial.year) : '')
  const [abstract, setAbstract] = useState(initial?.abstract ?? '')
  const [doi, setDoi] = useState(initial?.doi ?? '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [tagsText, setTagsText] = useState((initial?.tags ?? []).join(', '))
  const [legacyAuthors, setLegacyAuthors] = useState(initial?.legacyAuthors ?? '')
  const [published, setPublished] = useState(initial?.published ?? true)

  // Authors list (ordered)
  const [authors, setAuthors] = useState<AuthorInput[]>(pickAuthors(initial))

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  // Rehydrate whenever the *content* changes (not just id)
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
    setAuthors(pickAuthors(initial))
  }, [initial?.id, (initial as any)?.updatedAt, JSON.stringify({
    a: initial?.abstract, d: initial?.doi, l: initial?.link, t: initial?.tags, la: initial?.legacyAuthors,
    j: initial?.journal, y: initial?.year, p: initial?.published, s: (initial as any)?.authorsList, s2: (initial as any)?.authors
  })])

  const canSubmit = useMemo(() => {
    const y = Number(year)
    return Boolean(title && journal && year && !Number.isNaN(y))
  }, [title, journal, year])

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

    const payload: ArticleInput = {
      title: title.trim(),
      abstract: abstract.trim() || undefined,
      journal: journal.trim(),
      year: Number(year),
      doi: doi.trim() || undefined,
      link: link.trim() || undefined,
      tags: tags.length ? tags : undefined,
      legacyAuthors: legacyAuthors.trim() || undefined,
      published,
      authorsList: authors.length ? authors : undefined, // this is what backend expects for ordered authors
    }

    try {
      setBusy(true); setErr(null)
      await onSave(payload)
    } catch (e: any) {
      setErr(e?.response?.data?.message || e?.message || 'Failed to save article')
    } finally {
      setBusy(false)
    }
  }

  // Layout
  return (
    <form className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_340px]" onSubmit={handleSubmit}>
      <div className="grid gap-3">
        {err && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{err}</div>}

        <label className="grid gap-1">
          <span className="text-sm font-medium">Title</span>
          <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Paper title" />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <label className="grid gap-1 sm:col-span-2">
            <span className="text-sm font-medium">Journal</span>
            <Input value={journal} onChange={e => setJournal(e.target.value)} placeholder="Nature" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Year</span>
            <Input value={year} onChange={e => setYear(e.target.value)} inputMode="numeric" placeholder="2025" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Abstract</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={6}
            value={abstract}
            onChange={e => setAbstract(e.target.value)}
            placeholder="A short abstract…"
          />
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="grid gap-1">
            <span className="text-sm font-medium">DOI</span>
            <Input value={doi} onChange={e => setDoi(e.target.value)} placeholder="https://doi.org/..." />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Link</span>
            <Input value={link} onChange={e => setLink(e.target.value)} placeholder="https://example.com/paper" />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Tags (comma-separated)</span>
          <Input value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="ML, Vision, Robotics" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm font-medium">Legacy Authors (optional)</span>
          <textarea
            className="w-full rounded-2xl border border-border bg-background px-3 py-2 text-sm"
            rows={2}
            value={legacyAuthors}
            onChange={e => setLegacyAuthors(e.target.value)}
            placeholder="Only if you need a legacy display string"
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

      {/* Sidebar: ordered authors */}
      <aside className="md:col-span-1">
        <AuthorsManager value={authors} onChange={setAuthors} />
      </aside>
    </form>
  )
}
