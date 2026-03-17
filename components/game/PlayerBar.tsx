
'use client'

import { useEffect, useRef } from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

interface PlayerBarProps {
    username: string
    avatarUrl?: string
    elo: number
    timeMs: number        // remaining time in milliseconds
    isActive: boolean     // true when it's this player's turn
    isTop?: boolean       // true for opponent (top), false for you (bottom)
}

const formatTime = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000))
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

const PlayerBar = ({
    username,
    avatarUrl = '',
    elo,
    timeMs,
    isActive,
    isTop = false,
}: PlayerBarProps) => {

    const isLow = timeMs < 30_000
    return (
        <div
            className="flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300"
            style={{
                background: isActive
                    ? 'rgba(245,158,11,0.08)'
                    : 'rgba(18,16,12,0.85)',
                border: isActive
                    ? '1px solid rgba(245,158,11,0.25)'
                    : '1px solid rgba(255,255,255,0.07)',
            }}
        >
            {/* Left — avatar + name */}
            <div className="flex items-center gap-3">
                {/* Active turn indicator dot */}
                <div className="relative">
                    <Avatar className="w-9 h-9 rounded-full">
                        <AvatarImage src={avatarUrl} alt={username} />
                        <AvatarFallback
                            className="text-xs font-bold rounded-full"
                            style={{ background: '#1c1000', color: '#fbbf24' }}
                        >
                            {username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    {isActive && (
                        <span
                            className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2"
                            style={{
                                background: '#f59e0b',
                                borderColor: '#0c0c0e',
                                animation: 'pulse 1.5s infinite',
                            }}
                        />
                    )}
                </div>

                <div>
                    <p className="text-sm font-bold text-[#fef3c7] leading-tight">{username}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                        <p className="text-xs text-[#57534e]">ELO {elo.toLocaleString()}</p>
                        {isActive && (
                            <Badge
                                className="text-[10px] font-bold px-1.5 py-0 rounded border-0 leading-4"
                                style={{ background: 'rgba(245,158,11,0.15)', color: '#fbbf24' }}
                            >
                                Your turn
                            </Badge>
                        )}
                    </div>
                </div>
            </div>

            {/* Right — timer */}
            <div
                className="px-4 py-2 rounded-lg min-w-[80px] text-center transition-all duration-300"
                style={{
                    background: isLow
                        ? 'rgba(239,68,68,0.15)'
                        : isActive
                            ? 'rgba(245,158,11,0.15)'
                            : 'rgba(255,255,255,0.05)',
                    border: isLow
                        ? '1px solid rgba(239,68,68,0.3)'
                        : isActive
                            ? '1px solid rgba(245,158,11,0.3)'
                            : '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <span
                    className="text-lg font-bold tabular-nums tracking-wide"
                    style={{
                        color: isLow ? '#f87171' : isActive ? '#fbbf24' : '#a8a29e',
                        animation: isLow && isActive ? 'blink 1s infinite' : 'none',
                    }}
                >
                    {formatTime(timeMs)}
                </span>
            </div>
        </div>
    )
}

export default PlayerBar