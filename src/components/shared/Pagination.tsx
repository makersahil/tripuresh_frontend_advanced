export default function Pagination({
  page,
  pages,
  onChange,
}: {
  page: number
  pages: number
  onChange: (next: number) => void
}) {
  if (pages <= 1) return null
  const prev = () => onChange(Math.max(1, page - 1))
  const next = () => onChange(Math.min(pages, page + 1))
  return (
    <div className="flex items-center justify-center gap-2 mt-6">
      <button onClick={prev} disabled={page === 1} className="px-3 py-1 text-sm rounded-xl border border-border disabled:opacity-50">
        Prev
      </button>
      <span className="text-sm px-2">Page {page} of {pages}</span>
      <button onClick={next} disabled={page === pages} className="px-3 py-1 text-sm rounded-xl border border-border disabled:opacity-50">
        Next
      </button>
    </div>
  )
}
