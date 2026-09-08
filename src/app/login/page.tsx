"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="flex items-center justify-center py-20 font-sans">
      <div className="bg-slate-900/60 backdrop-blur-xl p-8 sm:p-10 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.3)] w-full max-w-md border border-purple-900/40 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-rose-500 to-purple-600"></div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-rose-500/10 blur-[50px] pointer-events-none rounded-full"></div>
        <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-200 mb-6 text-center tracking-tight">Welcome Back</h1>
        {error && <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-4 rounded-xl mb-6 text-sm font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
          <div>
            <label className="block text-purple-300/80 mb-2 text-sm uppercase tracking-wide font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-purple-900/50 text-slate-100 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all shadow-inner"
              placeholder="Enter your email"
            />
          </div>
          <div>
            <label className="block text-purple-300/80 mb-2 text-sm uppercase tracking-wide font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-4 rounded-xl bg-slate-950/50 border border-purple-900/50 text-slate-100 focus:outline-none focus:border-rose-500/50 focus:ring-1 focus:ring-rose-500/50 transition-all shadow-inner"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-bold py-4 px-4 rounded-full transition-all shadow-[0_0_15px_rgba(244,63,94,0.3)] hover:shadow-[0_0_25px_rgba(168,85,247,0.5)] disabled:opacity-50 mt-4 border border-rose-500/20"
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>
        
        <p className="mt-8 text-center text-purple-300/60 font-medium relative z-10">
          Don't have an account?{" "}
          <Link href="/register" className="text-rose-400 hover:text-rose-300 transition-colors hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
