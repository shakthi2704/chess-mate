'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface User {
    username: string
    avatar_url: string | null
    elo_rating: number
    last_elo_change: number | null
}

const DashboardTopbarClient = ({ user }: { user: User }) => {
    const eloChange = user.last_elo_change ?? 0
    const isPositive = eloChange >= 0

    return (
        <div
            className="w-full rounded-2xl px-6 py-4 flex items-center justify-between gap-4"
            style={{
                background: 'rgba(18,16,12,0.85)',
                border: '1px solid rgba(245,158,11,0.15)',
            }}
        >
            {/* Left — avatar + greeting */}
            <div className="flex items-center gap-4">
                <Avatar className="w-11 h-11 rounded-full">
                    <AvatarImage src={user.avatar_url ?? ''} alt={user.username} />
                    <AvatarFallback
                        className="text-sm font-bold rounded-full"
                        style={{ background: '#1c1000', color: '#fbbf24' }}
                    >
                        {user.username.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                </Avatar>

                <div>
                    <p className="text-xs text-[#57534e] mb-0.5">Welcome back</p>
                    <p className="text-base font-bold text-[#fef3c7]">{user.username}</p>
                </div>
            </div>

            {/* Right — ELO + change */}
            <div className="flex items-center gap-3">
                <div className="text-right">
                    <p className="text-xs text-[#57534e] mb-0.5">Current ELO</p>
                    <p className="text-lg font-bold text-[#fef3c7]">
                        {user.elo_rating.toLocaleString()}
                    </p>
                </div>

                {eloChange !== 0 && (
                    <Badge
                        className="text-xs font-bold px-2.5 py-1 rounded-lg border-0"
                        style={{
                            background: isPositive
                                ? 'rgba(34,197,94,0.12)'
                                : 'rgba(239,68,68,0.12)',
                            color: isPositive ? '#4ade80' : '#f87171',
                        }}
                    >
                        {isPositive ? '↑' : '↓'} {Math.abs(eloChange)}
                    </Badge>
                )}
            </div>
        </div>
    )
}

export { DashboardTopbarClient }