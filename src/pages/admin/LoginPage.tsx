import { FormEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/features/auth/useAuth";
import Input from "@/components/ui/input";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("admin@tripuresh.in");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const from = (location.state as any)?.from?.pathname || "/admin"; // default dashboard

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      setBusy(true); setError(null);
      await login(email, password);               // ✅ calls API & stores token
      navigate(from, { replace: true });      // ✅ go to dashboard
    } catch (err: any) {
      setError(err?.message || "Login failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="container py-12 max-w-md">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      <form className="grid gap-3" onSubmit={onSubmit}>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Email</span>
          <Input type="email" required value={email} onChange={e => setEmail(e.target.value)} />
        </label>
        <label className="grid gap-1">
          <span className="text-sm font-medium">Password</span>
          <Input type="password" required value={password} onChange={e => setPassword(e.target.value)} />
        </label>
        {error && <div className="rounded-xl border border-red-300 bg-red-50 p-3 text-sm text-red-800">{error}</div>}
        <button disabled={busy} className="inline-flex items-center justify-center rounded-2xl px-4 py-2 text-sm font-medium bg-primary text-white disabled:opacity-50">
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </section>
  );
}
