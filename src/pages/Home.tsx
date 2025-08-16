import Hero from '../components/site/Hero'
import Section from '../components/site/Section'
import StatCard from '../components/site/StatCard'
import CTA from '../components/site/CTA'
import SocialLinks from '../components/site/SocialLinks'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div id="main">
      <Hero
        title="Dr. Tripuresh Joshi"
        subtitle="Professor • Researcher • Author"
        ctaPrimary={{ label: "View Articles", to: "/articles" }}
        ctaSecondary={{ label: "About", to: "/about" }}
      >
        <SocialLinks />
      </Hero>

      <Section eyebrow="Overview" title="Academic Focus">
        <div className="grid md:grid-cols-2 gap-6">
          <p className="text-gray-700">
            Work spans computer science and interdisciplinary applications with a focus on
            impactful research, quality teaching, and mentoring.
          </p>
          <ul className="list-disc pl-5 text-gray-700 space-y-1">
            <li>Peer-reviewed publications and book chapters</li>
            <li>Funded research grants and patents</li>
            <li>Curriculum design, supervision, and outreach</li>
          </ul>
        </div>
      </Section>

      <Section eyebrow="Highlights" title="At a glance">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard value="25+" label="Journal Articles" />
          <StatCard value="10+" label="Book/Conference Works" />
          <StatCard value="5+" label="Research Grants" />
          <StatCard value="3" label="Patents" />
        </div>
      </Section>

      <Section eyebrow="Explore" title="Featured Sections">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard to="/articles" title="Articles" desc="Peer-reviewed research output and citations." />
          <FeatureCard to="/publications" title="Publications" desc="Books, chapters, and conference papers." />
          <FeatureCard to="/grants" title="Grants" desc="Funded projects and collaborations." />
        </div>
      </Section>

      <CTA />
    </div>
  )
}

function FeatureCard({ to, title, desc }: { to: string; title: string; desc: string }) {
  return (
    <Link
      to={to}
      className="block rounded-2xl border border-border bg-card shadow-soft p-5 hover:translate-y-[-2px] transition"
    >
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-gray-700 mt-1">{desc}</p>
      <span className="text-primary underline mt-2 inline-block">View</span>
    </Link>
  )
}
