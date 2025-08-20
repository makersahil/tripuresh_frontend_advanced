import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getOk } from "@/config/api";
import type { Article } from "@/lib/types";
import Loader from "@/components/feedback/Loader";
import ErrorBlock from "@/components/feedback/ErrorBlock";

export default function ArticleDetail() {
  const { slug } = useParams();
  const [data, setData] = useState<Article | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(true);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        setBusy(true);
        const res = await getOk<Article>(`/articles/${slug}`);
        if (active) setData(res.data);
      } catch (e: any) {
        if (active) setErr(e?.message || "Failed to load article");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, [slug]);

  if (busy) return <Loader />;
  if (err) return <ErrorBlock message={err} />; 
  if (!data) return null;

  const { title, abstract, journal, year, doi, link, tags = [], authors = [] as any[] } = data as any;

  return (
    <section className="container py-10 max-w-3xl">
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-sm text-muted-foreground mt-1">{journal} • {year}</p>

      {abstract && (
        <p className="mt-6 leading-7 text-foreground/90">{abstract}</p>
      )}

      {(doi || link) && (
        <div className="mt-4 flex gap-3 text-sm">
          {doi && <a href={doi.startsWith("http") ? doi : `https://doi.org/${doi}`} target="_blank" rel="noreferrer" className="underline">DOI</a>}
          {link && <a href={link} target="_blank" rel="noreferrer" className="underline">Full text</a>}
        </div>
      )}

      {tags.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {tags.map((t: string) => (
            <span key={t} className="px-2 py-0.5 rounded-full border text-xs">{t}</span>
          ))}
        </div>
      )}

      {Array.isArray(authors) && authors.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold mb-2">Authors</h3>
          <ul className="list-disc list-inside text-sm">
            {authors
              .sort((a: any, b: any) => (a.position ?? 0) - (b.position ?? 0))
              .map((a: any) => (
                <li key={a.author?.id || `${a.firstName}-${a.lastName}`}>
                  {a.author
                    ? `${a.author.firstName} ${a.author.lastName}`
                    : `${a.firstName} ${a.lastName}`}
                </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
