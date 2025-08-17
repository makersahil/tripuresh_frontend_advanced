import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";

export default function RequireAuth({ children }: { children: JSX.Element }) {
  const { token, loading } = useAuth();
  const loc = useLocation();

  // While booting *and* we have a token, show a quick spinner once.
  if (loading && token) {
    return <div className="container py-12 text-center">Checking session…</div>;
  }

  // Only redirect if there is no token at all
  if (!token) {
    return (
      <Navigate
        to="/admin/login"
        replace
        state={{ from: { pathname: loc.pathname, search: loc.search } }}
      />
    );
  }
  return children;
}
