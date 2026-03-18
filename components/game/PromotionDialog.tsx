'use client'

type PromotionPiece = 'q' | 'r' | 'b' | 'n'

interface Props {
    color: 'w' | 'b'
    onSelect: (piece: PromotionPiece) => void
}

const PIECES: { piece: PromotionPiece; label: string; white: string; black: string }[] = [
    { piece: 'q', label: 'Queen', white: '♕', black: '♛' },
    { piece: 'r', label: 'Rook', white: '♖', black: '♜' },
    { piece: 'b', label: 'Bishop', white: '♗', black: '♝' },
    { piece: 'n', label: 'Knight', white: '♘', black: '♞' },
]

const PromotionDialog = ({ color, onSelect }: Props) => {
    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
        >
            <div
                className="rounded-2xl p-6 text-center"
                style={{
                    background: 'rgba(18,16,12,0.98)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    boxShadow: '0 0 60px rgba(245,158,11,0.1)',
                }}
            >
                <h3 className="text-base font-bold text-[#fef3c7] mb-1">
                    Pawn promotion!
                </h3>
                <p className="text-xs text-[#57534e] mb-5">
                    Choose a piece to promote to
                </p>

                <div className="flex gap-3">
                    {PIECES.map(({ piece, label, white, black }) => (
                        <button
                            key={piece}
                            onClick={() => onSelect(piece)}
                            className="flex flex-col items-center gap-2 w-16 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                            onMouseEnter={e => {
                                (e.currentTarget as HTMLButtonElement).style.background =
                                    'rgba(245,158,11,0.15)'
                                    ; (e.currentTarget as HTMLButtonElement).style.border =
                                        '1px solid rgba(245,158,11,0.4)'
                            }}
                            onMouseLeave={e => {
                                (e.currentTarget as HTMLButtonElement).style.background =
                                    'rgba(255,255,255,0.04)'
                                    ; (e.currentTarget as HTMLButtonElement).style.border =
                                        '1px solid rgba(255,255,255,0.1)'
                            }}
                        >
                            <span className="text-3xl">
                                {color === 'w' ? white : black}
                            </span>
                            <span className="text-[10px] text-[#57534e] font-medium">
                                {label}
                            </span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { PromotionDialog }
export type { PromotionPiece }