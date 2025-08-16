import { useState } from 'react'
import { Input } from '../../components/ui/input'
import { Button } from '../../components/ui/button'
import { http } from '../../config/api'

export default function SearchPage() {
  const [q, setQ] = useState('')
  const [rows, setRows] = useState<any[]>([])
  const [err, setErr] = useState<string| null>(null)

  async function onSearch() {
    setErr(null)
    try {
      const res = await http.get('/search', { params: { q } })
      setRows(res.data?.data ?? [])
    } catch (e:any) {
      setErr(e?.message ?? 'Failed to search')
    }
  }

  return (
    <section className="container py-10 space-y-4">
      <div className="flex gap-2">
        <Input value={q} onChange={(e)=>setQ(e.target.value)} placeholder="Search articles, publications, grants…" />
        <Button onClick={onSearch}>Search</Button>
      </div>
      {err && <div className="text-red-600">{err}</div>}
      <ul className="space-y-2">
        {rows.map((r, i) => <li key={i} className="text-sm">{r.kind}: {r.title}</li>)}
      </ul>
    </section>
  )
}
