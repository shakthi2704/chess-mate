
'use client'

import { useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface Move {
    san: string       // e.g. "Nf3", "e4", "O-O"
    moveNumber: number
    color: 'w' | 'b'
}

interface MoveLogProps {
    moves: Move[]
}

const MoveLog = ({ moves }: MoveLogProps) => {
    const bottomRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [moves])

    // Group moves into pairs [ { moveNumber, white, black } ]
    const pairs: { moveNumber: number; white?: string; black?: string }[] = []
    moves.forEach(move => {
        if (move.color === 'w') {
            pairs.push({ moveNumber: move.moveNumber, white: move.san })
        } else {
            const last = pairs[pairs.length - 1]
            if (last && last.moveNumber === move.moveNumber) {
                last.black = move.san
            } else {
                pairs.push({ moveNumber: move.moveNumber, black: move.san })
            }
        }
    })


    const lastMove = moves[moves.length - 1]

    return (
        <Card
            className="flex flex-col rounded-2xl border-0 h-full"
            style={{
                background: 'rgba(18,16,12,0.85)',
                border: '1px solid rgba(245,158,11,0.15)',
            }}
        >
            <CardHeader className="pb-2 pt-4 px-4 flex-shrink-0">
                <CardTitle className="text-sm font-bold text-[#fef3c7]">
                    Move history
                </CardTitle>
            </CardHeader>

            <CardContent className="px-3 pb-3 flex-1 overflow-hidden">
                {moves.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-xs text-[#44403c] text-center">
                            No moves yet.<br />Make your first move!
                        </p>
                    </div>
                ) : (
                    <div className="overflow-y-auto h-full pr-1" style={{ maxHeight: '100%' }}>
                        {/* Header row */}
                        <div
                            className="grid text-[10px] font-bold uppercase tracking-wider text-[#44403c] px-2 py-1.5 mb-1 sticky top-0"
                            style={{
                                gridTemplateColumns: '32px 1fr 1fr',
                                background: 'rgba(18,16,12,0.95)',
                            }}
                        >
                            <span>#</span>
                            <span>White</span>
                            <span>Black</span>
                        </div>

                        {/* Move rows */}
                        {pairs.map((pair, i) => {
                            const isLastWhite = lastMove?.color === 'w' && lastMove?.moveNumber === pair.moveNumber
                            const isLastBlack = lastMove?.color === 'b' && lastMove?.moveNumber === pair.moveNumber

                            return (
                                <div
                                    key={i}
                                    className="grid items-center px-2 py-1.5 rounded-lg mb-0.5"
                                    style={{
                                        gridTemplateColumns: '32px 1fr 1fr',
                                        background: i % 2 === 0 ? 'rgba(255,255,255,0.02)' : 'transparent',
                                    }}
                                >
                                    <span className="text-xs text-[#44403c] font-medium">
                                        {pair.moveNumber}.
                                    </span>
                                    <span
                                        className="text-sm font-semibold px-1.5 py-0.5 rounded transition-all"
                                        style={{
                                            color: isLastWhite ? '#0c0c0e' : '#fef3c7',
                                            background: isLastWhite
                                                ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                                                : 'transparent',
                                        }}
                                    >
                                        {pair.white ?? ''}
                                    </span>
                                    <span
                                        className="text-sm font-semibold px-1.5 py-0.5 rounded transition-all"
                                        style={{
                                            color: isLastBlack ? '#0c0c0e' : '#a8a29e',
                                            background: isLastBlack
                                                ? 'linear-gradient(135deg,#f59e0b,#d97706)'
                                                : 'transparent',
                                        }}
                                    >
                                        {pair.black ?? ''}
                                    </span>
                                </div>
                            )
                        })}
                        <div ref={bottomRef} />
                    </div>
                )}
            </CardContent>
        </Card>

    )
}

export default MoveLog