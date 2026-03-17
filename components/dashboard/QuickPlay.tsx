'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const TIME_CONTROLS = [
    { label: 'Bullet', time: '1+0', desc: '1 min' },
    { label: 'Blitz', time: '5+0', desc: '5 min' },
    { label: 'Rapid', time: '10+0', desc: '10 min' },
    { label: 'Classic', time: '30+0', desc: '30 min' },
]

const AI_LEVELS = [
    { label: 'Easy', level: 2, desc: 'Beginner friendly' },
    { label: 'Medium', level: 6, desc: 'Casual player' },
    { label: 'Hard', level: 12, desc: 'Club player' },
    { label: 'Master', level: 20, desc: 'Grandmaster' },
]

const QuickPlay = () => {

    const router = useRouter()
    const [selectedTime, setSelectedTime] = useState('5+0')
    const [selectedLevel, setSelectedLevel] = useState(6)
    const [roomCode, setRoomCode] = useState('')
    const [creating, setCreating] = useState(false)
    const [joining, setJoining] = useState(false)

    const handleCreateGame = async () => {
        setCreating(true)
        // TODO: call API to create a room in Supabase
        // const { data } = await fetch('/api/games', { method: 'POST', body: JSON.stringify({ timeControl: selectedTime, mode: 'pvp' }) })
        // router.push(`/game/${data.roomCode}`)
        setTimeout(() => {
            setCreating(false)
            router.push('/game/ABC123') // placeholder
        }, 1000)
    }

    const handleJoinGame = async () => {
        if (!roomCode.trim()) return
        setJoining(true)
        // TODO: validate room code and join
        // router.push(`/game/${roomCode.toUpperCase()}`)
        setTimeout(() => {
            setJoining(false)
            router.push(`/game/${roomCode.toUpperCase()}`)
        }, 800)
    }

    const handlePlayAI = () => {
        // TODO: start PvC game with selected level
        // router.push(`/game/ai?level=${selectedLevel}`)
        router.push(`/game/ai?level=${selectedLevel}`)
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
                            style={{
                                ['--tw-data-active-bg' as string]: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            }}
                            onMouseEnter={() => { }}
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
                                        <span className="text-[10px]" style={{ color: selectedTime === tc.time ? '#f59e0b' : '#44403c' }}>
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
                                    Creating game...
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

                        {/* Join game */}
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={roomCode}
                                onChange={e => setRoomCode(e.target.value.toUpperCase())}
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
                            />
                            <button
                                onClick={handleJoinGame}
                                disabled={joining || roomCode.length < 6}
                                className="px-4 py-2.5 rounded-xl text-sm font-bold text-[#fef3c7] transition-all duration-200 hover:bg-white/[0.08] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                                style={{ border: '1px solid rgba(245,158,11,0.3)', color: '#f59e0b' }}
                            >
                                {joining ? '...' : 'Join'}
                            </button>
                        </div>
                    </TabsContent>

                    {/* ── PvC Tab ── */}
                    <TabsContent value="pvc" className="mt-0 space-y-5">

                        {/* Difficulty */}
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
                                        <span className="text-[10px]" style={{ color: selectedLevel === ai.level ? '#f59e0b' : '#44403c' }}>
                                            {ai.desc}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Play vs AI button */}
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