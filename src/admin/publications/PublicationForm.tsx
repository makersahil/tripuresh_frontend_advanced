import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import type { Publication, PublicationInput } from '@/lib/types'
// import type { PublicationInput } from './adminApi'

// If you already have these shared inputs, keep using them.
// If not, swap them with <Input> or a simple <input>.
import YearInput from '@/components/forms/YearInput'
import UrlInput from '@/components/forms/UrlInput'
import TagsInput from '@/components/forms/TagsInput'

const TYPES: Array<PublicationInput['type']> = ['Book', 'Conference', 'Chapter']

type Props = {
  initial?: Publication | null
  onCancel: () => void
  onSave: (payload: PublicationInput) => Promise<void>
}

export default function PublicationForm({ initial, onCancel, onSave }: Props) {
  const isEdit = !!initial

  const [title, setTitle] = useState(initial?.title ?? '')
  const [description, setDescription] = useState(initial?.description ?? '')
  const [type, setType] = useState<PublicationInput['type']>(initial?.type ?? 'Book')
  const [year, setYear] = useState<number | ''>(initial?.year ?? '')
  const [publisher, setPublisher] = useState(initial?.publisher ?? '')
  const [link, setLink] = useState(initial?.link ?? '')
  const [tags, setTags] = useState<string[]>(initial?.tags ?? [])
  const [published, setPublished] = useState<boolean>(initial?.published ?? true)

  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)

  const canSubmit = useMemo(() => {
    return title.trim() && description.trim() && type && typeof year === 'number'
  }, [title, description, type, year])

  async function handleSubmit() {
    if (!canSubmit) {
      setErr('Please fill all required fields.')
      return
    }
    const payload: PublicationInput = {
      title: title.trim(),
      description: description.trim(),
      type,
      year: year as number,
      publisher: publisher?.trim() || undefined,
      link: link?.trim() || undefined,
      tags,
      published,
    }
    try {
      setBusy(true)
      setErr(null)
      await onSave(payload)
    } catch (e: any) {
      setErr(e?.message || 'Failed to save publication')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="grid gap-4">
      {err && <div className="rounded-xl border border-red-300 bg-red-50 p-2 text-sm text-red-700">{err}</div>}

      <label className="grid gap-1">
        <span className="text-sm font-medium">Title *</span>
        <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Publication title" />
      </label>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Description *</span>
        <textarea
          className="min-h-[120px] rounded-2xl border px-3 py-2 text-sm"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Short description"
        />
      </label>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <label className="grid gap-1">
          <span className="text-sm font-medium">Type *</span>
          <select
            className="rounded-2xl border px-3 py-2 text-sm"
            value={type}
            onChange={e => setType(e.target.value as PublicationInput['type'])}
          >
            {TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </label>

        <YearInput label="Year *" required value={year} onChange={setYear} />

        <label className="grid gap-1">
          <span className="text-sm font-medium">Published</span>
          <div className="flex items-center gap-2">
            <input id="pub-published" type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
            <label htmlFor="pub-published" className="text-sm">Visible on site</label>
          </div>
        </label>
      </div>

      <label className="grid gap-1">
        <span className="text-sm font-medium">Publisher</span>
        <Input value={publisher} onChange={e => setPublisher(e.target.value)} placeholder="Publisher (optional)" />
      </label>

      <UrlInput label="External link" value={link} onChange={setLink} />
      <TagsInput value={tags} onChange={setTags} />

      <div className="flex justify-end gap-2 pt-2">
        <Button variant="secondary" onClick={onCancel} disabled={busy}>Cancel</Button>
        <Button onClick={handleSubmit} disabled={!canSubmit || busy}>
          {busy ? 'Saving…' : (isEdit ? 'Update' : 'Create')}
        </Button>
      </div>
    </div>
  )
}
