import { ReactNode } from 'react'
export function Card({ children, className='' }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-2xl border border-border bg-card shadow-soft ${className}`}>{children}</div>
}
export function CardHeader({ children }: { children: ReactNode }) {
  return <div className="p-5 border-b border-border">{children}</div>
}
export function CardTitle({ children }: { children: ReactNode }) {
  return <h3 className="text-lg font-semibold">{children}</h3>
}
export function CardContent({ children, className='' }: { children: ReactNode; className?: string }) {
  return <div className={`p-5 ${className}`}>{children}</div>
}
