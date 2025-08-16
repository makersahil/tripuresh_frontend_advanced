import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getArticle } from './api'
import type { Article } from '@/lib/types'
import Loader from '@/components/feedback/Loader'
import ErrorBlock from '@/components/feedback/ErrorBlock'

export default function ArticleDetail() {
  const { slug } = useParams()
  const [row, setRow] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!slug) return
    setLoading(true); setError(null)
    getArticle(slug)
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
      {row.journal ? <div className="text-gray-600">Journal: {row.journal}</div> : null}
      {row.abstract ? <p className="text-gray-700">{row.abstract}</p> : null}
    </section>
  )
}
