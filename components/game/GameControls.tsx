'use client'

import { useState } from 'react'

interface GameControlsProps {
    onResign: () => void
    onOfferDraw: () => void
    onAcceptDraw?: () => void
    drawOffered?: boolean       // true when opponent has offered a draw
    drawOfferSent?: boolean     // true when you already offered a draw
    gameOver?: boolean
}
const GameControls = ({
    onResign,
    onOfferDraw,
    onAcceptDraw,
    drawOffered = false,
    drawOfferSent = false,
    gameOver = false,
}: GameControlsProps) => {


    const [confirmResign, setConfirmResign] = useState(false)


    const handleResignClick = () => {
        if (confirmResign) {
            onResign()
            setConfirmResign(false)
        } else {
            setConfirmResign(true)
            // Auto cancel confirm after 3 seconds
            setTimeout(() => setConfirmResign(false), 3000)
        }
    }

    if (gameOver) return null

    return (
        <div className="flex flex-col gap-2">
            {/* Draw offered by opponent */}
            {drawOffered && !drawOfferSent && (
                <div
                    className="flex items-center justify-between px-4 py-3 rounded-xl"
                    style={{
                        background: 'rgba(245,158,11,0.1)',
                        border: '1px solid rgba(245,158,11,0.3)',
                    }}
                >
                    <p className="text-xs font-semibold text-[#fbbf24]">
                        Opponent offers a draw
                    </p>
                    <div className="flex gap-2">
                        <button
                            onClick={onAcceptDraw}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:opacity-90"
                            style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0c0c0e' }}
                        >
                            Accept
                        </button>
                        <button
                            className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:bg-white/[0.07]"
                            style={{
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                color: '#a8a29e',
                            }}
                        >
                            Decline
                        </button>
                    </div>
                </div>
            )}

            {/* Control buttons */}
            <div className="grid grid-cols-2 gap-2">
                {/* Offer draw */}
                <button
                    onClick={onOfferDraw}
                    disabled={drawOfferSent || drawOffered}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 hover:bg-white/[0.06] active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(255,255,255,0.1)',
                        color: drawOfferSent ? '#44403c' : '#a8a29e',
                    }}
                >
                    <span>🤝</span>
                    {drawOfferSent ? 'Draw offered' : 'Offer draw'}
                </button>

                {/* Resign */}
                <button
                    onClick={handleResignClick}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97]"
                    style={{
                        background: confirmResign
                            ? 'rgba(239,68,68,0.15)'
                            : 'rgba(255,255,255,0.04)',
                        border: confirmResign
                            ? '1px solid rgba(239,68,68,0.4)'
                            : '1px solid rgba(255,255,255,0.1)',
                        color: confirmResign ? '#f87171' : '#a8a29e',
                    }}
                >
                    <span>🏳️</span>
                    {confirmResign ? 'Confirm resign' : 'Resign'}
                </button>
            </div>

            {confirmResign && (
                <p className="text-[10px] text-center text-[#44403c]">
                    Click resign again to confirm · Auto cancels in 3s
                </p>
            )}
        </div>
    )
}

export default GameControls