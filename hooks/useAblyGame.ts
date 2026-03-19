'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import Ably from 'ably'
import type { GameEvent } from '@/lib/ably'

interface UseAblyGameProps {
    roomCode: string
    playerColor: 'white' | 'black' | null
    username: string
    onMove: (san: string, fen: string, turn: 'white' | 'black') => void
    onChat: (message: string, sender: string) => void
    onResign: (player: 'white' | 'black') => void
    onDrawOffer: (from: 'white' | 'black') => void
    onDrawAccept: () => void
    onGameOver: (result: 'white' | 'black' | 'draw', reason: string) => void
    onPlayerJoined: (color: 'white' | 'black', username: string) => void
    onDrawDecline: () => void
}

export const useAblyGame = ({
    roomCode,
    playerColor,
    username,
    onMove,
    onChat,
    onResign,
    onDrawOffer,
    onDrawAccept,
    onGameOver,
    onPlayerJoined,
    onDrawDecline

}: UseAblyGameProps) => {
    const clientRef = useRef<Ably.Realtime | null>(null)
    const channelRef = useRef<Ably.RealtimeChannel | null>(null)
    const playerColorRef = useRef(playerColor)
    const usernameRef = useRef(username)

    // ── Keep callback refs up to date to avoid stale closures ──
    const onMoveRef = useRef(onMove)
    const onChatRef = useRef(onChat)
    const onResignRef = useRef(onResign)
    const onDrawOfferRef = useRef(onDrawOffer)
    const onDrawAcceptRef = useRef(onDrawAccept)
    const onDrawDeclineRef = useRef(onDrawDecline)
    const onGameOverRef = useRef(onGameOver)
    const onPlayerJoinedRef = useRef(onPlayerJoined)

    // update all refs every render
    playerColorRef.current = playerColor
    usernameRef.current = username
    onMoveRef.current = onMove
    onChatRef.current = onChat
    onResignRef.current = onResign
    onDrawOfferRef.current = onDrawOffer
    onDrawAcceptRef.current = onDrawAccept
    onDrawDeclineRef.current = onDrawDecline
    onGameOverRef.current = onGameOver
    onPlayerJoinedRef.current = onPlayerJoined

    const [connected, setConnected] = useState(false)
    const [opponentOnline, setOpponentOnline] = useState(false)

    useEffect(() => {
        if (!roomCode) return
        if (!playerColorRef.current) return

        const clientId = `${roomCode}-${playerColorRef.current === 'black' ? 'black' : 'white'}`

        const client = new Ably.Realtime({
            key: process.env.NEXT_PUBLIC_ABLY_API_KEY!,
            clientId,
            autoConnect: true,
        })

        clientRef.current = client
        const channelName = `game-${roomCode}`
        const channel = client.channels.get(channelName)
        channelRef.current = channel

        // ── Subscribe — use refs so callbacks are always fresh ──
        channel.subscribe((msg) => {
            console.log('RAW MSG received - clientId:', msg.clientId, 'myClientId:', clientId, 'blocked:', msg.clientId === clientId)
            const event = msg.data as GameEvent

            if (msg.clientId === clientId) return

            console.log('Received event:', event.type, 'from:', msg.clientId)

            switch (event.type) {
                case 'move':
                    onMoveRef.current(event.san, event.fen, event.turn)
                    break
                case 'chat':
                    onChatRef.current(event.message, event.sender)
                    break
                case 'resign':
                    onResignRef.current(event.player)
                    break
                case 'draw_offer':
                    console.log('Draw offer received!')
                    onDrawOfferRef.current(event.from)
                    break
                case 'draw_accept':
                    onDrawAcceptRef.current()
                    break
                case 'game_over':
                    onGameOverRef.current(event.result, event.reason)
                    break
                case 'player_joined':
                    setOpponentOnline(true)
                    onPlayerJoinedRef.current(event.color, event.username)
                    break
                case 'reconnected':
                    setOpponentOnline(true)
                    break
                case 'draw_decline':
                    onDrawDeclineRef.current()
                    break
            }
        })

        channel.presence.subscribe('enter', () => setOpponentOnline(true))
        channel.presence.subscribe('leave', () => setOpponentOnline(false))

        client.connection.on('connected', () => {
            console.log('ABLY CONNECTED with clientId:', clientId, 'playerColor:', playerColorRef.current)
            setConnected(true)
            channel.presence.enter({
                color: playerColorRef.current,
                username: usernameRef.current,
            })
            channel.publish('game-event', {
                type: 'player_joined',
                color: playerColorRef.current,
                username: usernameRef.current,
            } as GameEvent)
        })

        client.connection.on('disconnected', () => setConnected(false))
        client.connection.on('failed', () => setConnected(false))

        return () => {
            try { channel.presence.leave() } catch { }
            try { channel.unsubscribe() } catch { }
            try {
                if (
                    client.connection.state !== 'closed' &&
                    client.connection.state !== 'failed' &&
                    client.connection.state !== 'closing'
                ) {
                    client.close()
                }
            } catch { }
        }
    }, [roomCode, playerColor]) // only reconnect when roomCode changes

    // ── Publish helpers ──
    const publishMove = useCallback((san: string, fen: string, turn: 'white' | 'black') => {
        channelRef.current?.publish('game-event', {
            type: 'move', san, fen, turn,
        } as GameEvent)
    }, [])

    const publishChat = useCallback((message: string) => {
        channelRef.current?.publish('game-event', {
            type: 'chat',
            message,
            sender: usernameRef.current,
        } as GameEvent)
    }, [])

    const publishResign = useCallback(() => {
        channelRef.current?.publish('game-event', {
            type: 'resign',
            player: playerColorRef.current,
        } as GameEvent)
    }, [])

    const publishDrawOffer = useCallback(() => {
        channelRef.current?.publish('game-event', {
            type: 'draw_offer',
            from: playerColorRef.current,
        } as GameEvent)
    }, [])

    const publishDrawAccept = useCallback(() => {
        channelRef.current?.publish('game-event', {
            type: 'draw_accept',
        } as GameEvent)
    }, [])

    const publishDrawDecline = useCallback(() => {
        channelRef.current?.publish('game-event', {
            type: 'draw_decline',
        } as GameEvent)
    }, [])

    const publishGameOver = useCallback((
        result: 'white' | 'black' | 'draw',
        reason: string
    ) => {
        channelRef.current?.publish('game-event', {
            type: 'game_over', result, reason,
        } as GameEvent)
    }, [])

    return {
        connected,
        opponentOnline,
        publishMove,
        publishChat,
        publishResign,
        publishDrawOffer,
        publishDrawAccept,
        publishDrawDecline,
        publishGameOver,
    }
}