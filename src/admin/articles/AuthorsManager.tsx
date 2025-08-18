import { useState } from 'react'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'

export type SimpleAuthor = { firstName: string; lastName: string }

export default function AuthorsManager({
  value,
  onChange,
}: {
  value: SimpleAuthor[]
  onChange: (next: SimpleAuthor[]) => void
}) {
  const [aFirst, setAFirst] = useState('')
  const [aLast, setALast] = useState('')

  function addAuthor() {
    const first = aFirst.trim()
    const last = aLast.trim()
    if (!first || !last) return
    onChange([...value, { firstName: first, lastName: last }])
    setAFirst('')
    setALast('')
  }

  function removeAuthor(idx: number) {
    const next = value.slice()
    next.splice(idx, 1)
    onChange(next)
  }

  function move(idx: number, dir: -1 | 1) {
    const j = idx + dir
    if (j < 0 || j >= value.length) return
    const next = value.slice()
    const tmp = next[idx]
    next[idx] = next[j]
    next[j] = tmp
    onChange(next)
  }

  return (
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
        {value.length === 0 && (
          <div className="text-xs text-muted-foreground">No authors added.</div>
        )}

        {value.map((a, idx) => (
          <div
            key={`${a.firstName}-${a.lastName}-${idx}`}
            className="flex items-center justify-between rounded-xl border px-3 py-2"
          >
            <div className="text-sm">
              {idx + 1}. {a.firstName} {a.lastName}
            </div>
            <div className="flex items-center gap-1">
              <Button
                type="button"
                variant="ghost"
                onClick={() => move(idx, -1)}
                disabled={idx === 0}
              >
                ↑
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => move(idx, +1)}
                disabled={idx === value.length - 1}
              >
                ↓
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={() => removeAuthor(idx)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
