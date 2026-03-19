import Ably from 'ably'

// ── Server-side Ably client (for API routes) ──
// Uses full API key — never exposed to browser
export const ablyServer = new Ably.Rest(process.env.ABLY_API_KEY!)

// ── Client-side Ably client factory ──
// Call this in components — uses public key
export const getAblyClient = () =>
    new Ably.Realtime({
        key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
        clientId: 'chessmate-client',
        autoConnect: true,
    })

// ── Game channel name ──
export const getGameChannel = (roomCode: string) => `game-${roomCode}`

// ── Event types published to Ably channel ──
export type GameEvent =
    | { type: 'move'; san: string; fen: string; turn: 'white' | 'black' }
    | { type: 'chat'; message: string; sender: string }
    | { type: 'resign'; player: 'white' | 'black' }
    | { type: 'draw_offer'; from: 'white' | 'black' }
    | { type: 'draw_accept' }
    | { type: 'draw_decline' }
    | { type: 'game_over'; result: 'white' | 'black' | 'draw'; reason: string }
    | { type: 'player_joined'; color: 'white' | 'black'; username: string }
    | { type: 'reconnected'; player: 'white' | 'black' }