import { Button } from "../ui/button"

export default function CTA() {
  return (
    <section aria-label="Call to action" className="container py-12 md:py-16">
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 to-transparent p-8 md:p-10 border border-border shadow-soft">
        <h3 className="text-2xl md:text-3xl font-bold">Collaborations & Mentoring</h3>
        <p className="text-gray-700 mt-2">
          Open to research collaborations, thesis supervision, and invited talks.
        </p>
        <div className="mt-4">
          <Button asChild>
            <a href="mailto:contact@tripuresh.in" aria-label="Email Dr. Tripuresh Joshi">Contact</a>
          </Button>
        </div>
      </div>
    </section>
  )
}