export const API_BASE =
  import.meta.env.VITE_API_BASE_URL ??
  (typeof window !== 'undefined' ? `${window.location.origin}/api/v1` : '/api/v1');
