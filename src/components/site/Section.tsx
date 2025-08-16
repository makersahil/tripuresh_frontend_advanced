import { ReactNode } from "react"

export default function Section({
  title,
  eyebrow,
  children,
  id,
}: {
  title: string
  eyebrow?: string
  children: ReactNode
  id?: string
}) {
  return (
    <section id={id} className="container py-10 md:py-14">
      <header className="mb-6">
        {eyebrow && <p className="text-primary font-medium">{eyebrow}</p>}
        <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
      </header>
      <div>{children}</div>
    </section>
  )
}