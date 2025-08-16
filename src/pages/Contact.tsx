import Section from '../components/site/Section'

export default function Contact() {
  return (
    <div id="main">
      <Section eyebrow="Contact" title="Get in touch">
        <div className="max-w-xl space-y-3 text-gray-700">
          <div>
            Email:{" "}
            <a className="text-primary underline" href="mailto:contact@tripuresh.in">
              contact@tripuresh.in
            </a>
          </div>
          <div>For collaboration or speaking requests, please include a short brief and timeline.</div>
        </div>
      </Section>

      <Section title="Quick message (no backend needed)">
        <form className="max-w-xl grid gap-3" onSubmit={(e)=>e.preventDefault()} aria-describedby="form-help">
          <label className="grid gap-1">
            <span className="text-sm font-medium">Name</span>
            <input className="h-10 w-full rounded-xl border border-border px-3" placeholder="Your name" required aria-required="true" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input className="h-10 w-full rounded-xl border border-border px-3" type="email" placeholder="you@example.com" required aria-required="true" />
          </label>
          <label className="grid gap-1">
            <span className="text-sm font-medium">Message</span>
            <textarea className="min-h-[120px] w-full rounded-xl border border-border px-3 py-2" placeholder="How can we collaborate?" />
          </label>
          <p id="form-help" className="text-xs text-gray-600">
            This demo form does not send data. Use the email link above for real messages.
          </p>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-2 text-sm font-medium bg-primary text-white shadow-soft">
            Preview
          </button>
        </form>
      </Section>
    </div>
  )
}
