export default function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="container py-8 grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}
