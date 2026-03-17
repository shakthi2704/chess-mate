'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirm: ''
  })
  const [showPassword, setShowPw] = useState(false)
  const [showConfirm, setShowCf] = useState(false)
  const [loading, setLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')

  /* ── Password strength ── */
  const strength = (pw: string) => {
    if (!pw) return { score: 0, label: '', color: '' }
    let s = 0
    if (pw.length >= 8) s++
    if (/[A-Z]/.test(pw)) s++
    if (/[0-9]/.test(pw)) s++
    if (/[^A-Za-z0-9]/.test(pw)) s++
    const map: Record<number, { label: string; color: string }> = {
      1: { label: 'Weak', color: '#ef4444' },
      2: { label: 'Fair', color: '#f97316' },
      3: { label: 'Good', color: '#eab308' },
      4: { label: 'Strong', color: '#22c55e' }
    }
    return { score: s, ...(map[s] ?? { label: '', color: '' }) }
  }

  const pw = strength(form.password)
  const match = form.confirm.length > 0 && form.password === form.confirm
  const mismatch = form.confirm.length > 0 && form.password !== form.confirm

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!agreed || mismatch) return
    setError('')
    setLoading(true)
    // TODO: wire up Supabase
    // const { error } = await supabase.auth.signUp({
    //   email: form.email,
    //   password: form.password,
    //   options: { data: { username: form.username } },
    // });
    // if (error) { setError(error.message); setLoading(false); return; }
    // router.push("/dashboard");
    setTimeout(() => setLoading(false), 1500)
  }

  const handleGoogle = () => {
    // TODO: wire up Supabase OAuth
    // supabase.auth.signInWithOAuth({
    //   provider: "google",
    //   options: { redirectTo: `${location.origin}/dashboard` }
    // });
    console.log('Google OAuth')
  }

  /* ── Shared styles ── */
  const inputBase =
    'w-full px-4 py-2.5 rounded-xl text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200'
  const iS: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  }
  const iF: React.CSSProperties = {
    border: '1px solid rgba(245,158,11,0.5)',
    boxShadow: '0 0 0 3px rgba(245,158,11,0.08)'
  }
  const iB: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'none'
  }

  const EyeOpen = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
      />
    </svg>
  )
  const EyeOff = () => (
    <svg
      className="w-4 h-4"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
      />
    </svg>
  )
  return (
    <div className="min-h-screen bg-[#0c0c0e] flex flex-col">
      {/* ── Background glows ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[500px]"
          style={{
            background:
              'radial-gradient(ellipse at center,rgba(245,158,11,0.10) 0%,transparent 70%)'
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[350px] h-[350px]"
          style={{
            background:
              'radial-gradient(ellipse at center,rgba(217,119,6,0.07) 0%,transparent 70%)'
          }}
        />
      </div>

      {/* ── Navbar ── */}
      <nav
        className="relative z-10 px-6 py-4"
        style={{ borderBottom: '1px solid rgba(245,158,11,0.1)' }}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
              style={{
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                color: '#0c0c0e'
              }}
            >
              ♟
            </div>
            <span className="text-[#fef3c7] font-bold text-lg tracking-tight">
              ChessMate
            </span>
          </Link>
          <div className="flex items-center gap-2 text-sm text-[#57534e]">
            <span>Already have an account?</span>
            <Link
              href="/login"
              className="text-[#f59e0b] hover:text-[#fbbf24] font-semibold transition-colors"
            >
              Sign in
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#fbbf24] mb-6"
              style={{
                background: 'rgba(245,158,11,0.1)',
                border: '1px solid rgba(245,158,11,0.25)'
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
                style={{ animation: 'blink 2s infinite' }}
              />
              Free forever
            </div>
            <h1 className="text-3xl font-bold text-[#fef3c7] tracking-tight mb-2">
              Create your account
            </h1>
            <p className="text-[#57534e] text-sm">
              Start your chess journey today
            </p>
          </div>

          {/* Card */}
          <div
            className="rounded-2xl p-8"
            style={{
              background: 'rgba(18,16,12,0.85)',
              border: '1px solid rgba(245,158,11,0.15)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 0 60px rgba(245,158,11,0.07)'
            }}
          >
            {/* Google button — full width */}
            <button
              onClick={handleGoogle}
              className="w-full flex items-center justify-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-[#fef3c7] transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.98] mb-6"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 mb-6">
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
              <span className="text-xs text-[#44403c]">
                or register with email
              </span>
              <div
                className="flex-1 h-px"
                style={{ background: 'rgba(255,255,255,0.06)' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div
                className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
                style={{
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)'
                }}
              >
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="GrandKnight99"
                  required
                  minLength={3}
                  maxLength={20}
                  className={inputBase}
                  style={iS}
                  onFocus={(e) => Object.assign(e.target.style, iF)}
                  onBlur={(e) => Object.assign(e.target.style, iB)}
                />
                <p className="text-xs text-[#292524] mt-1">
                  3–20 characters · Your public display name
                </p>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                  className={inputBase}
                  style={iS}
                  onFocus={(e) => Object.assign(e.target.style, iF)}
                  onBlur={(e) => Object.assign(e.target.style, iB)}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className={`${inputBase} pr-11`}
                    style={iS}
                    onFocus={(e) => Object.assign(e.target.style, iF)}
                    onBlur={(e) => Object.assign(e.target.style, iB)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#44403c] hover:text-[#a8a29e] transition-colors"
                  >
                    {showPassword ? <EyeOff /> : <EyeOpen />}
                  </button>
                </div>
                {/* Strength meter */}
                {form.password.length > 0 && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            background:
                              i <= pw.score
                                ? pw.color
                                : 'rgba(255,255,255,0.07)'
                          }}
                        />
                      ))}
                    </div>
                    <p
                      className="text-xs font-semibold"
                      style={{ color: pw.color }}
                    >
                      {pw.label} password
                    </p>
                  </div>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                  Confirm password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    name="confirm"
                    value={form.confirm}
                    onChange={handleChange}
                    placeholder="••••••••"
                    required
                    className={`${inputBase} pr-11`}
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: mismatch
                        ? '1px solid rgba(239,68,68,0.5)'
                        : match
                          ? '1px solid rgba(34,197,94,0.5)'
                          : '1px solid rgba(255,255,255,0.08)'
                    }}
                    onFocus={(e) => Object.assign(e.target.style, iF)}
                    onBlur={(e) =>
                      Object.assign(e.target.style, {
                        border: mismatch
                          ? '1px solid rgba(239,68,68,0.5)'
                          : match
                            ? '1px solid rgba(34,197,94,0.5)'
                            : '1px solid rgba(255,255,255,0.08)',
                        boxShadow: 'none'
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowCf(!showConfirm)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#44403c] hover:text-[#a8a29e] transition-colors"
                  >
                    {showConfirm ? <EyeOff /> : <EyeOpen />}
                  </button>
                  {form.confirm.length > 0 && (
                    <div className="absolute right-10 top-1/2 -translate-y-1/2">
                      {match ? (
                        <svg
                          className="w-4 h-4 text-green-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={2}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                {mismatch && (
                  <p className="text-xs text-red-400 mt-1">
                    Passwords do not match
                  </p>
                )}
              </div>

              {/* Terms checkbox */}
              <div className="flex items-start gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => setAgreed(!agreed)}
                  className="mt-0.5 w-4 h-4 rounded flex-shrink-0 flex items-center justify-center transition-all duration-200"
                  style={{
                    background: agreed
                      ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                      : 'rgba(255,255,255,0.03)',
                    border: agreed ? 'none' : '1px solid rgba(255,255,255,0.12)'
                  }}
                >
                  {agreed && (
                    <svg
                      className="w-2.5 h-2.5 text-[#0c0c0e]"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  )}
                </button>
                <span className="text-xs text-[#44403c] leading-relaxed">
                  I agree to the{' '}
                  <Link
                    href="/terms"
                    className="text-[#f59e0b] hover:text-[#fbbf24] underline"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="/privacy"
                    className="text-[#f59e0b] hover:text-[#fbbf24] underline"
                  >
                    Privacy Policy
                  </Link>
                </span>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  loading || !agreed || mismatch || form.password.length < 8
                }
                className="w-full py-3 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                style={{
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  boxShadow:
                    loading || !agreed || mismatch
                      ? 'none'
                      : '0 0 24px rgba(245,158,11,0.3)'
                }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Creating account...
                  </span>
                ) : (
                  'Create account'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-[#292524] mt-6">
            No credit card required · Free forever
          </p>
        </div>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}
