'use client'
import Link from 'next/link'
import { LEADERBOARD } from '@/lib/data/landing'
const LeaderboardSection = () => {
  return (
    <section id="leaderboard" className="relative z-10 py-24 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3">
            Leaderboard
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-[#fef3c7] tracking-tight">
            Top players this month
          </h2>
        </div>

        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(18,16,12,0.9)',
            border: '1px solid rgba(245,158,11,0.15)',
            boxShadow: '0 0 40px rgba(245,158,11,0.07)'
          }}
        >
          <div
            className="grid px-6 py-3 text-xs font-semibold uppercase tracking-wider text-[#44403c]"
            style={{
              gridTemplateColumns: '52px 1fr 90px 90px',
              borderBottom: '1px solid rgba(245,158,11,0.08)'
            }}
          >
            <div>#</div>
            <div>Player</div>
            <div className="text-right">ELO</div>
            <div className="text-right">Win rate</div>
          </div>
          {LEADERBOARD.map((p, i) => (
            <div
              key={i}
              className="grid px-6 py-4 items-center transition-colors duration-150"
              style={{
                gridTemplateColumns: '52px 1fr 90px 90px',
                borderBottom:
                  i < LEADERBOARD.length - 1
                    ? '1px solid rgba(245,158,11,0.05)'
                    : 'none'
              }}
              onMouseEnter={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  'rgba(245,158,11,0.04)')
              }
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLDivElement).style.background =
                  'transparent')
              }
            >
              <div className="text-sm font-bold">
                {p.rank === 1 ? (
                  '🥇'
                ) : p.rank === 2 ? (
                  '🥈'
                ) : p.rank === 3 ? (
                  '🥉'
                ) : (
                  <span style={{ color: '#44403c' }}>{p.rank}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: p.bg, color: p.color }}
                >
                  {p.initials}
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#fef3c7]">
                    {p.name}
                  </div>
                  <div className="text-xs text-[#44403c]">{p.country}</div>
                </div>
              </div>
              <div className="text-sm font-bold text-[#fef3c7] text-right">
                {p.elo.toLocaleString()}
              </div>
              <div className="text-sm font-semibold text-[#f59e0b] text-right">
                {p.wr}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-6">
          <Link
            href="/leaderboard"
            className="inline-block px-6 py-2.5 rounded-xl text-sm font-medium text-[#d6d3d1] transition-all duration-200 hover:bg-white/[0.04]"
            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
          >
            View full leaderboard →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default LeaderboardSection
