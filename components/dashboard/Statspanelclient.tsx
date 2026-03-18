'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Stats {
    elo_rating: number
    total_games: number
    wins: number
    losses: number
    draws: number
    win_rate: number
}

interface Props {
    stats: Stats
    eloHistory: number[]
    lastChange: number
}

const StatCard = ({
    label, value, sub, color,
}: {
    label: string
    value: number
    sub?: string
    color?: string
}) => (
    <div
        className="flex flex-col gap-1 p-4 rounded-xl"
        style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
        }}
    >
        <p className="text-xs text-[#57534e] font-medium">{label}</p>
        <p className="text-2xl font-bold" style={{ color: color ?? '#fef3c7' }}>
            {value}
        </p>
        {sub && <p className="text-xs text-[#44403c]">{sub}</p>}
    </div>
)

const StatsPanelClient = ({ stats, eloHistory, lastChange }: Props) => {
    const isPositive = lastChange >= 0

    // build sparkline — need at least 2 points
    const history = eloHistory.length > 1
        ? eloHistory
        : [stats.elo_rating, stats.elo_rating]

    const min = Math.min(...history)
    const max = Math.max(...history)
    const range = max - min || 1
    const w = 260
    const h = 56

    const points = history.map((v, i) => {
        const x = (i / (history.length - 1)) * w
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
                            <p className="text-xs text-[#57534e] font-medium mb-1">
                                ELO Rating
                            </p>
                            <div className="flex items-center gap-2">
                                <p className="text-3xl font-bold text-[#fef3c7]">
                                    {stats.elo_rating.toLocaleString()}
                                </p>
                                {lastChange !== 0 && (
                                    <Badge
                                        className="text-xs font-bold px-2 py-0.5 rounded-lg border-0"
                                        style={{
                                            background: isPositive
                                                ? 'rgba(34,197,94,0.12)'
                                                : 'rgba(239,68,68,0.12)',
                                            color: isPositive ? '#4ade80' : '#f87171',
                                        }}
                                    >
                                        {isPositive ? '↑' : '↓'} {Math.abs(lastChange)}
                                    </Badge>
                                )}
                            </div>
                        </div>
                        <p className="text-xs text-[#44403c]">Last 20 games</p>
                    </div>

                    {/* Sparkline */}
                    <svg
                        viewBox={`0 0 ${w} ${h}`}
                        className="w-full"
                        style={{ height: 56 }}
                        preserveAspectRatio="none"
                    >
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
                        <path
                            d={sparkline}
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        <circle
                            cx={w}
                            cy={h - ((history[history.length - 1] - min) / range) * h}
                            r="3"
                            fill="#fbbf24"
                        />
                    </svg>
                </div>

                {/* W / L / D */}
                <div className="grid grid-cols-3 gap-2">
                    <StatCard
                        label="Wins"
                        value={stats.wins}
                        color="#4ade80"
                        sub={stats.total_games > 0
                            ? `${Math.round((stats.wins / stats.total_games) * 100)}%`
                            : '0%'}
                    />
                    <StatCard
                        label="Losses"
                        value={stats.losses}
                        color="#f87171"
                        sub={stats.total_games > 0
                            ? `${Math.round((stats.losses / stats.total_games) * 100)}%`
                            : '0%'}
                    />
                    <StatCard
                        label="Draws"
                        value={stats.draws}
                        color="#fbbf24"
                        sub={stats.total_games > 0
                            ? `${Math.round((stats.draws / stats.total_games) * 100)}%`
                            : '0%'}
                    />
                </div>

                {/* Win rate bar */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <p className="text-xs text-[#57534e] font-medium">Win rate</p>
                        <p className="text-xs font-bold text-[#fef3c7]">
                            {Number(stats.win_rate).toFixed(1)}%
                        </p>
                    </div>
                    <div
                        className="w-full h-2 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.06)' }}
                    >
                        <div
                            className="h-full rounded-full transition-all duration-500"
                            style={{
                                width: `${stats.win_rate}%`,
                                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            }}
                        />
                    </div>
                    <p className="text-xs text-[#44403c] mt-1.5">
                        {stats.total_games} total games played
                    </p>
                </div>

            </CardContent>
        </Card>
    )
}

export { StatsPanelClient }