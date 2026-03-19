'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TIME_CONTROLS = [
    { label: 'Bullet', time: '1+0', desc: '1 min', ms: 60_000 },
    { label: 'Blitz', time: '5+0', desc: '5 min', ms: 300_000 },
    { label: 'Rapid', time: '10+0', desc: '10 min', ms: 600_000 },
    { label: 'Classic', time: '30+0', desc: '30 min', ms: 1_800_000 },
]

const AI_LEVELS = [
    { label: 'Easy', level: 2, desc: 'Beginner friendly' },
    { label: 'Medium', level: 6, desc: 'Casual player' },
    { label: 'Hard', level: 12, desc: 'Club player' },
    { label: 'Master', level: 20, desc: 'Grandmaster' },
]
const QuickPlay = () => {

    const router = useRouter()

    const [selectedTime, setSelectedTime] = useState('10+0')
    const [selectedLevel, setSelectedLevel] = useState(6)
    const [roomCode, setRoomCode] = useState('')
    const [creating, setCreating] = useState(false)
    const [joining, setJoining] = useState(false)
    const [joinError, setJoinError] = useState('')

    // ── Create PvP game ──
    const handleCreateGame = async () => {
        setCreating(true)
        try {
            const res = await fetch('/api/games/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeControl: selectedTime }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.error)
            router.push(`/game/${data.roomCode}`)
        } catch (err: any) {
            console.error('Create game error:', err)
        } finally {
            setCreating(false)
        }
    }

    // ── Join PvP game ──
    const handleJoinGame = async () => {
        if (roomCode.length < 6) return
        setJoining(true)
        setJoinError('')
        try {
            const res = await fetch('/api/games/join', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ roomCode }),
            })
            const data = await res.json()
            if (!res.ok) { setJoinError(data.error); return }
            router.push(`/game/${data.roomCode}`)
        } catch {
            setJoinError('Something went wrong. Try again.')
        } finally {
            setJoining(false)
        }
    }

    // ── Play vs AI ──
    const handlePlayAI = () => {
        const tc = TIME_CONTROLS.find(t => t.time === selectedTime)
        router.push(`/game/pvc?level=${selectedLevel}&time=${tc?.ms ?? 600_000}`)
    }


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
                    Quick Play
                </CardTitle>
            </CardHeader>

            <CardContent className="px-6 pb-6">
                <Tabs defaultValue="pvp">
                    {/* Tab triggers */}
                    <TabsList
                        className="w-full mb-5 rounded-xl p-1 h-auto"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                    >
                        <TabsTrigger
                            value="pvp"
                            className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 data-[state=active]:text-[#0c0c0e] data-[state=inactive]:text-[#57534e]"
                            style={{ ['--tw-data-active-bg' as string]: 'linear-gradient(135deg,#f59e0b,#d97706)' }}
                        >
                            <span className="mr-1.5">⚔️</span> vs Player
                        </TabsTrigger>
                        <TabsTrigger
                            value="pvc"
                            className="flex-1 rounded-lg py-2 text-sm font-semibold transition-all duration-200 data-[state=active]:text-[#0c0c0e] data-[state=inactive]:text-[#57534e]"
                        >
                            <span className="mr-1.5">🤖</span> vs Computer
                        </TabsTrigger>
                    </TabsList>

                    {/* ── PvP Tab ── */}
                    <TabsContent value="pvp" className="mt-0 space-y-5">

                        {/* Time controls */}
                        <div>
                            <p className="text-xs font-semibold text-[#57534e] uppercase tracking-wider mb-2.5">
                                Time control
                            </p>
                            <div className="grid grid-cols-4 gap-2">
                                {TIME_CONTROLS.map(tc => (
                                    <button
                                        key={tc.time}
                                        onClick={() => setSelectedTime(tc.time)}
                                        className="flex flex-col items-center py-3 px-2 rounded-xl transition-all duration-200 active:scale-[0.97]"
                                        style={{
                                            background: selectedTime === tc.time
                                                ? 'rgba(245,158,11,0.15)'
                                                : 'rgba(255,255,255,0.03)',
                                            border: selectedTime === tc.time
                                                ? '1px solid rgba(245,158,11,0.4)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                        }}
                                    >
                                        <span
                                            className="text-sm font-bold mb-0.5"
                                            style={{ color: selectedTime === tc.time ? '#fbbf24' : '#a8a29e' }}
                                        >
                                            {tc.label}
                                        </span>
                                        <span
                                            className="text-[10px]"
                                            style={{ color: selectedTime === tc.time ? '#f59e0b' : '#44403c' }}
                                        >
                                            {tc.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Create game */}
                        <button
                            onClick={handleCreateGame}
                            disabled={creating}
                            className="w-full py-3 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all duration-200 hover:opacity-90 active:scale-[0.98] disabled:opacity-60"
                            style={{
                                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                                boxShadow: creating ? 'none' : '0 0 20px rgba(245,158,11,0.25)',
                            }}
                        >
                            {creating
                                ? <span className="flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                    </svg>
                                    Creating...
                                </span>
                                : '♟ Create Game'
                            }
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                            <span className="text-xs text-[#44403c]">or join with a code</span>
                            <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.06)' }} />
                        </div>

                        {/* Join error */}
                        {joinError && (
                            <p className="text-xs text-red-400 text-center">{joinError}</p>
                        )}

                        {/* Join game */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={roomCode}
                                onChange={e => {
                                    setRoomCode(e.target.value.toUpperCase())
                                    setJoinError('')
                                }}
                                placeholder="Room code e.g. ABC123"
                                maxLength={6}
                                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200 tracking-widest"
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
                                onKeyDown={e => { if (e.key === 'Enter') handleJoinGame() }}
                            />
                            <button
                                onClick={handleJoinGame}
                                disabled={joining || roomCode.length < 6}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                            >
                                {joining ? '...' : 'Join'}
                            </button>
                        </div>
                    </TabsContent>

                    {/* ── PvC Tab ── */}
                    <TabsContent value="pvc" className="mt-0 space-y-5">
                        <div>
                            <p className="text-xs font-semibold text-[#57534e] uppercase tracking-wider mb-2.5">
                                Difficulty
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {AI_LEVELS.map(ai => (
                                    <button
                                        key={ai.level}
                                        onClick={() => setSelectedLevel(ai.level)}
                                        className="flex flex-col items-start px-4 py-3 rounded-xl transition-all duration-200 active:scale-[0.97]"
                                        style={{
                                            background: selectedLevel === ai.level
                                                ? 'rgba(245,158,11,0.15)'
                                                : 'rgba(255,255,255,0.03)',
                                            border: selectedLevel === ai.level
                                                ? '1px solid rgba(245,158,11,0.4)'
                                                : '1px solid rgba(255,255,255,0.07)',
                                        }}
                                    >
                                        <span
                                            className="text-sm font-bold mb-0.5"
                                            style={{ color: selectedLevel === ai.level ? '#fbbf24' : '#a8a29e' }}
                                        >
                                            {ai.label}
                                        </span>
                                        <span
                                            className="text-[10px]"
                                            style={{ color: selectedLevel === ai.level ? '#f59e0b' : '#44403c' }}
                                        >
                                            {ai.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handlePlayAI}
                            className="w-full py-3 rounded-xl text-sm font-bold text-[#0c0c0e] transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                            style={{
                                background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                                boxShadow: '0 0 20px rgba(245,158,11,0.25)',
                            }}
                        >
                            🤖 Play vs Computer
                        </button>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>

    )
}

export default QuickPlay