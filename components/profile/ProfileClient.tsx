'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { useState } from 'react'
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer,
} from 'recharts'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardNav from '../dashboard/DashboardNav'

type GameResult = 'win' | 'loss' | 'draw'

interface User {
    id: string
    username: string
    avatar_url: string | null
    elo_rating: number
    total_games: number
    wins: number
    losses: number
    draws: number
    win_rate: number
    created_at: string
}

interface EloPoint {
    elo_after: number
    elo_change: number
    created_at: string
}

interface Game {
    id: string
    mode: string
    timeControl: string
    result: GameResult
    opponentName: string
    opponentInitials: string
    opponentElo: number
    eloBefore: number
    eloAfter: number
    eloChange: number
    playedAt: string
}

interface Props {
    user: User
    eloHistory: EloPoint[]
    games: Game[]
    isOwnProfile: boolean
}

const resultConfig: Record<GameResult, { label: string; bg: string; color: string }> = {
    win: { label: 'Win', bg: 'rgba(34,197,94,0.12)', color: '#4ade80' },
    loss: { label: 'Loss', bg: 'rgba(239,68,68,0.12)', color: '#f87171' },
    draw: { label: 'Draw', bg: 'rgba(245,158,11,0.12)', color: '#fbbf24' },
}


const StatCard = ({
    label, value, sub, color,
}: {
    label: string
    value: string | number
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

const ProfileClient = ({ user, eloHistory, games, isOwnProfile }: Props) => {

    const router = useRouter()
    const [editOpen, setEditOpen] = useState(false)
    const [newUsername, setNewUsername] = useState(user.username)
    const [saving, setSaving] = useState(false)
    const [editError, setEditError] = useState('')


    // prepare chart data
    const chartData = eloHistory.map((point, i) => ({
        game: i + 1,
        elo: point.elo_after,
        date: new Date(point.created_at).toLocaleDateString(),
    }))


    // if no history show starting ELO
    if (chartData.length === 0) {
        chartData.push({ game: 0, elo: user.elo_rating, date: 'Now' })
    }
    const handleSaveProfile = async () => {
        setEditError('')
        setSaving(true)

        try {
            const res = await fetch('/api/profile/update', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username: newUsername }),
            })

            const data = await res.json()

            if (!res.ok) {
                setEditError(data.error || 'Failed to update profile')
                setSaving(false)
                return
            }

            setEditOpen(false)
            router.push(`/profile/${newUsername}`)
            router.refresh()

        } catch {
            setEditError('Something went wrong')
            setSaving(false)
        }
    }

    const joinDate = new Date(user.created_at).toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric',
    })


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

                {/* ── Profile header ── */}
                <div
                    className="rounded-2xl p-6 mb-6 flex flex-col sm:flex-row items-start sm:items-center gap-5"
                    style={{
                        background: 'rgba(18,16,12,0.85)',
                        border: '1px solid rgba(245,158,11,0.15)',
                    }}
                >
                    <Avatar className="w-20 h-20 rounded-full flex-shrink-0">
                        <AvatarImage src={user.avatar_url ?? ''} alt={user.username} />
                        <AvatarFallback
                            className="text-2xl font-bold rounded-full"
                            style={{ background: '#1c1000', color: '#fbbf24' }}
                        >
                            {user.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-[#fef3c7]">
                                {user.username}
                            </h1>
                            <div
                                className="px-3 py-1 rounded-lg text-sm font-bold"
                                style={{
                                    background: 'rgba(245,158,11,0.12)',
                                    border: '1px solid rgba(245,158,11,0.2)',
                                    color: '#fbbf24',
                                }}
                            >
                                {user.elo_rating.toLocaleString()} ELO
                            </div>
                        </div>
                        <p className="text-sm text-[#57534e] mt-1">
                            Member since {joinDate} · {user.total_games} games played
                        </p>
                    </div>

                    {isOwnProfile && (
                        <button
                            onClick={() => setEditOpen(true)}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-[#a8a29e] transition-all hover:bg-white/[0.06] flex-shrink-0"
                            style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit profile
                        </button>
                    )}
                </div>

                {/* ── Stats row ── */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    <StatCard label="Wins" value={user.wins} color="#4ade80" />
                    <StatCard label="Losses" value={user.losses} color="#f87171" />
                    <StatCard label="Draws" value={user.draws} color="#fbbf24" />
                    <StatCard
                        label="Win rate"
                        value={`${Number(user.win_rate).toFixed(1)}%`}
                        color="#fbbf24"
                        sub={`${user.total_games} games`}
                    />
                </div>

                {/* ── ELO chart ── */}
                <Card
                    className="rounded-2xl border-0 mb-6"
                    style={{
                        background: 'rgba(18,16,12,0.85)',
                        border: '1px solid rgba(245,158,11,0.15)',
                    }}
                >
                    <CardHeader className="pb-2 pt-5 px-6">
                        <CardTitle className="text-base font-bold text-[#fef3c7]">
                            ELO History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-4 pb-6">
                        {chartData.length < 2 ? (
                            <div className="flex items-center justify-center h-40">
                                <p className="text-sm text-[#44403c]">
                                    Play some games to see your ELO chart
                                </p>
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                        stroke="rgba(255,255,255,0.05)"
                                    />
                                    <XAxis
                                        dataKey="game"
                                        tick={{ fill: '#44403c', fontSize: 11 }}
                                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                        tickLine={false}
                                        label={{
                                            value: 'Games',
                                            position: 'insideBottom',
                                            offset: -2,
                                            fill: '#44403c',
                                            fontSize: 11,
                                        }}
                                    />
                                    <YAxis
                                        tick={{ fill: '#44403c', fontSize: 11 }}
                                        axisLine={{ stroke: 'rgba(255,255,255,0.06)' }}
                                        tickLine={false}
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#18160c',
                                            border: '1px solid rgba(245,158,11,0.2)',
                                            borderRadius: 8,
                                            color: '#fef3c7',
                                            fontSize: 12,
                                        }}
                                        formatter={(value: any) => [`${value} ELO`, 'Rating']}
                                        labelFormatter={(label: any) => `Game ${label}`}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="elo"
                                        stroke="#f59e0b"
                                        strokeWidth={2}
                                        dot={{ fill: '#fbbf24', r: 3 }}
                                        activeDot={{ fill: '#fbbf24', r: 5 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        )}
                    </CardContent>
                </Card>

                {/* ── Game history ── */}
                <Card
                    className="rounded-2xl border-0"
                    style={{
                        background: 'rgba(18,16,12,0.85)',
                        border: '1px solid rgba(245,158,11,0.15)',
                    }}
                >
                    <CardHeader className="pb-2 pt-5 px-6">
                        <CardTitle className="text-base font-bold text-[#fef3c7]">
                            Game History
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="px-6 pb-6">
                        {games.length === 0 ? (
                            <div className="text-center py-10">
                                <p className="text-[#44403c] text-sm">No games played yet</p>
                                <Button
                                    asChild
                                    className="mt-4 text-sm font-bold text-[#0c0c0e] hover:opacity-90 border-0"
                                    style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                                >
                                    <Link href="/dashboard">Play your first game</Link>
                                </Button>
                            </div>
                        ) : (
                            <>
                                <div
                                    className="grid text-xs font-semibold uppercase tracking-wider text-[#44403c] pb-2 mb-1"
                                    style={{
                                        gridTemplateColumns: '1fr 80px 100px 70px',
                                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                                    }}
                                >
                                    <div>Opponent</div>
                                    <div className="text-center">Result</div>
                                    <div className="text-center">ELO change</div>
                                    <div className="text-right">Date</div>
                                </div>

                                <div className="space-y-0.5 mt-1">
                                    {games.map(game => {
                                        const cfg = resultConfig[game.result]
                                        const isPos = game.eloChange >= 0

                                        return (
                                            <Link
                                                key={game.id}
                                                href={`/game/${game.id}/replay`}
                                                className="grid items-center py-3 rounded-xl px-2 transition-colors hover:bg-[rgba(245,158,11,0.04)]"
                                                style={{ gridTemplateColumns: '1fr 80px 100px 70px' }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                                                        style={{
                                                            background: game.mode === 'pvc'
                                                                ? 'rgba(99,102,241,0.2)'
                                                                : '#1c1000',
                                                            color: game.mode === 'pvc' ? '#a78bfa' : '#fbbf24',
                                                        }}
                                                    >
                                                        {game.opponentInitials}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-semibold text-[#fef3c7]">
                                                            {game.opponentName}
                                                        </p>
                                                        <p className="text-xs text-[#44403c]">
                                                            {game.mode === 'pvc'
                                                                ? '🤖 Computer'
                                                                : `${game.timeControl} · ELO ${game.opponentElo}`}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex justify-center">
                                                    <Badge
                                                        className="text-xs font-bold px-2.5 py-0.5 rounded-lg border-0"
                                                        style={{ background: cfg.bg, color: cfg.color }}
                                                    >
                                                        {cfg.label}
                                                    </Badge>
                                                </div>

                                                <div className="text-center">
                                                    <span
                                                        className="text-sm font-bold"
                                                        style={{ color: isPos ? '#4ade80' : '#f87171' }}
                                                    >
                                                        {isPos ? '+' : ''}{game.eloChange}
                                                    </span>
                                                    <span className="text-xs text-[#44403c] ml-1">
                                                        → {game.eloAfter}
                                                    </span>
                                                </div>

                                                <div className="text-right text-xs text-[#44403c]">
                                                    {game.playedAt}
                                                </div>
                                            </Link>
                                        )
                                    })}
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </main>

            {/* ── Edit profile modal ── */}
            {editOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center px-4"
                    style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
                    onClick={e => { if (e.target === e.currentTarget) setEditOpen(false) }}
                >
                    <div
                        className="w-full max-w-sm rounded-2xl p-8"
                        style={{
                            background: 'rgba(18,16,12,0.98)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            boxShadow: '0 0 60px rgba(245,158,11,0.08)',
                        }}
                    >
                        <h2 className="text-lg font-bold text-[#fef3c7] mb-6">
                            Edit profile
                        </h2>

                        {/* Avatar preview */}
                        <div className="flex items-center gap-4 mb-6">
                            <Avatar className="w-14 h-14 rounded-full">
                                <AvatarImage src={user.avatar_url ?? ''} alt={user.username} />
                                <AvatarFallback
                                    className="text-lg font-bold rounded-full"
                                    style={{ background: '#1c1000', color: '#fbbf24' }}
                                >
                                    {newUsername.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="text-sm font-medium text-[#fef3c7]">
                                    {newUsername}
                                </p>
                                <p className="text-xs text-[#44403c]">
                                    Avatar from Google account
                                </p>
                            </div>
                        </div>

                        {/* Username input */}
                        <div className="mb-5">
                            <label className="block text-sm font-medium text-[#a8a29e] mb-1.5">
                                Username
                            </label>
                            <input
                                type="text"
                                value={newUsername}
                                onChange={e => setNewUsername(e.target.value)}
                                minLength={3}
                                maxLength={20}
                                className="w-full px-4 py-2.5 rounded-xl text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200"
                                style={{
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                                onFocus={e => {
                                    e.target.style.border = '1px solid rgba(245,158,11,0.5)'
                                    e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.08)'
                                }}
                                onBlur={e => {
                                    e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                                    e.target.style.boxShadow = 'none'
                                }}
                            />
                            <p className="text-xs text-[#292524] mt-1">
                                3–20 characters · letters, numbers, underscores only
                            </p>
                        </div>

                        {editError && (
                            <div
                                className="mb-4 px-4 py-3 rounded-xl text-sm text-red-400"
                                style={{
                                    background: 'rgba(239,68,68,0.08)',
                                    border: '1px solid rgba(239,68,68,0.2)',
                                }}
                            >
                                {editError}
                            </div>
                        )}

                        <div className="flex gap-3">
                            <button
                                onClick={() => { setEditOpen(false); setEditError('') }}
                                className="flex-1 py-2.5 rounded-xl text-sm font-medium text-[#a8a29e] transition-all hover:bg-white/[0.05]"
                                style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving || newUsername.length < 3}
                                className="flex-1 py-2.5 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all hover:opacity-90 disabled:opacity-50"
                                style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                            >
                                {saving ? 'Saving...' : 'Save changes'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProfileClient