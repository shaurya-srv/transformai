"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { playGlassChime } from "@/lib/sounds";
import { Zap, ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react";

function getPasswordStrength(password: string): { score: number; label: string; color: string } {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { score: 1, label: "Weak", color: "#ef4444" };
  if (score <= 2) return { score: 2, label: "Fair", color: "#f59e0b" };
  if (score <= 3) return { score: 3, label: "Good", color: "#06b6d4" };
  return { score: 4, label: "Strong", color: "#10b981" };
}

export default function SignupPage() {
  const router = useRouter();
  const { signup, loginWithGoogle } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "", organization: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const strength = getPasswordStrength(form.password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    if (!form.name || !form.email || !form.password) { setError("Please fill in all required fields."); return; }
    if (form.password !== form.confirmPassword) { setError("Passwords do not match."); return; }
    if (form.password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (!agreed) { setError("Please agree to the Terms of Service."); return; }
    setIsLoading(true);
    const result = await signup({ name: form.name, email: form.email, password: form.password, organization: form.organization });
    setIsLoading(false);
    if (result.success) { setSuccess("Account created! Check your email for a confirmation link."); playGlassChime(); setTimeout(() => router.push("/login"), 2000); }
    else { setError(result.error || "Signup failed."); }
  };

  const handleGoogleSignup = async () => {
    setError(""); setIsLoading(true);
    const result = await loginWithGoogle();
    if (!result.success) { setIsLoading(false); setError(result.error || "Google sign-in failed."); }
  };

  const updateForm = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }));
  const inputClass = "w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all";

  return (
    <div className="min-h-screen bg-[#0a0a0f] grid-bg noise flex items-center justify-center px-4 py-12">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-1/4 right-1/3 w-[400px] h-[400px] bg-cyan-600/8 rounded-full blur-[130px]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/25">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">TransformAI</span>
          </Link>
          <h1 className="text-2xl font-bold text-white mb-2">Create your account</h1>
          <p className="text-sm text-gray-400">Start transforming information into communication.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-sm text-red-400 animate-fade-in">{error}</div>}
          {success && <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-sm text-emerald-400 animate-fade-in">{success}</div>}

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Full Name *</label>
            <input type="text" value={form.name} onChange={(e) => updateForm("name", e.target.value)} placeholder="John Doe" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
            <input type="email" value={form.email} onChange={(e) => updateForm("email", e.target.value)} placeholder="you@company.com" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Organization / Team</label>
            <input type="text" value={form.organization} onChange={(e) => updateForm("organization", e.target.value)} placeholder="Acme Corp" className={inputClass} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Password *</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} value={form.password} onChange={(e) => updateForm("password", e.target.value)} placeholder="••••••••" className={inputClass + " pr-11"} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {form.password && (
              <div className="mt-2">
                <div className="flex gap-1.5 mb-1">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-1 flex-1 rounded-full transition-colors" style={{ background: i <= strength.score ? strength.color : "rgba(255,255,255,0.08)" }} />
                  ))}
                </div>
                <span className="text-[10px] font-medium" style={{ color: strength.color }}>{strength.label}</span>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1.5">Confirm Password *</label>
            <input type="password" value={form.confirmPassword} onChange={(e) => updateForm("confirmPassword", e.target.value)} placeholder="••••••••" className={inputClass} />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/5 text-violet-500 focus:ring-violet-500/25" />
            <span className="text-xs text-gray-400 leading-relaxed">
              I agree to the <span className="text-violet-400 hover:text-violet-300 font-medium">Terms of Service</span> and <span className="text-violet-400 hover:text-violet-300 font-medium">Privacy Policy</span>
            </span>
          </label>

          <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 disabled:opacity-50 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 shadow-lg shadow-violet-500/25">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Create Account <ArrowRight className="w-4 h-4" /></>}
          </button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-gray-500">or</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        <button onClick={handleGoogleSignup} disabled={isLoading} className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-3 backdrop-blur-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-sm text-gray-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
