'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

// TODO: replace with real data from Supabase
const stats = {
    elo: 1247,
    eloChange: +23,
    wins: 42,
    losses: 31,
    draws: 12,
    winRate: 49,
    totalGames: 85,
    eloHistory: [1180, 1195, 1210, 1198, 1215, 1230, 1218, 1235, 1247],
}

const StatCard = ({
    label,
    value,
    sub,
    color,
}: {
    label: string
    value: string | number
    sub?: string
    color?: string
}) => (
    <div
        className="flex flex-col gap-1 p-4 rounded-xl"
        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
        <p className="text-xs text-[#57534e] font-medium">{label}</p>
        <p className="text-2xl font-bold" style={{ color: color ?? '#fef3c7' }}>
            {value}
        </p>
        {sub && <p className="text-xs text-[#44403c]">{sub}</p>}
    </div>
)


function StatsPanel() {

    const isPositive = stats.eloChange >= 0

    // Simple sparkline path from eloHistory
    const min = Math.min(...stats.eloHistory)
    const max = Math.max(...stats.eloHistory)
    const range = max - min || 1
    const w = 260
    const h = 56
    const points = stats.eloHistory.map((v, i) => {
        const x = (i / (stats.eloHistory.length - 1)) * w
        const y = h - ((v - min) / range) * h
        return `${x},${y}`
    })
    const sparkline = `M ${points.join(' L ')}`
    return (
        <Card
            className="w-full rounded-2xl border-0"
            style={{
                background: 'rgba(18,16,12,0.85)',
                border: '1px solid rgba(245,158,11,0.15)',
            }}
        >
            <CardHeader className="pb-3 pt-5 px-6">
                <CardTitle className="text-base font-bold text-[#fef3c7]">
                    Your Stats
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6 space-y-5">
                {/* ELO + sparkline */}
                <div
                    className="p-4 rounded-xl"
                    style={{
                        background: 'rgba(245,158,11,0.07)',
                        border: '1px solid rgba(245,158,11,0.15)',
                    }}
                >
                    <div className="flex items-start justify-between mb-3">
                        <div>
                            <p className="text-xs text-[#57534e] font-medium mb-1">ELO Rating</p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-[#fef3c7]">
                                    {stats.elo.toLocaleString()}
                                </p>
                                <Badge
                                    className="text-xs font-bold px-2 py-0.5 rounded-lg border-0"
                                    style={{
                                        background: isPositive ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.12)',
                                        color: isPositive ? '#4ade80' : '#f87171',
                                    }}
                                >
                                    {isPositive ? '↑' : '↓'} {Math.abs(stats.eloChange)}
                                </Badge>
                            </div>
                        </div>
                        <p className="text-xs text-[#44403c]">Last 30 days</p>
                    </div>

                    {/* Sparkline */}
                    <svg
                        viewBox={`0 0 ${w} ${h}`}
                        className="w-full"
                        style={{ height: 56 }}
                        preserveAspectRatio="none"
                    >
                        {/* Fill */}
                        <defs>
                            <linearGradient id="sparkFill" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                            </linearGradient>
                        </defs>
                        <path
                            d={`${sparkline} L ${w},${h} L 0,${h} Z`}
                            fill="url(#sparkFill)"
                        />
                        {/* Line */}
                        <path
                            d={sparkline}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Last dot */}
                        <circle
                            cx={w}
                            cy={h - ((stats.eloHistory[stats.eloHistory.length - 1] - min) / range) * h}
                            r="3"
                            fill="#fbbf24"
                        />
                    </svg>
                </div>

                {/* W / L / D grid */}
                <div className="grid grid-cols-3 gap-2">
                    <StatCard label="Wins" value={stats.wins} color="#4ade80" sub={`${Math.round((stats.wins / stats.totalGames) * 100)}%`} />
                    <StatCard label="Losses" value={stats.losses} color="#f87171" sub={`${Math.round((stats.losses / stats.totalGames) * 100)}%`} />
                    <StatCard label="Draws" value={stats.draws} color="#fbbf24" sub={`${Math.round((stats.draws / stats.totalGames) * 100)}%`} />
                </div>

                {/* Win rate bar */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-[#57534e] font-medium">Win rate</p>
                        <p className="text-xs font-bold text-[#fef3c7]">{stats.winRate}%</p>
                    </div>
                    <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${stats.winRate}%`,
                                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            }}
                        />
                    </div>
                    <p className="text-xs text-[#44403c] mt-1.5">{stats.totalGames} total games played</p>
                </div>
            </CardContent>
        </Card>
    )
}

export default StatsPanel