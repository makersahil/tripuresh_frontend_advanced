import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getListOk } from "@/config/api";
import type { Article, Publication, ResearchGrant, Patent, Certification } from "@/lib/types";
import { Button } from "@/components/ui/button";

type CountState = {
  articles?: number;
  publications?: number;
  grants?: number;
  patents?: number;
  certifications?: number;
};

type RecentState = {
  articles: Article[];
  publications: Publication[];
  grants: ResearchGrant[];
  patents: Patent[];
  certifications: Certification[];
};

export default function DashboardPage() {
  const [counts, setCounts] = useState<CountState>({});
  const [recent, setRecent] = useState<RecentState>({
    articles: [],
    publications: [],
    grants: [],
    patents: [],
    certifications: [],
  });

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setLoading(true);
        setErr(null);

        // fetch meta totals (pageSize=1 to minimize payload)
        const [
          a1, p1, g1, pa1, c1, // counts
          a5, p5, g5, pa5, c5  // recent lists (pageSize=5)
        ] = await Promise.all([
          getListOk<Article>("/articles", { page: 1, pageSize: 1 }),
          getListOk<Publication>("/publications", { page: 1, pageSize: 1 }),
          getListOk<ResearchGrant>("/grants", { page: 1, pageSize: 1 }),
          getListOk<Patent>("/patents", { page: 1, pageSize: 1 }),
          getListOk<Certification>("/certifications", { page: 1, pageSize: 1 }),

          getListOk<Article>("/articles", { page: 1, pageSize: 5 }),
          getListOk<Publication>("/publications", { page: 1, pageSize: 5 }),
          getListOk<ResearchGrant>("/grants", { page: 1, pageSize: 5 }),
          getListOk<Patent>("/patents", { page: 1, pageSize: 5 }),
          getListOk<Certification>("/certifications", { page: 1, pageSize: 5 }),
        ]);

        if (!active) return;

        setCounts({
          articles: a1.meta?.total ?? a1.items.length,
          publications: p1.meta?.total ?? p1.items.length,
          grants: g1.meta?.total ?? g1.items.length,
          patents: pa1.meta?.total ?? pa1.items.length,
          certifications: c1.meta?.total ?? c1.items.length,
        });

        setRecent({
          articles: a5.items ?? [],
          publications: p5.items ?? [],
          grants: g5.items ?? [],
          patents: pa5.items ?? [],
          certifications: c5.items ?? [],
        });
      } catch (e: any) {
        if (!active) return;
        setErr(e?.response?.data?.message || e?.message || "Failed to load dashboard data");
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  const tiles = useMemo(() => ([
    { label: "Articles", count: counts.articles ?? 0, to: "/admin/articles", action: { label: "New Article", to: "/admin/articles/new" } },
    { label: "Publications", count: counts.publications ?? 0, to: "/admin/publications" },
    { label: "Grants", count: counts.grants ?? 0, to: "/admin/grants" },
    { label: "Patents", count: counts.patents ?? 0, to: "/admin/patents" },
    { label: "Certifications", count: counts.certifications ?? 0, to: "/admin/certifications" },
  ]), [counts]);

  return (
    <section className="container py-8">
      <header className="mb-6">
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
        <p className="text-sm text-muted-foreground">Quick stats and recent activity.</p>
      </header>

      {/* Error */}
      {err && (
        <div className="mb-4 rounded-2xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">
          {err}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading…</div>
      ) : (
        <>
          {/* Stat tiles */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {tiles.map((t) => (
              <div key={t.label} className="rounded-2xl border p-4 flex flex-col gap-2">
                <div className="text-xs text-muted-foreground">{t.label}</div>
                <div className="text-2xl font-bold">{t.count}</div>
                <div className="flex gap-2 mt-auto">
                  <Link to={t.to} className="text-sm underline underline-offset-4">Manage</Link>
                  {"action" in t && t.action ? (
                    <Link to={t.action.to} className="text-sm underline underline-offset-4"> {t.action.label} </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </div>

          {/* Recent lists */}
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <RecentCard
              title="Recent Articles"
              items={recent.articles.map(a => ({ id: a.id, title: a.title, meta: a.year ? String(a.year) : "", to: "/admin/articles" }))}
              toList="/admin/articles"
            />
            <RecentCard
              title="Recent Publications"
              items={recent.publications.map(p => ({ id: p.id, title: p.title, meta: p.year ? String(p.year) : "", to: "/admin/publications" }))}
              toList="/admin/publications"
            />
            <RecentCard
              title="Recent Grants"
              items={recent.grants.map(g => ({ id: g.id, title: g.title, meta: g.year ? String(g.year) : "", to: "/admin/grants" }))}
              toList="/admin/grants"
            />
            <RecentCard
              title="Recent Patents"
              items={recent.patents.map(p => ({ id: p.id, title: p.title, meta: p.year ? String(p.year) : "", to: "/admin/patents" }))}
              toList="/admin/patents"
            />
            <RecentCard
              title="Recent Certifications"
              items={recent.certifications.map(c => ({ id: c.id, title: c.title, meta: c.year ? String(c.year) : "", to: "/admin/certifications" }))}
              toList="/admin/certifications"
            />
          </div>
        </>
      )}
    </section>
  );
}

function RecentCard(props: {
  title: string;
  items: { id?: string; title: string; meta?: string; to: string }[];
  toList: string;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">{props.title}</h2>
        <Link to={props.toList} className="text-xs underline underline-offset-4">View all</Link>
      </div>
      {props.items.length === 0 ? (
        <div className="text-xs text-muted-foreground">No items.</div>
      ) : (
        <ul className="grid gap-2">
          {props.items.map((it, i) => (
            <li key={it.id || i} className="flex items-center justify-between rounded-xl border p-2">
              <div className="min-w-0">
                <div className="truncate text-sm">{it.title}</div>
                {it.meta && <div className="text-xs text-muted-foreground">{it.meta}</div>}
              </div>
              <Link to={it.to} className="text-xs underline underline-offset-4">Open</Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
