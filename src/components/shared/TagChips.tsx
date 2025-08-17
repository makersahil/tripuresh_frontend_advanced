import { useMemo, useState } from 'react'

export default function TagChips({ value, onChange }: { value?: string[]; onChange: (tags: string[]) => void }) {
  const [input, setInput] = useState('')
  const tags = useMemo(() => (value && Array.isArray(value) ? value : []), [value])

  const add = (raw: string) => {
    const t = raw.trim()
    if (!t) return
    const next = Array.from(new Set([...tags, t]))
    onChange(next)
    setInput('')
  }
  const remove = (t: string) => onChange(tags.filter(x => x !== t))

  return (
    <div className="grid gap-2">
      <div className="flex flex-wrap gap-2">
        {tags.map(t => (
          <span key={t} className="inline-flex items-center gap-1 border rounded-full px-2 py-0.5 text-xs">
            {t}
            <button type="button" className="opacity-70 hover:opacity-100" onClick={() => remove(t)}>×</button>
          </span>
        ))}
      </div>
      <input
        className="border rounded-xl px-3 py-2"
        placeholder="Type a tag and press Enter"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault()
            add(input)
          }
        }}
      />
    </div>
  )
}
