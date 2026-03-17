import { STATS } from '@/lib/data/landing'

const StatbarSection = () => {
  return (
    <div
      className="relative z-10 py-10"
      style={{
        borderTop: '1px solid rgba(245,158,11,0.08)',
        borderBottom: '1px solid rgba(245,158,11,0.08)'
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {STATS.map((s, i) => (
            <div
              key={i}
              className="text-center py-2 px-4"
              style={{
                borderRight:
                  i < STATS.length - 1
                    ? '1px solid rgba(245,158,11,0.08)'
                    : 'none'
              }}
            >
              <div
                className="text-3xl font-bold mb-1"
                style={{
                  background: 'linear-gradient(135deg,#fbbf24,#d97706)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {s.num}
              </div>
              <div className="text-xs text-[#57534e]">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default StatbarSection
