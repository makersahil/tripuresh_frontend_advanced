import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getCertification } from './api'
import type { Certification } from '@/lib/types'
import Loader from '@/components/feedback/Loader'
import ErrorBlock from '@/components/feedback/ErrorBlock'

export default function CertificationDetail() {
  const { slug } = useParams()
  const [row, setRow] = useState<Certification | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(null)
    getCertification(slug)
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
      {row.issuer ? <div className="text-gray-600">Issuer: {row.issuer}</div> : null}
      {row.link ? <a className="text-primary underline" href={row.link} target="_blank">Certificate link</a> : null}
    </section>
  )
}
