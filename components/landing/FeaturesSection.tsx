'use client'
import { FEATURES } from '@/lib/data/landing'

const FeaturesSection = () => {
  return (
    <section id="features" className="relative z-10 py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-widest text-[#f59e0b] mb-3">
          Features
        </p>
        <h2 className="text-3xl md:text-4xl font-bold text-[#fef3c7] tracking-tight mb-4">
          Everything a chess player needs
        </h2>
        <p className="text-[#57534e] text-base max-w-md leading-relaxed mb-12">
          From casual blitz games to serious rated matches — ChessMate has you
          covered.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6 transition-all duration-200 cursor-default"
              style={{
                background: 'rgba(22,22,24,0.7)',
                border: '1px solid rgba(255,255,255,0.06)'
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.border =
                  '1px solid rgba(245,158,11,0.3)'
                ;(e.currentTarget as HTMLDivElement).style.background =
                  'rgba(28,28,20,0.95)'
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLDivElement).style.border =
                  '1px solid rgba(255,255,255,0.06)'
                ;(e.currentTarget as HTMLDivElement).style.background =
                  'rgba(22,22,24,0.7)'
              }}
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                style={{
                  background: 'rgba(245,158,11,0.1)',
                  border: '1px solid rgba(245,158,11,0.2)'
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-[#fef3c7] mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-[#57534e] leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturesSection
