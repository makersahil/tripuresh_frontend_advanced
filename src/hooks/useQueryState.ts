import { useSearchParams } from 'react-router-dom'
export function useQueryState(key:string, initial="") {
  const [sp, setSp] = useSearchParams()
  const value = sp.get(key) ?? initial
  function set(val:string) { if (val) sp.set(key, val); else sp.delete(key); setSp(sp, { replace:true }) }
  return [value, set] as const
}
