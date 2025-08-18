// src/pages/Home.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOk } from "@/config/api";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  // FaGoogleScholar,
  FaResearchgate,
  FaOrcid,
  FaEnvelope,
  FaPhone,
} from "react-icons/fa";


type Profile = {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string | null;
  contactEmail?: string | null;
  phone?: string | null;
  socials?: Record<string, string> | null;
};

const iconMap: Record<string, JSX.Element> = {
  Email: <FaEnvelope />,
  Phone: <FaPhone />,
  // "Google Scholar": <FaGoogleScholar />,
  LinkedIn: <FaLinkedin />,
  "Twitter/X": <FaTwitter />,
  ResearchGate: <FaResearchgate />,
  ORCID: <FaOrcid />,
  GitHub: <FaGithub />,
};


export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await getOk<Profile>("/profile");
        if (active) setProfile(res.data);
      } catch {
        // graceful fallback; we’ll render placeholders
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const name = useMemo(() => profile?.name || "Dr Tripuresh Joshi", [profile?.name]);
  const title = useMemo(() => profile?.title || "Associate Professor, ECE", [profile?.title]);
  const bio = useMemo(() => profile?.bio || "", [profile?.bio]);
  const socials = useMemo(() => profile?.socials || {}, [profile?.socials]);

  return (
    <main className="min-h-screen">
      {/* Hero (dynamic name + title, homepage-style CTAs) */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-8 md:grid-cols-12 items-center">
          <div className="md:col-span-7">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Hi, I am {name}.
            </h1>
            <p className="mt-3 text-base md:text-lg text-muted-foreground">
              {title}
            </p>

            <div className="mt-6 flex gap-3">
              {/* Primary CTA (like homepage): Explore Articles */}
              <Link
                to="/articles"
                className="inline-flex items-center rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm"
              >
                Explore Articles
              </Link>
              {/* Contrast/outline CTA: Explore Publications */}
              <Link
                to="/publications"
                className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm"
              >
                Explore Publications
              </Link>
            </div>
          </div>

          <div className="md:col-span-5">
            <div className="relative mx-auto max-w-[340px] overflow-hidden rounded-3xl border">
              <img
                alt={name}
                className="w-full h-auto object-cover"
                src={
                  profile?.avatarUrl ||
                  "https://tripuresh.in/wp-content/uploads/2025/01/DrTJoshi.webp"
                }
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Bio + Socials side-by-side */}
      <section className="bg-muted/30 border-y">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-12">
            {/* Bio */}
            <div className="md:col-span-7">
              <h2 className="text-xl md:text-2xl font-semibold">About Me</h2>
              <div className="mt-4 space-y-4 leading-relaxed text-sm md:text-base">
                {loading && <p className="text-muted-foreground">Loading profile…</p>}
                {!loading && !bio && (
                  <>
                    <p>
                      I am {name}, passionate about integrating academic excellence with impactful
                      research in Electronics and Communication Engineering.
                    </p>
                    <p>
                      My work spans IoT, measurement systems, community tech, and mentoring the next
                      generation of innovators.
                    </p>
                  </>
                )}
                {!!bio && (
                  <p className="[&>br]:block whitespace-pre-wrap">{bio}</p>
                )}
              </div>
            </div>

            {/* Socials */}
            <div className="md:col-span-5">
              <div className="rounded-3xl border p-5">
                <h3 className="text-base font-semibold">Connect</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  Follow or reach out via your preferred platform.
                </p>

                <div className="mt-4 grid gap-2">
                  <SocialLink label="Email" href={profile?.contactEmail ? `mailto:${profile.contactEmail}` : undefined} />
                  <SocialLink label="Phone" href={profile?.phone ? `tel:${profile.phone}` : undefined} />
                  {/* Known keys rendered first for nice labels */}
                  <SocialLink label="Google Scholar" href={getSocial(socials, ["scholar", "googleScholar", "google_scholar"])} />
                  <SocialLink label="LinkedIn" href={getSocial(socials, ["linkedin", "linkedIn"])} />
                  <SocialLink label="Twitter/X" href={getSocial(socials, ["twitter", "x"])} />
                  <SocialLink label="ResearchGate" href={getSocial(socials, ["researchgate"])} />
                  <SocialLink label="ORCID" href={getSocial(socials, ["orcid"])} />
                  <SocialLink label="GitHub" href={getSocial(socials, ["github"])} />
                  {/* Render any remaining unknown socials */}
                  {Object.entries(socials)
                    .filter(([k]) => !KNOWN_KEYS.includes(k.toLowerCase()))
                    .map(([key, url]) => (
                      <SocialLink key={key} label={formatKey(key)} href={url} />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Highlights (4 cards) */}
      <section className="container py-12 md:py-16">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CardLink title="Journal Articles" to="/publications?type=Journal" blurb="Peer-reviewed outputs" />
          <CardLink title="Conferences & Books" to="/publications?type=Conference" blurb="Proceedings & chapters" />
          <CardLink title="Research Grants" to="/grants" blurb="Funded projects & awards" />
          <CardLink title="Patents" to="/patents" blurb="Filed & granted patents" />
        </div>
      </section>

      {/* CTA (unchanged) */}
      <section className="container pb-16">
        <div className="rounded-3xl border p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg md:text-xl font-semibold">Collaborate or invite me to speak</h3>
            <p className="text-sm text-muted-foreground mt-1">
              I love collaborating on research, innovation and academic outreach.
            </p>
          </div>
          <div className="flex gap-3">
            <a
              href={profile?.contactEmail ? `mailto:${profile.contactEmail}` : "mailto:admin@tripuresh.in"}
              className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm"
            >
              Email
            </a>
            <Link
              to="/contact"
              className="inline-flex items-center rounded-2xl bg-primary text-primary-foreground px-4 py-2 text-sm"
            >
              Contact form
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

/* ---------------- helpers & small components ---------------- */

const KNOWN_KEYS = [
  "scholar","googlescholar","google_scholar",
  "linkedin","linkedin.com",
  "twitter","x",
  "researchgate","researchgate.net",
  "orcid",
  "github"
];

function getSocial(obj: Record<string, string | undefined>, keys: string[]) {
  for (const k of keys) {
    const v = obj?.[k] || obj?.[k.toLowerCase()];
    if (v) return v;
  }
  return undefined;
}

function formatKey(k: string) {
  return k
    .replace(/_/g, " ")
    .replace(/-/g, " ")
    .replace(/\b\w/g, c => c.toUpperCase());
}

function SocialLink({ label, href }: { label: string; href?: string }) {
  if (!href) return null;

  return (
    <a
      href={href}
      target={href.startsWith("mailto:") || href.startsWith("tel:") ? "_self" : "_blank"}
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border px-4 py-2 text-sm hover:bg-muted/50"
    >
      <div className="flex items-center gap-2">
        {iconMap[label] && <span className="text-base">{iconMap[label]}</span>}
        <span>{label}</span>
      </div>
      <span className="text-muted-foreground text-xs">→</span>
    </a>
  );
}


function CardLink({
  title,
  blurb,
  to,
}: {
  title: string;
  blurb: string;
  to: string;
}) {
  return (
    <Link
      to={to}
      className="group rounded-2xl border p-5 hover:shadow-sm transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold">{title}</h3>
          <p className="text-xs text-muted-foreground mt-1">{blurb}</p>
        </div>
        <span className="mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full border text-xs group-hover:bg-primary group-hover:text-primary-foreground">
          →
        </span>
      </div>
    </Link>
  );
}
