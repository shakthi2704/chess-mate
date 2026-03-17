'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav
      className="sticky top-0 z-50 px-6 py-4 transition-all duration-300"
      style={{
        background: scrolled ? 'rgba(12,12,14,0.94)' : 'rgba(12,12,14,0.65)',
        backdropFilter: 'blur(14px)',
        borderBottom: '1px solid rgba(245,158,11,0.1)'
      }}
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 z-10">
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

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {['#features', '#how-it-works', '#leaderboard'].map((href, i) => (
            <a
              key={i}
              href={href}
              className="text-sm text-[#78716c] hover:text-[#fef3c7] transition-colors duration-200"
            >
              {['Features', 'How it works', 'Leaderboard'][i]}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-lg text-sm font-medium text-[#d6d3d1] transition-all duration-200 hover:bg-white/[0.05]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            Log in
          </Link>
          <Link
            href="/signup"
            className="px-4 py-2 rounded-lg text-sm font-bold text-[#0c0c0e] transition-all duration-200 hover:opacity-90 text-white"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              boxShadow: '0 0 20px rgba(245,158,11,0.3)'
            }}
          >
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden mt-4 pb-4 flex flex-col gap-4 border-t pt-4"
          style={{ borderColor: 'rgba(245,158,11,0.1)' }}
        >
          {['#features', '#how-it-works', '#leaderboard'].map((href, i) => (
            <a
              key={i}
              href={href}
              className="text-sm text-[#78716c] hover:text-[#fef3c7]"
              onClick={() => setMenuOpen(false)}
            >
              {['Features', 'How it works', 'Leaderboard'][i]}
            </a>
          ))}
          <div className="flex gap-3 pt-2">
            <Link
              href="/login"
              className="flex-1 text-center px-4 py-2 rounded-lg text-sm text-[#d6d3d1]"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Log in
            </Link>
            <Link
              href="/signup"
              className="flex-1 text-center px-4 py-2 rounded-lg text-sm font-bold text-[#0c0c0e]"
              style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
            >
              Get started
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
