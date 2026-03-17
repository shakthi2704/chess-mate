'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'

type GameResult = 'win' | 'loss' | 'draw'

interface RecentGame {
    id: string
    opponent: string
    opponentInitials: string
    opponentElo: number
    result: GameResult
    eloBefore: number
    eloAfter: number
    timeControl: string
    mode: 'pvp' | 'pvc'
    playedAt: string
}


// TODO: replace with real data from Supabase
const recentGames: RecentGame[] = [
    { id: '1', opponent: 'MasterKing', opponentInitials: 'MK', opponentElo: 2104, result: 'loss', eloBefore: 1270, eloAfter: 1247, timeControl: '5+0', mode: 'pvp', playedAt: '2h ago' },
    { id: '2', opponent: 'BlitzXpert', opponentInitials: 'BX', opponentElo: 1891, result: 'win', eloBefore: 1247, eloAfter: 1270, timeControl: '10+0', mode: 'pvp', playedAt: '5h ago' },
    { id: '3', opponent: 'Stockfish', opponentInitials: 'AI', opponentElo: 0, result: 'win', eloBefore: 1235, eloAfter: 1247, timeControl: '10+0', mode: 'pvc', playedAt: '1d ago' },
    { id: '4', opponent: 'QueenSlayer', opponentInitials: 'QS', opponentElo: 2058, result: 'loss', eloBefore: 1247, eloAfter: 1235, timeControl: '5+0', mode: 'pvp', playedAt: '1d ago' },
    { id: '5', opponent: 'RookKiller', opponentInitials: 'RK', opponentElo: 1987, result: 'draw', eloBefore: 1244, eloAfter: 1247, timeControl: '30+0', mode: 'pvp', playedAt: '2d ago' },
]



const resultConfig: Record<GameResult, { label: string; bg: string; color: string }> = {
    win: { label: 'Win', bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
    loss: { label: 'Loss', bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
    draw: { label: 'Draw', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
}
function RecentGames() {
    return (
        <Card
            className="w-full rounded-2xl border-0"
            style={{
                background: 'rgba(18,16,12,0.85)',
                border: '1px solid rgba(245,158,11,0.15)',
            }}
        >
            <CardHeader className="pb-3 pt-5 px-6">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base font-bold text-[#fef3c7]">
                        Recent Games
                    </CardTitle>
                    <Link
                        href="/profile"
                        className="text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-colors font-medium"
                    >
                        View all →
                    </Link>
                </div>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                {/* Table header */}
                <div
                    className="grid text-xs font-semibold uppercase tracking-wider text-[#44403c] pb-2 mb-1"
                    style={{
                        gridTemplateColumns: '1fr 80px 90px 60px',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}
                >
                    <div>Opponent</div>
                    <div className="text-center">Result</div>
                    <div className="text-center">ELO change</div>
                    <div className="text-right">When</div>
                </div>

                {/* Rows */}
                <div className="space-y-0.5 mt-1">
                    {recentGames.map(game => {
                        const cfg = resultConfig[game.result]
                        const eloChange = game.eloAfter - game.eloBefore
                        const isPos = eloChange >= 0

                        return (
                            <Link
                                key={game.id}
                                href={`/game/${game.id}/replay`}
                                className="grid items-center py-3 rounded-xl px-2 transition-colors duration-150 group"
                                style={{
                                    gridTemplateColumns: '1fr 80px 90px 60px',
                                }}
                                onMouseEnter={e => (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(245,158,11,0.04)'}
                                onMouseLeave={e => (e.currentTarget as HTMLAnchorElement).style.background = 'transparent'}
                            >
                                {/* Opponent */}
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                        style={{
                                            background: game.mode === 'pvc' ? 'rgba(99,102,241,0.2)' : '#1c1000',
                                            color: game.mode === 'pvc' ? '#a78bfa' : '#fbbf24',
                                        }}
                                    >
                                        {game.opponentInitials}
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-[#fef3c7] group-hover:text-[#fbbf24] transition-colors">
                                            {game.opponent}
                                        </p>
                                        <p className="text-xs text-[#44403c]">
                                            {game.mode === 'pvc' ? '🤖 Computer' : `${game.timeControl} · ELO ${game.opponentElo}`}
                                        </p>
                                    </div>
                                </div>

                                {/* Result badge */}
                                <div className="flex justify-center">
                                    <Badge
                                        className="text-xs font-bold px-2.5 py-0.5 rounded-lg border-0"
                                        style={{ background: cfg.bg, color: cfg.color }}
                                    >
                                        {cfg.label}
                                    </Badge>
                                </div>

                                {/* ELO change */}
                                <div className="text-center">
                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: isPos ? '#4ade80' : '#f87171' }}
                                    >
                                        {isPos ? '+' : ''}{eloChange}
                                    </span>
                                    <span className="text-xs text-[#44403c] ml-1">
                                        → {game.eloAfter}
                                    </span>
                                </div>

                                {/* Time */}
                                <div className="text-right text-xs text-[#44403c]">
                                    {game.playedAt}
                                </div>
                            </Link>
                        )
                    })}
                </div>
            </CardContent>
        </Card>
    )
}

export default RecentGames