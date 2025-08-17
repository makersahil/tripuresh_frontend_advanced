// src/admin/articles/AdminArticleNewPage.tsx
import { useNavigate } from 'react-router-dom'
import ArticleForm from './ArticleForm'
import { createArticle } from './adminApi'
import type { ArticleInput } from './adminApi'

export default function AdminArticleNewPage() {
  const nav = useNavigate()

  async function handleSave(payload: ArticleInput) {
    await createArticle(payload)
    nav('/admin/articles', { replace: true })
  }

  return (
    <section className="container py-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">New Article</h1>
        <p className="text-sm text-muted-foreground">Add a new research article.</p>
      </div>
      <ArticleForm onSave={handleSave} onCancel={() => nav('/admin/articles')} />
    </section>
  )
}
