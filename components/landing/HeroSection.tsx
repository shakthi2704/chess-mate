import Link from 'next/link'
import { BOARD_PIECES, isLight, isHighlight } from '@/lib/data/landing'

export const HeroSection = () => {
  return (
    <section className="relative z-10 pt-24 pb-20 px-4 text-center">
      <div className="max-w-4xl mx-auto">
        {/* Badge */}
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold text-[#fbbf24] mb-8"
          style={{
            background: 'rgba(245,158,11,0.1)',
            border: '1px solid rgba(245,158,11,0.25)'
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"
            style={{ animation: 'blink 2s infinite' }}
          />
          Real-time multiplayer chess
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight mb-6 text-[#fef3c7]">
          Play chess with anyone,{' '}
          <span
            style={{
              background: 'linear-gradient(135deg,#fbbf24,#f59e0b,#d97706)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            anywhere in the world
          </span>
        </h1>

        <p className="text-lg text-[#78716c] max-w-xl mx-auto mb-10 leading-relaxed">
          Challenge friends or get matched globally. Track your ELO, replay
          every game, and climb the leaderboard.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link
            href="/signup"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-[#0c0c0e] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              boxShadow: '0 0 32px rgba(245,158,11,0.35)'
            }}
          >
            Start playing free
          </Link>
          <a
            href="#leaderboard"
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-[#d6d3d1] transition-all duration-200 hover:bg-white/[0.05]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            View leaderboard →
          </a>
        </div>

        {/* Mini board */}
        <div className="flex justify-center">
          <div
            className="rounded-2xl p-5 inline-block"
            style={{
              background: 'rgba(22,22,24,0.9)',
              border: '1px solid rgba(245,158,11,0.2)',
              boxShadow: '0 0 60px rgba(245,158,11,0.1)'
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(8,48px)',
                gridTemplateRows: 'repeat(8,48px)',
                borderRadius: 8,
                overflow: 'hidden',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
            >
              {BOARD_PIECES.map((row, r) =>
                row.map((piece, c) => (
                  <div
                    key={`${r}-${c}`}
                    className="flex items-center justify-center text-2xl select-none"
                    style={{
                      background: isHighlight(r, c)
                        ? 'rgba(250,178,22,0.55)'
                        : isLight(r, c)
                          ? '#3d2f00'
                          : '#1a1400',
                      width: 48,
                      height: 48
                    }}
                  >
                    {piece}
                  </div>
                ))
              )}
            </div>
            {/* Board footer */}
            <div className="flex items-center justify-between mt-3 px-1">
              <div className="flex items-center gap-2 text-xs text-[#57534e]">
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#1c1000', color: '#fbbf24' }}
                >
                  GK
                </div>
                <span className="font-medium text-[#a8a29e]">GrandKnight</span>
                <span>1,482</span>
              </div>
              <div
                className="text-[11px] font-semibold text-[#fbbf24] px-2.5 py-1 rounded-full"
                style={{
                  background: 'rgba(245,158,11,0.12)',
                  border: '1px solid rgba(245,158,11,0.3)'
                }}
              >
                Your turn
              </div>
              <div className="flex items-center gap-2 text-xs text-[#57534e]">
                <span>1,247</span>
                <span className="font-medium text-[#a8a29e]">You</span>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{ background: '#1a1400', color: '#d97706' }}
                >
                  YO
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
