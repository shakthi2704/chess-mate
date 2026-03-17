
'use client'

import Link from 'next/link'

interface GameOverProps {
    result: 'win' | 'loss' | 'draw'
    reason: 'checkmate' | 'resign' | 'timeout' | 'draw_agreed' | 'stalemate'
    eloChange: number
    eloBefore: number
    eloAfter: number
    opponentName: string
    onPlayAgain: () => void
    gameId: string
}

const resultConfig = {
    win: { emoji: '🏆', title: 'You won!', color: '#4ade80', bg: 'rgba(34,197,94,0.1)', border: 'rgba(34,197,94,0.25)' },
    loss: { emoji: '😔', title: 'You lost', color: '#f87171', bg: 'rgba(239,68,68,0.1)', border: 'rgba(239,68,68,0.25)' },
    draw: { emoji: '🤝', title: 'It\'s a draw', color: '#fbbf24', bg: 'rgba(245,158,11,0.1)', border: 'rgba(245,158,11,0.25)' },
}

const reasonLabel = {
    checkmate: 'by checkmate',
    resign: 'by resignation',
    timeout: 'on time',
    draw_agreed: 'by agreement',
    stalemate: 'by stalemate',
}
const GameOver = ({
    result,
    reason,
    eloChange,
    eloBefore,
    eloAfter,
    opponentName,
    onPlayAgain,
    gameId,
}: GameOverProps) => {

    const cfg = resultConfig[result]
    const isPos = eloChange >= 0
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="w-full max-w-sm rounded-2xl p-8 text-center"
                style={{
                    background: 'rgba(18,16,12,0.98)',
                    border: `1px solid ${cfg.border}`,
                    boxShadow: `0 0 60px ${cfg.bg}`,
                }}
            >
                {/* Result emoji + title */}
                <div className="text-5xl mb-3">{cfg.emoji}</div>
                <h2 className="text-2xl font-bold mb-1" style={{ color: cfg.color }}>
                    {cfg.title}
                </h2>
                <p className="text-sm text-[#57534e] mb-6">
                    vs {opponentName} · {reasonLabel[reason]}
                </p>

                {/* ELO change */}
                <div
                    className="rounded-xl px-6 py-4 mb-6"
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                    <p className="text-xs text-[#57534e] mb-2">ELO change</p>
                    <div className="flex items-center justify-center gap-3">
                        <span className="text-lg font-bold text-[#a8a29e]">{eloBefore}</span>
                        <span className="text-[#44403c]">→</span>
                        <span className="text-lg font-bold text-[#fef3c7]">{eloAfter}</span>
                        <span
                            className="text-base font-bold"
                            style={{ color: isPos ? '#4ade80' : '#f87171' }}
                        >
                            ({isPos ? '+' : ''}{eloChange})
                        </span>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                    <button
                        onClick={onPlayAgain}
                        className="w-full py-3 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all hover:opacity-90 active:scale-[0.98]"
                        style={{
                            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            boxShadow: '0 0 20px rgba(245,158,11,0.25)',
                        }}
                    >
                        ♟ Play again
                    </button>

                    <Link
                        href={`/game/${gameId}/replay`}
                        className="w-full py-3 rounded-xl text-sm font-semibold text-[#a8a29e] transition-all hover:bg-white/[0.05] text-center"
                        style={{ border: '1px solid rgba(255,255,255,0.08)' }}
                    >
                        🎬 Review game
                    </Link>

                    <Link
                        href="/dashboard"
                        className="w-full py-2 text-sm text-[#44403c] hover:text-[#57534e] transition-colors text-center"
                    >
                        Back to dashboard
                    </Link>
                </div>
            </div>
        </div>

    )
}

export default GameOver