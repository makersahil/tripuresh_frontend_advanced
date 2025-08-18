// src/pages/About.tsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getOk } from "@/config/api";
import type { Profile as ProfileType } from "@/lib/types";
import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaGlobe,
  FaGoogle,
  FaOrcid,
  FaResearchgate,
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

export default function About() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getOk<ProfileType>("/profile");
        if (!active) return;
        const p = res.data as any;
        setProfile({
          name: p?.name ?? "Dr. Tripuresh Joshi",
          title: p?.title ?? "Professor & Researcher",
          bio:
            p?.bio ??
            "Engineering solutions that bridge research, industry and society.",
          avatarUrl: p?.avatarUrl,
          contactEmail: p?.contactEmail ?? "admin@tripuresh.in",
          phone: p?.phone ?? null,
          socials: (p?.socials as any) ?? {},
        });
      } catch (e: any) {
        if (!active) return;
        setErr(e?.message || "Failed to load profile.");
        setProfile({
          name: "Dr. Tripuresh Joshi",
          title: "Professor & Researcher",
          bio:
            "Engineering solutions that bridge research, industry and society.",
          socials: {},
        });
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const socials = useMemo(() => profile?.socials ?? {}, [profile?.socials]);

  return (
    <main className="min-h-screen">
      {/* Unique Hero (different from Home) */}
      <section className="border-b bg-muted/40">
        <div className="container py-12 md:py-16">
          <div className="grid gap-8 md:grid-cols-12 items-center">
            <div className="md:col-span-8">
              <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
                About {loading ? "…" : profile?.name || "Dr. Tripuresh Joshi"}
              </h1>
              <p className="mt-3 text-base md:text-lg text-muted-foreground">
                {loading ? "Loading title…" : profile?.title}
              </p>
            </div>
            <div className="md:col-span-4">
              <div className="relative mx-auto max-w-[320px] overflow-hidden rounded-3xl border">
                <img
                  alt={profile?.name || "Profile"}
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
        </div>
      </section>

      {/* Bio + Socials (side-by-side; different from Home) */}
      <section className="container py-12 md:py-16">
        {err && (
          <div className="mb-6 rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
            {err}
          </div>
        )}

        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="text-xl md:text-2xl font-semibold">Biography</h2>
            <div className="prose max-w-none prose-sm md:prose-base mt-4 leading-relaxed">
              {loading ? (
                <p className="text-muted-foreground">Loading bio…</p>
              ) : (
                <RichBio text={profile?.bio || ""} />
              )}
            </div>
          </div>

          <aside className="md:col-span-4">
            <div className="rounded-3xl border p-5">
              <h3 className="text-base font-semibold">Connect</h3>
              <div className="mt-4 grid gap-2">
                <SocialLink
                  label="Email"
                  href={
                    profile?.contactEmail
                      ? `mailto:${profile.contactEmail}`
                      : undefined
                  }
                  icon={<FaEnvelope />}
                />
                <SocialLink
                  label="Phone"
                  href={profile?.phone ? `tel:${profile.phone}` : undefined}
                  icon={<FaPhone />}
                />
                <SocialLink
                  label="Google Scholar"
                  href={getSocial(socials, ["scholar", "googleScholar", "google_scholar"])}
                  icon={<FaGoogle />}
                />
                <SocialLink
                  label="LinkedIn"
                  href={getSocial(socials, ["linkedin", "linkedIn"])}
                  icon={<FaLinkedin />}
                />
                <SocialLink
                  label="Twitter/X"
                  href={getSocial(socials, ["twitter", "x"])}
                  icon={<FaTwitter />}
                />
                <SocialLink
                  label="ResearchGate"
                  href={getSocial(socials, ["researchgate"])}
                  icon={<FaResearchgate />}
                />
                <SocialLink
                  label="ORCID"
                  href={getSocial(socials, ["orcid"])}
                  icon={<FaOrcid />}
                />
                <SocialLink
                  label="GitHub"
                  href={getSocial(socials, ["github"])}
                  icon={<FaGithub />}
                />
                <SocialLink
                  label="Website"
                  href={getSocial(socials, ["website", "site", "url", "homepage"])}
                  icon={<FaGlobe />}
                />
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Quick Stats (fresh block) */}
      <section className="bg-muted/30 border-y">
        <div className="container py-10 md:py-14">
          <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Years in Academia" value="14+" />
            <Stat label="Publications" value="60+" />
            <Stat label="Grants & Projects" value="10+" />
            <Stat label="Patents" value="3+" />
          </ul>
        </div>
      </section>

      {/* Timeline (fresh block) */}
      <section className="container py-12 md:py-16">
        <h2 className="text-xl md:text-2xl font-semibold">Selected Timeline</h2>
        <ul className="mt-6 grid gap-4">
          <TimelineItem year="2025" title="Senior roles & active research">
            Expanded work across IoT, communication systems and applied engineering education.
          </TimelineItem>
          <TimelineItem year="2021" title="Young Scientist Award">
            Recognized for impactful research and academic contributions.
          </TimelineItem>
          <TimelineItem year="2019–2024" title="Key Research Initiatives">
            IoT-based water quality monitoring, rain attenuation measurement device, tech resource center.
          </TimelineItem>
          <TimelineItem year="2009–2018" title="Academic Foundations">
            Teaching, mentoring, and early publications in electronics & communication engineering.
          </TimelineItem>
        </ul>
      </section>

      {/* Values (fresh block) */}
      <section className="bg-muted/30 border-y">
        <div className="container py-12 md:py-16">
          <h2 className="text-xl md:text-2xl font-semibold">Values & Focus</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <ValueCard title="Impact">
              Research that benefits students, society, and industry—beyond citations.
            </ValueCard>
            <ValueCard title="Rigor">
              Scientific depth, reproducibility, and precision in every project.
            </ValueCard>
            <ValueCard title="Mentorship">
              Guiding the next generation to build, publish, and lead.
            </ValueCard>
          </div>
        </div>
      </section>

      {/* Media & Contact CTA (different from Home CTA) */}
      <section className="container py-12 md:py-16">
        <div className="rounded-3xl border p-6 md:p-8 grid gap-5 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="text-lg md:text-xl font-semibold">Media & Speaking</h3>
            <p className="text-sm text-muted-foreground mt-2">
              For media kits, invited talks, and collaborations, feel free to reach out.
            </p>
          </div>
          <div className="flex items-start md:items-center justify-end gap-3">
            <a
              href={`mailto:${profile?.contactEmail || "admin@tripuresh.in"}`}
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

      {/* FAQs (fresh block) */}
      <section className="container pb-16">
        <h2 className="text-xl md:text-2xl font-semibold">FAQs</h2>
        <div className="mt-6 grid gap-4">
          <Faq q="Do you collaborate with industry?">
            Yes — especially on IoT, communications, and applied research pilots.
          </Faq>
          <Faq q="How can students get involved?">
            Watch for RA/TA announcements, or reach out with a concise proposal and resume.
          </Faq>
          <Faq q="Do you serve on program committees or as a reviewer?">
            Yes. Invitations are welcome via email with context and timelines.
          </Faq>
        </div>
      </section>
    </main>
  );
}

