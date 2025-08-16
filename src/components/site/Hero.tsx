import { ReactNode } from "react"
import { Button } from "../ui/button"

type HeroProps = {
  title: string
  subtitle?: string
  children?: ReactNode
  ctaPrimary?: { label: string; to: string }
  ctaSecondary?: { label: string; to: string }
}

export default function Hero({ title, subtitle, children, ctaPrimary, ctaSecondary }: HeroProps) {
  return (
    <section aria-label="Intro" className="container py-12 md:py-16 grid gap-8 md:grid-cols-2 items-center">
      <div className="space-y-5">
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">{title}</h1>
        {subtitle && <p className="text-lg text-gray-600">{subtitle}</p>}
        {children}
        <div className="flex gap-3 pt-2">
          {ctaPrimary && <Button asChild><a href={ctaPrimary.to}>{ctaPrimary.label}</a></Button>}
          {ctaSecondary && (
            <Button className="bg-muted text-foreground hover:opacity-90" asChild>
              <a href={ctaSecondary.to}>{ctaSecondary.label}</a>
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-2xl bg-muted h-64 md:h-80 shadow-soft flex items-center justify-center">
        <div className="text-center" aria-hidden>
          <div className="text-6xl">🎓</div>
          <div className="mt-2 text-gray-600">Research • Teaching • Impact</div>
        </div>
      </div>
    </section>
  )
}