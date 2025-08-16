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
