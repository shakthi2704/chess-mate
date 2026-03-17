import Link from 'next/link'

Link

const Ctasection = () => {
  return (
    <section className="relative z-10 py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div
          className="rounded-3xl px-8 py-20 text-center relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg,rgba(28,20,0,0.95) 0%,rgba(18,16,12,0.98) 100%)',
            border: '1px solid rgba(245,158,11,0.25)',
            boxShadow: '0 0 80px rgba(245,158,11,0.1)'
          }}
        >
          <div
            className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse,rgba(245,158,11,0.15) 0%,transparent 70%)'
            }}
          />
          <h2 className="relative text-3xl md:text-4xl font-bold text-[#fef3c7] tracking-tight mb-4">
            Ready to make your move?
          </h2>
          <p className="relative text-[#57534e] text-base mb-10 max-w-sm mx-auto">
            Join thousands of players already competing on ChessMate. Free
            forever.
          </p>
          <div className="relative flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Link
              href="/signup"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-bold text-[#0c0c0e] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                boxShadow: '0 0 28px rgba(245,158,11,0.35)'
              }}
            >
              Create free account
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-base font-medium text-[#d6d3d1] transition-all duration-200 hover:bg-white/[0.05]"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
            >
              Log in →
            </Link>
          </div>
          <p className="relative text-xs text-[#292524] mb-4">
            No credit card required · Free forever
          </p>
          <div className="relative flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {[
              'Real-time multiplayer',
              'ELO rating',
              'Game history',
              'Leaderboard',
              'Play vs AI'
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-1.5 text-xs text-[#44403c]"
              >
                <span className="text-[#f59e0b]">✓</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Ctasection
