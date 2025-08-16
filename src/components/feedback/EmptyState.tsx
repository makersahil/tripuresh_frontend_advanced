export default function EmptyState({
  title = 'Nothing here yet',
  hint,
}: { title?: string; hint?: string }) {
  return (
    <div className="container py-12 text-center">
      <h3 className="text-lg font-semibold">{title}</h3>
      {hint ? <p className="text-gray-600 mt-1">{hint}</p> : null}
    </div>
  )
}
