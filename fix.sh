#!/usr/bin/env bash
set -euo pipefail

# --- ensure alias works in Vite + TS ---
if [ -f vite.config.ts ]; then
  cat > vite.config.ts <<'TS'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
TS
fi

if [ -f tsconfig.json ]; then
  node - <<'JS'
const fs = require('fs');
const p = 'tsconfig.json';
const j = JSON.parse(fs.readFileSync(p,'utf8'));
j.compilerOptions = j.compilerOptions || {};
j.compilerOptions.baseUrl = j.compilerOptions.baseUrl || '.';
j.compilerOptions.paths = j.compilerOptions.paths || {};
j.compilerOptions.paths['@/*'] = ['src/*'];
fs.writeFileSync(p, JSON.stringify(j, null, 2));
console.log('Updated tsconfig.json with @ alias');
JS
fi

# --- folders ---
mkdir -p src/components/feedback
mkdir -p src/components/ui
mkdir -p src/config
mkdir -p src/hooks

# --- env helper (reads Vite env) ---
cat > src/config/env.ts <<'TS'
export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1');
TS

# --- axios helpers (no inline "as" casts in object literal) ---
cat > src/config/api.ts <<'TS'
import axios from 'axios'
import { API_BASE } from './env'

export type Envelope<T> = { success: boolean; data: T; meta?: any; message?: string }
export type EnvelopeOk<T> = { success: true; data: T; meta?: any }

export const http = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
})

http.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('admin_token')
  if (token && cfg.url?.startsWith('/')) {
    cfg.headers = cfg.headers ?? {}
    ;(cfg.headers as any).Authorization = `Bearer ${token}`
  }
  return cfg
})

export async function getOk<T>(url: string, params?: any): Promise<EnvelopeOk<T>> {
  const res = await http.get<Envelope<T>>(url, { params })
  if (res.data?.success) return res.data as EnvelopeOk<T>
  throw new Error((res.data as any)?.message || 'Request failed')
}

/** Returns items + pagination meta */
export async function getListOk<T>(
  url: string,
  params?: any
): Promise<{ items: T[]; meta: { page: number; pageSize: number; total: number; pages: number } }> {
  const res = await http.get<Envelope<T[]>>(url, { params })
  if ((res.data as any)?.success) {
    const items = ((res.data as any).data ?? []) as T[]
    const meta = (res.data as any).meta ?? {
      page: 1,
      pageSize: items.length,
      total: items.length,
      pages: 1,
    }
    return { items, meta }
  }
  throw new Error((res.data as any)?.message || 'Request failed')
}
TS

# --- feedback components used by your pages ---
cat > src/components/feedback/Loader.tsx <<'TSX'
export default function Loader() {
  return (
    <div className="container py-12 text-center text-sm text-gray-600">
      Loading…
    </div>
  )
}
TSX

cat > src/components/feedback/ErrorBlock.tsx <<'TSX'
export default function ErrorBlock({ message }: { message: string }) {
  return (
    <div role="alert" className="container py-8">
      <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-red-800">
        {message || 'Something went wrong.'}
      </div>
    </div>
  )
}
TSX

cat > src/components/feedback/EmptyState.tsx <<'TSX'
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
TSX

cat > src/components/feedback/SkeletonList.tsx <<'TSX'
export default function SkeletonList({ rows = 6 }: { rows?: number }) {
  return (
    <div className="container py-8 grid gap-4">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
      ))}
    </div>
  )
}
TSX

# --- tiny UI stubs in case your project doesn't have shadcn/ui ---
cat > src/components/ui/input.tsx <<'TSX'
import * as React from 'react'
export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className = '', ...props }, ref) => (
    <input ref={ref} className={`h-10 w-full rounded-xl border border-border px-3 ${className}`} {...props} />
  )
)
Input.displayName = 'Input'
export default Input
TSX

cat > src/components/ui/card.tsx <<'TSX'
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
TSX

# --- simple pagination hook used by list pages ---
cat > src/hooks/usePagination.ts <<'TS'
import { useSearchParams } from 'react-router-dom'

export function usePagination(defaultPageSize = 10) {
  const [sp, setSp] = useSearchParams()
  const page = Math.max(parseInt(sp.get('page') || '1', 10) || 1, 1)
  const pageSize = Math.max(parseInt(sp.get('pageSize') || String(defaultPageSize), 10) || defaultPageSize, 1)
  function set(nextPage: number) {
    sp.set('page', String(nextPage))
    sp.set('pageSize', String(pageSize))
    setSp(sp, { replace: true })
  }
  function setSize(nextSize: number) {
    sp.set('page', '1')
    sp.set('pageSize', String(nextSize))
    setSp(sp, { replace: true })
  }
  return { page, pageSize, set, setSize }
}
TS

echo "✅ Patch applied. Now restart dev server."
