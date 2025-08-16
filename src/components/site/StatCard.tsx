export default function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card shadow-soft p-6 text-center">
      <div className="text-3xl font-extrabold">{value}</div>
      <div className="mt-1 text-gray-600">{label}</div>
    </div>
  )
}