'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    // TODO: wire up Supabase
    // const { error } = await supabase.auth.signInWithPassword({ email, password });
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

  const inputStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid rgba(255,255,255,0.08)'
  }
  const focusStyle: React.CSSProperties = {
    border: '1px solid rgba(245,158,11,0.5)',
    boxShadow: '0 0 0 3px rgba(245,158,11,0.08)'
  }
  const blurStyle: React.CSSProperties = {
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'none'
  }
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
          className="absolute bottom-0 right-0 w-[350px] h-[350px]"
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
            <span>Don't have an account?</span>
            <Link
              href="/signup"
              className="text-[#f59e0b] hover:text-[#fbbf24] font-semibold transition-colors"
            >
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Content ── */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-4 py-16">
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
              Welcome back
            </div>
            <h1 className="text-3xl font-bold text-[#fef3c7] tracking-tight mb-2">
              Sign in to ChessMate
            </h1>
            <p className="text-[#57534e] text-sm">
              Continue your chess journey
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
                or sign in with email
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
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200"
                  style={inputStyle}
                  onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                  onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                />
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-sm font-medium text-[#a8a29e]">
                    Password
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full px-4 py-2.5 pr-11 rounded-xl text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200"
                    style={inputStyle}
                    onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                    onBlur={(e) => Object.assign(e.target.style, blurStyle)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#44403c] hover:text-[#a8a29e] transition-colors"
                  >
                    {showPassword ? (
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
                    ) : (
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
                    )}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all duration-200 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
                style={{
                  background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                  boxShadow: loading ? 'none' : '0 0 24px rgba(245,158,11,0.3)'
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
                    Signing in...
                  </span>
                ) : (
                  'Sign in'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-[#292524] mt-6">
            By signing in, you agree to our{' '}
            <Link
              href="/terms"
              className="text-[#44403c] hover:text-[#57534e] underline"
            >
              Terms
            </Link>{' '}
            and{' '}
            <Link
              href="/privacy"
              className="text-[#44403c] hover:text-[#57534e] underline"
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>

      <style>{`@keyframes blink{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </div>
  )
}
