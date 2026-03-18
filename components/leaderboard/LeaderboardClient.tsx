'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardNav from '../dashboard/DashboardNav'

interface Player {
    id: string
    username: string
    avatar_url: string | null
    elo_rating: number
    total_games: number
    wins: number
    losses: number
    draws: number
    win_rate: number
    rank: number
    isCurrentUser: boolean
}

const rankDisplay = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return rank
}

const rankColor = (rank: number) => {
    if (rank === 1) return '#fbbf24'
    if (rank === 2) return '#94a3b8'
    if (rank === 3) return '#f97316'
    return '#44403c'
}


const LeaderboardClient = ({ players }: { players: Player[] }) => {

    const [search, setSearch] = useState('')

    const filtered = players.filter(p =>
        p.username.toLowerCase().includes(search.toLowerCase())
    )
    const currentUserRank = players.find(p => p.isCurrentUser)
    return (
        <div className="min-h-screen bg-[#0c0c0e] text-[#e7e5e4]">

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute -top-48 left-1/2 -translate-x-1/2 w-[600px] h-[500px]"
                    style={{
                        background:
                            'radial-gradient(ellipse at center,rgba(245,158,11,0.08) 0%,transparent 70%)',
                    }}
                />
            </div>

            <DashboardNav />

            <main className="relative z-10 max-w-4xl mx-auto px-4 py-8 pb-24 md:pb-8">

                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-[#fef3c7] mb-1">
                        🏆 Leaderboard
                    </h1>
                    <p className="text-sm text-[#57534e]">
                        Top players ranked by ELO rating
                    </p>
                </div>

                {/* Your rank card — only if logged in and ranked */}
                {currentUserRank && (
                    <div
                        className="rounded-2xl px-6 py-4 mb-6 flex items-center justify-between"
                        style={{
                            background: 'rgba(245,158,11,0.08)',
                            border: '1px solid rgba(245,158,11,0.25)',
                        }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-bold" style={{ color: rankColor(currentUserRank.rank) }}>
                                #{currentUserRank.rank}
                            </span>
                            <div>
                                <p className="text-sm font-bold text-[#fef3c7]">Your ranking</p>
                                <p className="text-xs text-[#57534e]">
                                    {currentUserRank.elo_rating.toLocaleString()} ELO ·{' '}
                                    {currentUserRank.total_games} games
                                </p>
                            </div>
                        </div>
                        <div
                            className="text-xs font-semibold px-3 py-1.5 rounded-lg"
                            style={{
                                background: 'rgba(245,158,11,0.12)',
                                color: '#fbbf24',
                                border: '1px solid rgba(245,158,11,0.2)',
                            }}
                        >
                            Win rate {Number(currentUserRank.win_rate).toFixed(1)}%
                        </div>
                    </div>
                )}

                {/* Top 3 podium */}
                {players.length >= 3 && (
                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {/* 2nd place */}
                        <div
                            className="rounded-2xl p-4 text-center order-1"
                            style={{
                                background: 'rgba(18,16,12,0.85)',
                                border: '1px solid rgba(148,163,184,0.2)',
                                marginTop: 24,
                            }}
                        >
                            <div className="text-2xl mb-2">🥈</div>
                            <Avatar className="w-12 h-12 rounded-full mx-auto mb-2">
                                <AvatarImage src={players[1].avatar_url ?? ''} alt={players[1].username} />
                                <AvatarFallback
                                    className="text-sm font-bold rounded-full"
                                    style={{ background: '#1c1000', color: '#94a3b8' }}
                                >
                                    {players[1].username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Link
                                href={`/profile/${players[1].username}`}
                                className="text-sm font-bold text-[#fef3c7] hover:text-[#fbbf24] transition-colors block truncate"
                            >
                                {players[1].username}
                            </Link>
                            <p className="text-xs text-[#57534e] mt-1">
                                {players[1].elo_rating.toLocaleString()} ELO
                            </p>
                        </div>

                        {/* 1st place */}
                        <div
                            className="rounded-2xl p-4 text-center order-2"
                            style={{
                                background: 'rgba(18,16,12,0.85)',
                                border: '1px solid rgba(245,158,11,0.3)',
                                boxShadow: '0 0 30px rgba(245,158,11,0.08)',
                            }}
                        >
                            <div className="text-3xl mb-2">🥇</div>
                            <Avatar className="w-14 h-14 rounded-full mx-auto mb-2">
                                <AvatarImage src={players[0].avatar_url ?? ''} alt={players[0].username} />
                                <AvatarFallback
                                    className="text-base font-bold rounded-full"
                                    style={{ background: '#1c1000', color: '#fbbf24' }}
                                >
                                    {players[0].username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Link
                                href={`/profile/${players[0].username}`}
                                className="text-sm font-bold text-[#fef3c7] hover:text-[#fbbf24] transition-colors block truncate"
                            >
                                {players[0].username}
                            </Link>
                            <p className="text-xs text-[#57534e] mt-1">
                                {players[0].elo_rating.toLocaleString()} ELO
                            </p>
                        </div>

                        {/* 3rd place */}
                        <div
                            className="rounded-2xl p-4 text-center order-3"
                            style={{
                                background: 'rgba(18,16,12,0.85)',
                                border: '1px solid rgba(249,115,22,0.2)',
                                marginTop: 32,
                            }}
                        >
                            <div className="text-2xl mb-2">🥉</div>
                            <Avatar className="w-12 h-12 rounded-full mx-auto mb-2">
                                <AvatarImage src={players[2].avatar_url ?? ''} alt={players[2].username} />
                                <AvatarFallback
                                    className="text-sm font-bold rounded-full"
                                    style={{ background: '#1c1000', color: '#f97316' }}
                                >
                                    {players[2].username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <Link
                                href={`/profile/${players[2].username}`}
                                className="text-sm font-bold text-[#fef3c7] hover:text-[#fbbf24] transition-colors block truncate"
                            >
                                {players[2].username}
                            </Link>
                            <p className="text-xs text-[#57534e] mt-1">
                                {players[2].elo_rating.toLocaleString()} ELO
                            </p>
                        </div>
                    </div>
                )}

                {/* Search + full table */}
                <Card
                    className="rounded-2xl border-0"
                    style={{
                        background: 'rgba(18,16,12,0.85)',
                        border: '1px solid rgba(245,158,11,0.15)',
                    }}
                >
                    <CardHeader className="pb-3 pt-5 px-6">
                        <div className="flex items-center justify-between gap-4">
                            <CardTitle className="text-base font-bold text-[#fef3c7]">
                                All players
                            </CardTitle>
                            {/* Search */}
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search player..."
                                className="px-3 py-1.5 rounded-lg text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all w-40"
                                style={{
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                onFocus={e => {
                                    e.target.style.border = '1px solid rgba(245,158,11,0.4)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.07)'
                                }}
                                onBlur={e => {
                                    e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                        </div>
                    </CardHeader>

                    <CardContent className="px-6 pb-6">
                        {/* Table head */}
                        <div
                            className="grid text-xs font-semibold uppercase tracking-wider text-[#44403c] pb-2 mb-1"
                            style={{
                                gridTemplateColumns: '48px 1fr 80px 80px 70px',
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                            }}
                        >
                            <div>#</div>
                            <div>Player</div>
                            <div className="text-right">ELO</div>
                            <div className="text-right">Games</div>
                            <div className="text-right">Win rate</div>
                        </div>

                        {/* Rows */}
                        {filtered.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-sm text-[#44403c]">No players found</p>
                            </div>
                        ) : (
                            <div className="space-y-0.5 mt-1">
                                {filtered.map(player => (
                                    <Link
                                        key={player.id}
                                        href={`/profile/${player.username}`}
                                        className="grid items-center py-3 px-2 rounded-xl transition-colors"
                                        style={{
                                            gridTemplateColumns: '48px 1fr 80px 80px 70px',
                                            background: player.isCurrentUser
                                                ? 'rgba(245,158,11,0.06)'
                                                : 'transparent',
                                            border: player.isCurrentUser
                                                ? '1px solid rgba(245,158,11,0.15)'
                                                : '1px solid transparent',
                                        }}
                                        onMouseEnter={e => {
                                            if (!player.isCurrentUser)
                                                (e.currentTarget as HTMLAnchorElement).style.background =
                                                    'rgba(245,158,11,0.03)'
                                        }}
                                        onMouseLeave={e => {
                                            if (!player.isCurrentUser)
                                                (e.currentTarget as HTMLAnchorElement).style.background =
                                                    'transparent'
                                        }}
                                    >
                                        {/* Rank */}
                                        <div
                                            className="text-sm font-bold"
                                            style={{ color: rankColor(player.rank) }}
                                        >
                                            {rankDisplay(player.rank)}
                                        </div>

                                        {/* Player */}
                                        <div className="flex items-center gap-3">
                                            <Avatar className="w-8 h-8 rounded-full flex-shrink-0">
                                                <AvatarImage
                                                    src={player.avatar_url ?? ''}
                                                    alt={player.username}
                                                />
                                                <AvatarFallback
                                                    className="text-xs font-bold rounded-full"
                                                    style={{ background: '#1c1000', color: '#fbbf24' }}
                                                >
                                                    {player.username.slice(0, 2).toUpperCase()}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="text-sm font-semibold text-[#fef3c7]">
                                                    {player.username}{' '}
                                                    {player.isCurrentUser && (
                                                        <span className="ml-1 text-[10px] font-bold text-[#f59e0b]">
                                                            YOU
                                                        </span>
                                                    )}
                                                </p>
                                                <p className="text-xs text-[#44403c]">
                                                    {player.wins}W · {player.losses}L · {player.draws}D
                                                </p>
                                            </div>
                                        </div>

                                        {/* ELO */}
                                        <div className="text-sm font-bold text-[#fef3c7] text-right">
                                            {player.elo_rating.toLocaleString()}
                                        </div>

                                        {/* Games */}
                                        <div className="text-sm text-[#57534e] text-right">
                                            {player.total_games}
                                        </div>

                                        {/* Win rate */}
                                        <div className="text-sm font-semibold text-[#f59e0b] text-right">
                                            {Number(player.win_rate).toFixed(1)}%
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}

export default LeaderboardClient