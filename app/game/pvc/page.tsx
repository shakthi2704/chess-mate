'use client'
import { PromotionDialog } from '@/components/game/PromotionDialog'
import { useStockfish } from '@/hooks/useStockfish'
import { Chess } from 'chess.js'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useState, useCallback, useEffect, useRef } from 'react'
import { Chessboard } from 'react-chessboard'
import type { PromotionPiece } from '@/components/game/PromotionDialog'
import PlayerBar from '@/components/game/PlayerBar'
import MoveLog from '@/components/game/MoveLog'
import ChatPanel from '@/components/game/ChatPanel'
import GameControls from '@/components/game/GameControls'
import GameOver from '@/components/game/GameOver'




// TODO: replace with real session data
const PLAYER = { username: 'You', elo: 1247, avatarUrl: '' }
const AI = { username: 'Stockfish', elo: 0, avatarUrl: '' }

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

const AI_MESSAGES: Record<number, string[]> = {
    2: ['Good luck!', 'Let\'s play!'],
    6: ['Ready when you are.', 'Good luck!'],
    12: ['Prepare yourself.', 'Let\'s begin.'],
    20: ['You will need more than luck.', 'Shall we?'],
}

export default function PvcGamePage() {
    const searchParams = useSearchParams()
    const difficulty = Number(searchParams.get('level') ?? 6)
    const timeControl = Number(searchParams.get('time') ?? 600_000)

    const [game, setGame] = useState(new Chess())
    const [moves, setMoves] = useState<Move[]>([])
    const [messages, setMessages] = useState<ChatMessage[]>([])
    const [playerTime, setPlayerTime] = useState(timeControl)
    const [aiTime, setAiTime] = useState(timeControl)
    const [gameOver, setGameOver] = useState<{
        result: 'win' | 'loss' | 'draw'
        reason: 'checkmate' | 'resign' | 'timeout' | 'stalemate'
    } | null>(null)
    const [pendingPromotion, setPendingPromotion] = useState<{
        from: string; to: string
    } | null>(null)
    const [aiThinking, setAiThinking] = useState(false)

    const gameRef = useRef(game)
    gameRef.current = game

    const { getBestMove } = useStockfish(difficulty)

    // Player is always white vs AI
    const playerColor = 'w'
    const currentTurn = game.turn()
    const isPlayerTurn = currentTurn === playerColor

    // ── AI greeting on mount ──
    useEffect(() => {
        const msgs = AI_MESSAGES[difficulty] ?? AI_MESSAGES[6]
        const greeting = msgs[Math.floor(Math.random() * msgs.length)]
        setMessages([{
            id: '1',
            sender: 'Stockfish',
            message: greeting,
            isMe: false,
            timestamp: new Date().toISOString(),
        }])
    }, [difficulty])

    // ── Timer countdown ──
    useEffect(() => {
        if (gameOver || aiThinking) return
        const interval = setInterval(() => {
            if (currentTurn === playerColor) {
                setPlayerTime(t => {
                    if (t <= 1000) {
                        setGameOver({ result: 'loss', reason: 'timeout' })
                        return 0
                    }
                    return t - 1000
                })
            } else {
                setAiTime(t => Math.max(0, t - 1000))
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [currentTurn, gameOver, aiThinking, playerColor])

    // ── Apply a move to the game ──
    const applyMove = useCallback((
        gameCopy: Chess,
        san: string,
        color: 'w' | 'b'
    ) => {
        setGame(gameCopy)
        setMoves(prev => [...prev, {
            san,
            moveNumber: Math.ceil((prev.length + 1) / 2),
            color,
        }])

        if (gameCopy.isCheckmate()) {
            setGameOver({
                result: color === playerColor ? 'win' : 'loss',
                reason: 'checkmate',
            })
        } else if (gameCopy.isStalemate() || gameCopy.isDraw()) {
            setGameOver({ result: 'draw', reason: 'stalemate' })
        }
    }, [playerColor])

    // ── AI move ──
    const makeAiMove = useCallback(async (currentGame: Chess) => {
        setAiThinking(true)

        // small delay so it feels natural
        await new Promise(r => setTimeout(r, 500))

        const bestMove = await getBestMove(currentGame.fen())

        if (!bestMove) {
            setAiThinking(false)
            return
        }

        const gameCopy = new Chess(currentGame.fen())
        const from = bestMove.slice(0, 2)
        const to = bestMove.slice(2, 4)
        const promo = bestMove.slice(4) || 'q'

        const move = gameCopy.move({ from, to, promotion: promo })
        if (move) applyMove(gameCopy, move.san, 'b')

        setAiThinking(false)
    }, [getBestMove, applyMove])

    // ── Watch for AI turn ──
    useEffect(() => {
        if (!isPlayerTurn && !gameOver && !aiThinking) {
            makeAiMove(gameRef.current)
        }
    }, [isPlayerTurn, gameOver, aiThinking, makeAiMove])


    // ── Player piece drop ──
    const onDrop = useCallback(
        (sourceSquare: string, targetSquare: string) => {
            if (!isPlayerTurn || gameOver || aiThinking) return false

            const gameCopy = new Chess(game.fen())
            const boardPiece = gameCopy.get(sourceSquare as any)
            const isPromo =
                boardPiece?.type === 'p' &&
                ((boardPiece.color === 'w' && targetSquare[1] === '8') ||
                    (boardPiece.color === 'b' && targetSquare[1] === '1'))

            if (isPromo) {
                try {
                    const testMove = gameCopy.move({
                        from: sourceSquare, to: targetSquare, promotion: 'q',
                    })
                    if (!testMove) return false
                } catch {
                    return false
                }
                setPendingPromotion({ from: sourceSquare, to: targetSquare })
                return true
            }

            try {
                const move = gameCopy.move({ from: sourceSquare, to: targetSquare })
                if (!move) return false
                applyMove(gameCopy, move.san, 'w')
                return true
            } catch {
                return false
            }
        },
        [game, isPlayerTurn, gameOver, aiThinking, applyMove]
    )
    // ── Handle promotion selection ──
    const handlePromotion = useCallback((piece: PromotionPiece) => {
        if (!pendingPromotion) return

        const gameCopy = new Chess(game.fen())
        const move = gameCopy.move({
            from: pendingPromotion.from,
            to: pendingPromotion.to,
            promotion: piece,
        })

        setPendingPromotion(null)
        if (move) applyMove(gameCopy, move.san, 'w')
    }, [pendingPromotion, game, applyMove])

    // ── Handle resign ──
    const handleResign = () => {
        setGameOver({ result: 'loss', reason: 'resign' })
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'Stockfish',
            message: 'Good game!',
            isMe: false,
            timestamp: new Date().toISOString(),
        }])
    }

    // ── Handle chat ──
    const handleSendMessage = (message: string) => {
        setMessages(prev => [...prev, {
            id: Date.now().toString(),
            sender: 'You',
            message,
            isMe: true,
            timestamp: new Date().toISOString(),
        }])
    }

    // ── Play again ──
    const handlePlayAgain = () => {
        const newGame = new Chess()
        setGame(newGame)
        setMoves([])
        setPlayerTime(timeControl)
        setAiTime(timeControl)
        setGameOver(null)
        setAiThinking(false)
        setPendingPromotion(null)
        setMessages([{
            id: '1',
            sender: 'Stockfish',
            message: 'Ready for a rematch!',
            isMe: false,
            timestamp: new Date().toISOString(),
        }])
    }

    const difficultyLabel: Record<number, string> = {
        2: 'Easy', 6: 'Medium', 12: 'Hard', 20: 'Master',
    }


    return (
        <div className="min-h-screen bg-[#0c0c0e] text-[#e7e5e4]">

            {/* Background glow */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px]"
                    style={{
                        background:
                            'radial-gradient(ellipse at center,rgba(245,158,11,0.05) 0%,transparent 70%)',
                    }}
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
                        style={{
                            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            color: '#0c0c0e',
                        }}
                    >♟</div>
                    <span className="text-[#fef3c7] font-bold tracking-tight">
                        ChessMate
                    </span>
                </Link>

                <div className="flex items-center gap-2 text-xs text-[#57534e]">
                    <span
                        className="w-1.5 h-1.5 rounded-full inline-block"
                        style={{
                            background: aiThinking ? '#f59e0b' : '#22c55e',
                            animation: 'pulse 2s infinite',
                        }}
                    />
                    {aiThinking
                        ? `Stockfish is thinking...`
                        : `vs Stockfish · ${difficultyLabel[difficulty] ?? 'Medium'}`}
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

                        {/* AI bar (top) */}
                        <PlayerBar
                            username={`Stockfish (${difficultyLabel[difficulty] ?? 'Medium'})`}
                            elo={0}
                            timeMs={aiTime}
                            isActive={!isPlayerTurn && !gameOver}
                            isTop
                        />

                        {/* Chess board */}
                        <div
                            className="rounded-2xl overflow-hidden"
                            style={{
                                border: '1px solid rgba(245,158,11,0.15)',
                                boxShadow: '0 0 40px rgba(245,158,11,0.08)',
                            }}
                        >
                            <Chessboard
                                options={{
                                    position: game.fen(),
                                    boardOrientation: 'white',
                                    animationDurationInMs: 150,
                                    allowDragging: true,
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

                        {/* Player bar (bottom) */}
                        <PlayerBar
                            username={PLAYER.username}
                            avatarUrl={PLAYER.avatarUrl}
                            elo={PLAYER.elo}
                            timeMs={playerTime}
                            isActive={isPlayerTurn && !gameOver}
                        />

                        {/* Game controls */}
                        <GameControls
                            onResign={handleResign}
                            onOfferDraw={() => { }}
                            gameOver={!!gameOver}
                        />
                    </div>

                    {/* ── Right — sidebar ── */}
                    <div className="w-full lg:w-72 xl:w-80 flex flex-col gap-3">
                        <div style={{ height: 320 }}>
                            <MoveLog moves={moves} />
                        </div>
                        <ChatPanel
                            messages={messages}
                            onSend={handleSendMessage}
                            disabled={!!gameOver}
                        />
                    </div>
                </div>
            </main>

            {/* Promotion dialog */}
            {pendingPromotion && (
                <PromotionDialog
                    color="w"
                    onSelect={handlePromotion}
                />
            )}

            {/* Game over overlay */}
            {gameOver && (
                <GameOver
                    result={gameOver.result}
                    reason={gameOver.reason}
                    eloChange={gameOver.result === 'win' ? +15 : gameOver.result === 'loss' ? -15 : 0}
                    eloBefore={PLAYER.elo}
                    eloAfter={gameOver.result === 'win'
                        ? PLAYER.elo + 15
                        : gameOver.result === 'loss'
                            ? PLAYER.elo - 15
                            : PLAYER.elo}
                    opponentName={`Stockfish (${difficultyLabel[difficulty]})`}
                    onPlayAgain={handlePlayAgain}
                    gameId="pvc"
                />
            )}

            <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
        </div>
    )
}
