import Link from 'next/link'

const FooterSection = () => {
  return (
    <footer
      className="relative z-10 py-8 px-6"
      style={{ borderTop: '1px solid rgba(245,158,11,0.08)' }}
    >
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-md flex items-center justify-center text-sm font-bold"
            style={{
              background: 'linear-gradient(135deg,#f59e0b,#d97706)',
              color: '#0c0c0e'
            }}
          >
            ♟
          </div>
          <span className="text-xs text-gray-400">
            © 2026 ChessMate. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          {[
            ['Privacy', '/privacy'],
            ['Terms', '/terms'],
            ['GitHub', 'https://github.com']
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="text-xs text-gray-400 hover:text-[#a8a29e] transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default FooterSection
