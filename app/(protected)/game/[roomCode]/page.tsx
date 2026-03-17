'use client'

import { useState, useCallback, useEffect } from 'react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import PlayerBar from '@/components/game/PlayerBar'
import MoveLog from '@/components/game/MoveLog'
import ChatPanel from '@/components/game/ChatPanel'
import GameControls from '@/components/game/GameControls'
import GameOver from '@/components/game/GameOver'
import Link from 'next/link'

// TODO: get real data from Supabase + route params
const MOCK_GAME = {
    id: 'ABC123',
    mode: 'pvp' as 'pvp' | 'pvc',
    timeControl: 600_000, // 10 minutes in ms
    white: { username: 'You', elo: 1247, avatarUrl: '', isMe: true },
    black: { username: 'GrandKnight', elo: 1482, avatarUrl: '', isMe: false },
}

interface Move {
    san: string
    moveNumber: number
    color: 'w' | 'b'
}

interface ChatMessage {
    id: string
    sender: string
    message: string
    isMe: boolean
    timestamp: string
}

export default function GamePage() {
    const [game, setGame] = useState(new Chess())
    const [moves, setMoves] = useState<Move[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([
        { id: '1', sender: 'GrandKnight', message: 'Good luck! 👋', isMe: false, timestamp: '' },
    ])
    const [whiteTime, setWhiteTime] = useState(MOCK_GAME.timeControl)
    const [blackTime, setBlackTime] = useState(MOCK_GAME.timeControl)
    const [drawOffered, setDrawOffered] = useState(false)
    const [drawOfferSent, setDrawOfferSent] = useState(false)
    const [gameOver, setGameOver] = useState<{
        result: 'win' | 'loss' | 'draw'
        reason: 'checkmate' | 'resign' | 'timeout' | 'draw_agreed' | 'stalemate'
    } | null>(null)

    const playerIsWhite = true // TODO: get from game room data
    const currentTurn = game.turn() // 'w' or 'b'
    const isMyTurn = (playerIsWhite && currentTurn === 'w') || (!playerIsWhite && currentTurn === 'b')

    // ── Timer countdown ──
    useEffect(() => {
        if (gameOver) return
        const interval = setInterval(() => {
            if (currentTurn === 'w') {
                setWhiteTime(t => {
                    if (t <= 1000) { setGameOver({ result: playerIsWhite ? 'loss' : 'win', reason: 'timeout' }); return 0 }
                    return t - 1000
                })
            } else {
                setBlackTime(t => {
                    if (t <= 1000) { setGameOver({ result: playerIsWhite ? 'win' : 'loss', reason: 'timeout' }); return 0 }
                    return t - 1000
                })
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [currentTurn, gameOver, playerIsWhite])

    // ── Handle piece drop (PvP) ──
    const onDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => {
            if (!isMyTurn || gameOver) return false

            const gameCopy = new Chess(game.fen())
            const move = gameCopy.move({
                from: sourceSquare,
                to: targetSquare,
                promotion: 'q', // auto-promote to queen
            })

            if (!move) return false // illegal move

            setGame(gameCopy)
            setMoves(prev => [...prev, {
                san: move.san,
                moveNumber: Math.ceil((prev.length + 1) / 2),
                color: move.color,
            }])

            // TODO: publish move to Ably channel for PvP
            // ablyChannel.publish('move', { san: move.san, fen: gameCopy.fen() })

            // TODO: save move to Supabase
            // await fetch('/api/moves', { method: 'POST', body: JSON.stringify({ gameId, san: move.san, fen: gameCopy.fen() }) })

            // Check game over
            if (gameCopy.isCheckmate()) {
                setGameOver({ result: 'win', reason: 'checkmate' })
            } else if (gameCopy.isStalemate() || gameCopy.isDraw()) {
                setGameOver({ result: 'draw', reason: 'stalemate' })
            }

            return true
        },
        [game, isMyTurn, gameOver]
    )

    // ── Handle resign ──
    const handleResign = () => {
        setGameOver({ result: 'loss', reason: 'resign' })
        // TODO: notify via Ably + update Supabase
    }

    // ── Handle draw offer ──
    const handleOfferDraw = () => {
        setDrawOfferSent(true)
        // TODO: publish draw offer via Ably
        // ablyChannel.publish('draw_offer', {})
    }

    const handleAcceptDraw = () => {
        setGameOver({ result: 'draw', reason: 'draw_agreed' })
        // TODO: notify via Ably + update Supabase
    }

    // ── Handle chat ──
    const handleSendMessage = (message: string) => {
        const newMsg: ChatMessage = {
            id: Date.now().toString(),
            sender: 'You',
            message,
            isMe: true,
            timestamp: new Date().toISOString(),
        }
        setMessages(prev => [...prev, newMsg])
        // TODO: publish to Ably chat channel
        // ablyChannel.publish('chat', { message, sender: username })
        // TODO: save to Supabase chat_messages table
    }

    // ── Play again ──
    const handlePlayAgain = () => {
        setGame(new Chess())
        setMoves([])
        setWhiteTime(MOCK_GAME.timeControl)
        setBlackTime(MOCK_GAME.timeControl)
        setGameOver(null)
        setDrawOffered(false)
        setDrawOfferSent(false)
    }

    // Board orientation
    const boardOrientation = playerIsWhite ? 'white' : 'black'

    // Opponent and player based on orientation
    const opponent = playerIsWhite ? MOCK_GAME.black : MOCK_GAME.white
    const player = playerIsWhite ? MOCK_GAME.white : MOCK_GAME.black

    return (
        <div className="min-h-screen bg-[#0c0c0e] text-[#e7e5e4]">

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
                    style={{ background: 'radial-gradient(ellipse at center,rgba(245,158,11,0.05) 0%,transparent 70%)' }}
                />
            </div>

            {/* Navbar */}
            <nav
                className="relative z-10 px-6 py-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid rgba(245,158,11,0.1)', background: 'rgba(12,12,14,0.92)', backdropFilter: 'blur(14px)' }}
            >
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0c0c0e' }}
                    >♟</div>
                    <span className="text-[#fef3c7] font-bold tracking-tight">ChessMate</span>
                </Link>

                <div className="flex items-center gap-2 text-xs text-[#57534e]">
                    <span
                        className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block"
                        style={{ animation: 'pulse 2s infinite' }}
                    />
                    {MOCK_GAME.mode === 'pvp' ? 'Live · Room ABC123' : 'vs Stockfish'}
                </div>

                <Link
                    href="/dashboard"
                    className="text-xs text-[#44403c] hover:text-[#57534e] transition-colors"
                >
                    ← Dashboard
                </Link>
            </nav>

            {/* Main layout */}
            <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* ── Left — board column ── */}
                    <div className="w-full lg:flex-1 flex flex-col gap-3">

                        {/* Opponent bar (top) */}
                        <PlayerBar
                            username={opponent.username}
                            avatarUrl={opponent.avatarUrl}
                            elo={opponent.elo}
                            timeMs={playerIsWhite ? blackTime : whiteTime}
                            isActive={currentTurn === (playerIsWhite ? 'b' : 'w')}
                            isTop
                        />

                        {/* Chess board */}
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{ border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 0 40px rgba(245,158,11,0.08)' }}
                        >
                            <Chessboard
                                {...({
                                    position: game.fen(),
                                    onPieceDrop: onDrop,
                                    boardOrientation: boardOrientation as 'white' | 'black',
                                    animationDuration: 150,
                                    customBoardStyle: { borderRadius: '0' },
                                    customDarkSquareStyle: { backgroundColor: '#2a1f00' },
                                    customLightSquareStyle: { backgroundColor: '#3d2f00' },
                                    customDropSquareStyle: { boxShadow: 'inset 0 0 1px 4px rgba(245,158,11,0.6)' },
                                    customArrowColor: 'rgba(245,158,11,0.7)',
                                } as any)}
                            />
                        </div>

                        {/* Player bar (bottom) */}
                        <PlayerBar
                            username={player.username}
                            avatarUrl={player.avatarUrl}
                            elo={player.elo}
                            timeMs={playerIsWhite ? whiteTime : blackTime}
                            isActive={currentTurn === (playerIsWhite ? 'w' : 'b')}
                        />

                        {/* Game controls */}
                        <GameControls
                            onResign={handleResign}
                            onOfferDraw={handleOfferDraw}
                            onAcceptDraw={handleAcceptDraw}
                            drawOffered={drawOffered}
                            drawOfferSent={drawOfferSent}
                            gameOver={!!gameOver}
                        />
                    </div>

                    {/* ── Right — sidebar ── */}
                    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-3">

                        {/* Move log */}
                        <div style={{ height: 320 }}>
                            <MoveLog moves={moves} />
                        </div>

                        {/* Chat */}
                        <ChatPanel
                            messages={messages}
                            onSend={handleSendMessage}
                            disabled={!!gameOver}
                        />
                    </div>
                </div>
            </main>

            {/* Game over overlay */}
            {gameOver && (
                <GameOver
                    result={gameOver.result}
                    reason={gameOver.reason}
                    eloChange={gameOver.result === 'win' ? +23 : gameOver.result === 'loss' ? -23 : 0}
                    eloBefore={1247}
                    eloAfter={gameOver.result === 'win' ? 1270 : gameOver.result === 'loss' ? 1224 : 1247}
                    opponentName={opponent.username}
                    onPlayAgain={handlePlayAgain}
                    gameId={MOCK_GAME.id}
                />
            )}

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
        </div>
    )
}