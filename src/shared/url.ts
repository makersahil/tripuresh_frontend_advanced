export function getQP(search: string) {
  return new URLSearchParams(search);
}

export function setQP(
  navigate: (path: string, opts?: any) => void,
  pathname: string,
  search: string,
  updates: Record<string, string | number | boolean | null | undefined>,
  replace = true
) {
  const sp = new URLSearchParams(search);
  Object.entries(updates).forEach(([k, v]) => {
    if (v === undefined || v === null || v === '' || v === false) {
      sp.delete(k);
    } else {
      sp.set(k, String(v));
    }
  });
  const next = `${pathname}?${sp.toString()}`;
  navigate(next, { replace });
}

export function qpNum(sp: URLSearchParams, key: string, fallback: number): number {
  const raw = sp.get(key);
  if (!raw) return fallback;
  const n = Number(raw);
  return Number.isFinite(n) ? n : fallback;
}

export function qpStr(sp: URLSearchParams, key: string, fallback = ''): string {
  const v = sp.get(key);
  return v ?? fallback;
}
