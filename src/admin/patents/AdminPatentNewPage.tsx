import { useNavigate } from 'react-router-dom'
import PatentForm from './PatentForm'
import { createPatent } from './adminApi'
import type { PatentInput } from './adminApi'

export default function AdminPatentNewPage() {
  const nav = useNavigate()

  async function handleSave(payload: PatentInput) {
    await createPatent(payload)
    nav('/admin/patents', { replace: true })
  }

  return (
    <section className="container py-8">
      <div className="mb-5">
        <h1 className="text-xl font-semibold">New Patent</h1>
        <p className="text-sm text-muted-foreground">Add a new patent and its inventors.</p>
      </div>
      <PatentForm onSave={handleSave} onCancel={() => nav('/admin/patents')} />
    </section>
  )
}
