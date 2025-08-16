type Handler = () => void
const listeners = new Set<Handler>()
export function onAuthLogout(h: Handler) { listeners.add(h); return () => listeners.delete(h) }
export function emitAuthLogout() { for (const h of [...listeners]) try { h() } catch {} }
