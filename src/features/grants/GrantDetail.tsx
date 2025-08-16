import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getGrant } from './api'
import type { Grant } from '@/lib/types'
import Loader from '@/components/feedback/Loader'
import ErrorBlock from '@/components/feedback/ErrorBlock'

export default function GrantDetail() {
  const { slug } = useParams()
  const [row, setRow] = useState<Grant | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(null)
    getGrant(slug)
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
      {row.amount ? <div className="text-gray-600">Amount: {row.amount}</div> : null}
      {row.summary ? <p className="text-gray-700">{row.summary}</p> : null}
      {row.link ? <a className="text-primary underline" href={row.link} target="_blank">Grant link</a> : null}
    </section>
  )
}
