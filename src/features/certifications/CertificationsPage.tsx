import { useEffect, useMemo, useState } from 'react'
import { listCertifications } from './api'
import type { Certification } from '@/lib/types'
import SkeletonList from '@/components/feedback/SkeletonList'
import ErrorBlock from '@/components/feedback/ErrorBlock'
import EmptyState from '@/components/feedback/EmptyState'
import Pagination from '@/components/shared/Pagination'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Link, useSearchParams } from 'react-router-dom'
import { usePagination } from '@/hooks/usePagination'
import { Input } from '@/components/ui/input'

export default function CertificationsPage() {
  const { page, pageSize, set } = usePagination(10)
  const [sp, setSp] = useSearchParams()
  const sort = sp.get('sort') ?? '-year'
  const q = sp.get('q') ?? ''

  const [rows, setRows] = useState<Certification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState({ page, pageSize, total: 0, pages: 1 })

  useEffect(() => {
    setLoading(true); setError(null)
    listCertifications({ page, pageSize, sort, q })
      .then(({ items, meta }) => { setRows(items); setMeta(meta) })
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false))
  }, [page, pageSize, sort, q])

  function onSortChange(value: string) { sp.set('sort', value); setSp(sp, { replace: true }) }
  function onQChange(value: string) { if (value) sp.set('q', value); else sp.delete('q'); setSp(sp, { replace: true }) }

  const start = useMemo(() => (meta.total ? (meta.page - 1) * meta.pageSize + 1 : 0), [meta])
  const end = useMemo(() => Math.min(meta.page * meta.pageSize, meta.total), [meta])

  if (loading) return <SkeletonList />
  if (error) return <ErrorBlock message={error} />
  if (!rows.length) return <EmptyState title="No certifications found." hint="Try clearing filters." />

  return (
    <section className="container py-10 grid gap-6">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-3xl font-bold">Certifications</h2>
        <div className="flex gap-2">
          <Input defaultValue={q} onChange={(e)=>onQChange(e.target.value)} placeholder="Search…" className="w-48" />
          <select value={sort} onChange={(e)=>onSortChange(e.target.value)} className="h-10 rounded-xl border border-border bg-white px-3 text-sm" aria-label="Sort">
            <option value="-year">Newest first</option>
            <option value="year">Oldest first</option>
            <option value="title">Title A→Z</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-gray-600">Showing {start}–{end} of {meta.total}</div>

      <div className="grid md:grid-cols-2 gap-6">
        {rows.map((row) => (
          <Card key={row.id}>
            <CardHeader><CardTitle><Link to={`/certifications/${row.slug}`} className="underline text-primary">{row.title}</Link></CardTitle></CardHeader>
            <CardContent className="text-sm text-gray-700 space-y-1">
              {'year' in row && row.year ? <div><span className="font-medium">Year:</span> {row.year}</div> : null}
              {row.issuer ? <div><span className="font-medium">Issuer:</span> {row.issuer}</div> : null}
            </CardContent>
          </Card>
        ))}
      </div>

      <Pagination page={meta.page} pages={meta.pages} onChange={(p)=>set(p)} />
    </section>
  )
}
