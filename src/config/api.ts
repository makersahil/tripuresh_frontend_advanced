import axios from 'axios'
import { API_BASE } from './env'


import { emitAuthLogout } from '@/lib/authBus'

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


http.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status
    if (status === 401 && typeof window !== 'undefined') {
      const path = window.location.pathname + window.location.search
      const atLogin = window.location.pathname.startsWith('/admin/login')
      if (!atLogin) {
        const params = new URLSearchParams(window.location.search)
        // if next is already present, keep it; else set it
        const next = params.get('next') || encodeURIComponent(path)
        window.location.href = `/admin/login?next=${next}`
      }
    }
    return Promise.reject(err)
  }
)

