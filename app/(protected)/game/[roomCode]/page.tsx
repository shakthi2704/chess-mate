'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Chess } from 'chess.js'
import { Chessboard } from 'react-chessboard'
import Link from 'next/link'
import { useAblyGame } from '@/hooks/useAblyGame'
import { useSaveGame } from '@/hooks/useSaveGame'
import { PromotionDialog } from '@/components/game/PromotionDialog'
import type { PromotionPiece } from '@/components/game/PromotionDialog'
import PlayerBar from '@/components/game/PlayerBar'
import MoveLog from '@/components/game/MoveLog'
import ChatPanel from '@/components/game/ChatPanel'
import GameControls from '@/components/game/GameControls'
import GameOver from '@/components/game/GameOver'

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

interface MoveRecord {
    san: string
    fen: string
    timeSpentMs: number
}

interface OpponentInfo {
    username: string
    elo: number
}

export default function GamePage() {
    const params = useParams()
    const router = useRouter()
    const roomCode = (params.roomCode as string).toUpperCase()
    const { data: session } = useSession()
    const { saveGame, saved } = useSaveGame()

    const [game, setGame] = useState(new Chess())
    const [playerColor, setPlayerColor] = useState<'white' | 'black' | null>(null)
    const [moves, setMoves] = useState<Move[]>([])
    const [moveRecords, setMoveRecords] = useState<MoveRecord[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [whiteTime, setWhiteTime] = useState(600_000)
    const [blackTime, setBlackTime] = useState(600_000)
    const [gameOver, setGameOver] = useState<{
        result: 'win' | 'loss' | 'draw'
        reason: 'checkmate' | 'resign' | 'timeout' | 'stalemate' | 'draw_agreed'
    } | null>(null)
    const [pendingPromotion, setPendingPromotion] = useState<{
        from: string; to: string
    } | null>(null)
    const [drawOffered, setDrawOffered] = useState(false)
    const [drawOfferSent, setDrawOfferSent] = useState(false)
    const [opponent, setOpponent] = useState<OpponentInfo>({ username: 'Waiting...', elo: 0 })
    const [waiting, setWaiting] = useState(true)
    const [gameId, setGameId] = useState<string | null>(null)

    const gameRef = useRef(game)
    const moveRecordsRef = useRef(moveRecords)
    const gameEndedRef = useRef(false)
    const playerColorRef = useRef(playerColor)
    const waitingRef = useRef(true)

    gameRef.current = game
    moveRecordsRef.current = moveRecords
    playerColorRef.current = playerColor

    const username = session?.user?.username ?? session?.user?.name ?? 'Player'
    const userElo = session?.user?.elo ?? 1200

    // ── Fetch game data on mount ──
    useEffect(() => {
        const fetchGame = async () => {
            const res = await fetch(`/api/games/${roomCode}`)
            const data = await res.json()
            if (!res.ok) { router.push('/dashboard'); return }

            setGameId(data.id)
            setWhiteTime(data.white_time_remaining)
            setBlackTime(data.black_time_remaining)

            if (data.white_player_id === session?.user?.id) {
                setPlayerColor('white')
            } else if (data.black_player_id === session?.user?.id) {
                setPlayerColor('black')
            }

            if (data.fen && data.fen !== 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1') {
                setGame(new Chess(data.fen))
            }

            if (data.status === 'active') {
                waitingRef.current = false
                setWaiting(false)
                if (data.white_player_id === session?.user?.id) {
                    setOpponent({ username: data.black_username ?? 'Opponent', elo: data.black_elo ?? 1200 })
                } else {
                    setOpponent({ username: data.white_username ?? 'Opponent', elo: data.white_elo ?? 1200 })
                }
            }
        }

        if (session?.user?.id) {
            fetchGame()
            const interval = setInterval(async () => {
                if (!waitingRef.current) { clearInterval(interval); return }
                await fetchGame()
            }, 3000)
            return () => clearInterval(interval)
        }
    }, [roomCode, session?.user?.id])

    // ── End game helper ──
    const endGame = useCallback(async (
        result: 'win' | 'loss' | 'draw',
        reason: 'checkmate' | 'resign' | 'timeout' | 'stalemate' | 'draw_agreed',
        opponentId?: string
    ) => {
        if (gameEndedRef.current) return
        gameEndedRef.current = true
        setGameOver({ result, reason })
        await saveGame({
            mode: 'pvp',
            result,
            reason,
            pgn: gameRef.current.pgn(),
            moves: moveRecordsRef.current,
            timeControl: '10+0',
            opponentId,
            playerColor: playerColorRef.current ?? 'white',
        })
    }, [saveGame])

    // ── Timer ──
    useEffect(() => {
        if (gameOver || waiting) return
        const turn = game.turn()
        const interval = setInterval(() => {
            if (turn === 'w') {
                setWhiteTime(t => {
                    if (t <= 1000) { endGame(playerColor === 'white' ? 'loss' : 'win', 'timeout'); return 0 }
                    return t - 1000
                })
            } else {
                setBlackTime(t => {
                    if (t <= 1000) { endGame(playerColor === 'black' ? 'loss' : 'win', 'timeout'); return 0 }
                    return t - 1000
                })
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [game.turn(), gameOver, waiting, playerColor, endGame])

    // ── Apply move to board ──
    const applyMove = useCallback((gameCopy: Chess, san: string, color: 'w' | 'b') => {
        setGame(gameCopy)
        setMoves(prev => [...prev, {
            san,
            moveNumber: Math.ceil((prev.length + 1) / 2),
            color,
        }])
        setMoveRecords(prev => [...prev, {
            san,
            fen: gameCopy.fen(),
            timeSpentMs: 0,
        }])

        if (gameCopy.isCheckmate()) {
            const result = color === (playerColor === 'white' ? 'w' : 'b') ? 'win' : 'loss'
            endGame(result, 'checkmate')
        } else if (gameCopy.isStalemate() || gameCopy.isDraw()) {
            endGame('draw', 'stalemate')
        }
    }, [playerColor, endGame])

    // ── Ably handlers ──
    const handleOpponentMove = useCallback((san: string, fen: string) => {
        const gameCopy = new Chess(fen)
        const color = playerColor === 'white' ? 'b' : 'w'
        applyMove(gameCopy, san, color)
    }, [playerColor, applyMove])

    const handleChat = useCallback((message: string, sender: string) => {
        if (sender === username) return
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender,
            message,
            isMe: false,
            timestamp: new Date().toISOString(),
        }])
    }, [username])

    const handleOpponentResign = useCallback(() => {
        endGame('win', 'resign')
    }, [endGame])

    const handleDrawOffer = useCallback(() => {
        setDrawOffered(true)
    }, [])

    const handleDrawAccept = useCallback(() => {
        endGame('draw', 'draw_agreed')
    }, [endGame])

    const handleDrawDeclined = useCallback(() => {
        setDrawOfferSent(false)
    }, [])

    const handleGameOver = useCallback((result: 'white' | 'black' | 'draw', reason: string) => {
        if (gameEndedRef.current) return
        const myResult = result === 'draw' ? 'draw' : result === playerColor ? 'win' : 'loss'
        endGame(myResult as any, reason as any)
    }, [playerColor, endGame])

    const handlePlayerJoined = useCallback((color: 'white' | 'black', joinedUsername: string) => {
        if (color !== playerColor) {
            setOpponent({ username: joinedUsername, elo: 0 })
            setWaiting(false)
        }
    }, [playerColor])

    // ── useAblyGame ──
    const {
        connected,
        opponentOnline,
        publishMove,
        publishChat,
        publishResign,
        publishDrawOffer,
        publishDrawAccept,
        publishDrawDecline,
    } = useAblyGame({
        roomCode,
        playerColor: playerColor,
        username,
        onMove: handleOpponentMove,
        onChat: handleChat,
        onResign: handleOpponentResign,
        onDrawOffer: handleDrawOffer,
        onDrawAccept: handleDrawAccept,
        onDrawDecline: handleDrawDeclined,
        onGameOver: handleGameOver,
        onPlayerJoined: handlePlayerJoined,
    })

    // ── Player piece drop ──
    const onDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => {
            if (!playerColor || gameOver || waiting) return false

            const currentTurn = game.turn()
            const isMyTurn =
                (playerColor === 'white' && currentTurn === 'w') ||
                (playerColor === 'black' && currentTurn === 'b')

            if (!isMyTurn) return false

            const gameCopy = new Chess(game.fen())
            const boardPiece = gameCopy.get(sourceSquare as any)
            const isPromo =
                boardPiece?.type === 'p' &&
                ((boardPiece.color === 'w' && targetSquare[1] === '8') ||
                    (boardPiece.color === 'b' && targetSquare[1] === '1'))

            if (isPromo) {
                try {
                    const testMove = gameCopy.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
                    if (!testMove) return false
                } catch { return false }
                setPendingPromotion({ from: sourceSquare, to: targetSquare })
                return true
            }

            try {
                const move = gameCopy.move({ from: sourceSquare, to: targetSquare })
                if (!move) return false
                applyMove(gameCopy, move.san, currentTurn)
                publishMove(move.san, gameCopy.fen(), currentTurn === 'w' ? 'black' : 'white')
                return true
            } catch { return false }
        },
        [game, playerColor, gameOver, waiting, applyMove, publishMove]
    )

    // ── Handle promotion ──
    const handlePromotion = useCallback((piece: PromotionPiece) => {
        if (!pendingPromotion) return
        const gameCopy = new Chess(game.fen())
        const currentTurn = gameCopy.turn()
        try {
            const move = gameCopy.move({
                from: pendingPromotion.from,
                to: pendingPromotion.to,
                promotion: piece,
            })
            setPendingPromotion(null)
            if (move) {
                applyMove(gameCopy, move.san, currentTurn)
                publishMove(move.san, gameCopy.fen(), currentTurn === 'w' ? 'black' : 'white')
            }
        } catch { setPendingPromotion(null) }
    }, [pendingPromotion, game, applyMove, publishMove])

    // ── Handle resign ──
    const handleResign = () => {
        publishResign()
        endGame('loss', 'resign')
    }

    // ── Handle draw ──
    const handleOfferDraw = () => {
        setDrawOfferSent(true)
        publishDrawOffer()
    }

    const handleAcceptDraw = () => {
        publishDrawAccept()
        endGame('draw', 'draw_agreed')
    }

    const handleDeclineDraw = () => {
        setDrawOffered(false)
        publishDrawDecline()
    }

    // ── Handle chat ──
    const handleSendMessage = (message: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: username,
            message,
            isMe: true,
            timestamp: new Date().toISOString(),
        }])
        publishChat(message)
    }

    // ── Play again ──
    const handlePlayAgain = () => {
        router.push('/dashboard')
    }

    const currentTurn = game.turn()
    const isMyTurn =
        playerColor === null ? false :
            (playerColor === 'white' && currentTurn === 'w') ||
            (playerColor === 'black' && currentTurn === 'b')

    const whitePlayer = playerColor === 'white' ? { username, elo: userElo } : opponent
    const blackPlayer = playerColor === 'black' ? { username, elo: userElo } : opponent

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
                style={{
                    borderBottom: '1px solid rgba(245,158,11,0.1)',
                    background: 'rgba(12,12,14,0.92)',
                    backdropFilter: 'blur(14px)',
                }}
            >
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-base font-bold"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0c0c0e' }}
                    >♟</div>
                    <span className="text-[#fef3c7] font-bold tracking-tight">ChessMate</span>
                </Link>

                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: connected ? '#22c55e' : '#f87171', animation: 'pulse 2s infinite' }}
                        />
                        <span className="text-[#57534e]">{connected ? 'Connected' : 'Connecting...'}</span>
                    </div>

                    <div
                        className="px-3 py-1 rounded-lg text-xs font-bold text-[#fbbf24]"
                        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                        Room: {roomCode}
                    </div>

                    <div className="flex items-center gap-1.5">
                        <span
                            className="w-1.5 h-1.5 rounded-full inline-block"
                            style={{ background: opponentOnline ? '#22c55e' : '#44403c' }}
                        />
                        <span className="text-[#57534e]">
                            {opponentOnline ? 'Opponent online' : 'Waiting for opponent...'}
                        </span>
                    </div>
                </div>

                <Link href="/dashboard" className="text-xs text-[#44403c] hover:text-[#57534e] transition-colors">
                    ← Dashboard
                </Link>
            </nav>

            {/* Waiting overlay */}
            {waiting && (
                <div
                    className="fixed inset-0 z-40 flex items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
                >
                    <div
                        className="rounded-2xl p-8 text-center max-w-sm w-full mx-4"
                        style={{
                            background: 'rgba(18,16,12,0.98)',
                            border: '1px solid rgba(245,158,11,0.2)',
                            boxShadow: '0 0 60px rgba(245,158,11,0.1)',
                        }}
                    >
                        <div className="text-4xl mb-4">♟</div>
                        <h2 className="text-lg font-bold text-[#fef3c7] mb-2">Waiting for opponent</h2>
                        <p className="text-sm text-[#57534e] mb-6">Share this room code with your opponent</p>
                        <div
                            className="text-3xl font-bold text-[#fbbf24] tracking-[0.3em] py-4 px-6 rounded-xl mb-4"
                            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}
                        >
                            {roomCode}
                        </div>
                        <button
                            onClick={() => navigator.clipboard.writeText(roomCode)}
                            className="text-xs text-[#f59e0b] hover:text-[#fbbf24] transition-colors"
                        >
                            Click to copy
                        </button>
                    </div>
                </div>
            )}

            {/* Main layout */}
            <main className="relative z-10 max-w-6xl mx-auto px-4 py-6">
                <div className="flex flex-col lg:flex-row gap-4 items-start">

                    {/* Board column */}
                    <div className="w-full lg:flex-1 flex flex-col gap-3">
                        <PlayerBar
                            username={playerColor === 'white' ? blackPlayer.username : whitePlayer.username}
                            elo={playerColor === 'white' ? blackPlayer.elo : whitePlayer.elo}
                            timeMs={playerColor === 'white' ? blackTime : whiteTime}
                            isActive={playerColor === 'white' ? currentTurn === 'b' : currentTurn === 'w'}
                            isTop
                        />

                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{ border: '1px solid rgba(245,158,11,0.15)', boxShadow: '0 0 40px rgba(245,158,11,0.08)' }}
                        >
                            <Chessboard
                                options={{
                                    position: game.fen(),
                                    boardOrientation: playerColor ?? 'white',
                                    animationDurationInMs: 150,
                                    allowDragging: !gameOver && !waiting,
                                    boardStyle: { borderRadius: '0' },
                                    darkSquareStyle: { backgroundColor: '#2a1f00' },
                                    lightSquareStyle: { backgroundColor: '#3d2f00' },
                                    dropSquareStyle: { boxShadow: 'inset 0 0 1px 4px rgba(245,158,11,0.6)' },
                                    onPieceDrop: ({ sourceSquare, targetSquare }: {
                                        sourceSquare: string
                                        targetSquare: string | null
                                        piece: any
                                    }) => {
                                        if (!targetSquare) return false
                                        return onDrop(sourceSquare, targetSquare)
                                    },
                                }}
                            />
                        </div>

                        <PlayerBar
                            username={playerColor === 'white' ? whitePlayer.username : blackPlayer.username}
                            elo={playerColor === 'white' ? whitePlayer.elo : blackPlayer.elo}
                            timeMs={playerColor === 'white' ? whiteTime : blackTime}
                            isActive={isMyTurn}
                        />

                        <GameControls
                            onResign={handleResign}
                            onOfferDraw={handleOfferDraw}
                            onAcceptDraw={handleAcceptDraw}
                            onDeclineDraw={handleDeclineDraw}
                            drawOffered={drawOffered}
                            drawOfferSent={drawOfferSent}
                        />
                    </div>

                    {/* Sidebar */}
                    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-3">
                        <div style={{ height: 320 }}>
                            <MoveLog moves={moves} />
                        </div>
                        <ChatPanel
                            messages={messages}
                            onSend={handleSendMessage}
                            disabled={!!gameOver || waiting}
                        />
                    </div>
                </div>
            </main>

            {pendingPromotion && (
                <PromotionDialog
                    color={playerColor === 'white' ? 'w' : 'b'}
                    onSelect={handlePromotion}
                />
            )}

            {gameOver && (
                <GameOver
                    result={gameOver.result}
                    reason={gameOver.reason}
                    eloChange={saved?.eloChange ?? 0}
                    eloBefore={saved?.oldElo ?? userElo}
                    eloAfter={saved?.newElo ?? userElo}
                    opponentName={opponent.username}
                    onPlayAgain={handlePlayAgain}
                    gameId={saved?.gameId ?? roomCode}
                />
            )}

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
        </div>
    )
}