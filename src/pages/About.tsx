import Section from '../components/site/Section'

export default function About() {
  return (
    <div id="main">
      <Section eyebrow="About" title="Profile">
        <div className="prose max-w-none">
          <p>
            Hardcoded summary matching the current site’s structure. This can later be enriched with
            data from the API (Profile endpoint).
          </p>
          <p>
            Areas of work: Computer Science, AI, software engineering, and interdisciplinary research
            with emphasis on practical impact and pedagogy.
          </p>
        </div>
      </Section>

      <Section title="Teaching & Mentoring">
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Course design and delivery at undergraduate and postgraduate levels</li>
          <li>Project/thesis supervision</li>
          <li>Seminars, workshops, and invited lectures</li>
        </ul>
      </Section>

      <Section title="Selected Recognitions">
        <ul className="list-disc pl-5 text-gray-700 space-y-1">
          <li>Publications in reputed venues</li>
          <li>Funded grants and patents</li>
          <li>Academic service and community outreach</li>
        </ul>
      </Section>
    </div>
  )
}