/* ---------- helpers ---------- */

function RichBio({ text }: { text: string }) {
  // Keep it simple — split paragraphs on double newline
  const parts = (text || "").trim().split(/\n\s*\n/);
  if (parts.length <= 1) return <p>{text}</p>;
  return (
    <>
      {parts.map((p, i) => (
        <p key={i}>{p}</p>
      ))}
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <li className="rounded-2xl border p-5 text-center">
      <div className="text-2xl font-semibold">{value}</div>
      <div className="mt-1 text-xs text-muted-foreground">{label}</div>
    </li>
  );
}

function TimelineItem({
  year,
  title,
  children,
}: {
  year: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <li className="rounded-2xl border p-4">
      <div className="flex items-baseline gap-3">
        <div className="text-sm font-mono text-muted-foreground">{year}</div>
        <div className="text-sm font-semibold">{title}</div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </li>
  );
}

function ValueCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border p-5">
      <div className="text-base font-semibold">{title}</div>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="rounded-2xl border p-4">
      <summary className="cursor-pointer text-sm font-semibold">{q}</summary>
      <div className="mt-2 text-sm text-muted-foreground">{children}</div>
    </details>
  );
}

function SocialLink({
  label,
  href,
  icon,
}: {
  label: string;
  href?: string;
  icon: React.ReactNode;
}) {
  if (!href) return null;
  const isSelf = href.startsWith("mailto:") || href.startsWith("tel:");
  return (
    <a
      href={href}
      target={isSelf ? "_self" : "_blank"}
      rel="noreferrer"
      className="flex items-center justify-between rounded-2xl border px-4 py-2 text-sm hover:bg-muted/50"
    >
      <span className="inline-flex items-center gap-2">
        <span className="[&>svg]:h-4 [&>svg]:w-4">{icon}</span>
        {label}
      </span>
      <span className="text-base">&gt;</span>
    </a>
  );
}

function getSocial(
  map: Record<string, string>,
  keys: string[]
): string | undefined {
  if (!map) return undefined;
  for (const k of keys) {
    const hit = map[k] || map[k.toLowerCase()];
    if (typeof hit === "string" && hit.trim()) return hit;
  }
  return undefined;
}
