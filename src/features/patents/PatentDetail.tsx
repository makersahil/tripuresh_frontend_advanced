import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPatent } from './api'
import type { Patent } from '@/lib/types'
import Loader from '@/components/feedback/Loader'
import ErrorBlock from '@/components/feedback/ErrorBlock'

export default function PatentDetail() {
  const { slug } = useParams()
  const [row, setRow] = useState<Patent | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(null)
    getPatent(slug)
      .then(setRow)
      .catch((e) => setError(e?.message ?? 'Failed to load'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loader />
  if (error) return <ErrorBlock message={error} />
  if (!row) return null

  return (
    <section className="container py-10 grid gap-4">
      <h2 className="text-3xl font-bold">{row.title}</h2>
      {row.year ? <div className="text-gray-600">Year: {row.year}</div> : null}
      {row.patentNo ? <div className="text-gray-600">Patent No: {row.patentNo}</div> : null}
      {row.country ? <div className="text-gray-600">Country: {row.country}</div> : null}
      {row.link ? <a className="text-primary underline" href={row.link} target="_blank">Patent link</a> : null}
    </section>
  )
}
