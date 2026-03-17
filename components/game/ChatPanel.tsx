'use client'

import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface ChatMessage {
    id: string
    sender: string
    message: string
    isMe: boolean
    timestamp: string
}

interface ChatPanelProps {
    messages: ChatMessage[]
    onSend: (message: string) => void
    disabled?: boolean
}

const QUICK_MESSAGES = ['Good luck!', 'Well played!', 'Thanks!', 'GG']

const ChatPanel = ({ messages, onSend, disabled = false }: ChatPanelProps) => {


    const [input, setInput] = useState('')
    const bottomRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    const handleSend = () => {
        const trimmed = input.trim()
        if (!trimmed || disabled) return
        onSend(trimmed)
        setInput('')
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
        }
    }

    return (
        <Card
            className="flex flex-col rounded-2xl border-0"
            style={{
                background: 'rgba(18,16,12,0.85)',
                border: '1px solid rgba(245,158,11,0.15)',
            }}
        >
            <CardHeader className="pb-2 pt-4 px-4 flex-shrink-0">
                <CardTitle className="text-sm font-bold text-[#fef3c7]">Chat</CardTitle>
            </CardHeader>

            <CardContent className="px-3 pb-3 flex flex-col gap-2 flex-1">
                {/* Messages */}
                <div
                    className="overflow-y-auto flex flex-col gap-2 flex-1"
                    style={{ minHeight: 80, maxHeight: 140 }}
                >
                    {messages.length === 0 ? (
                        <p className="text-xs text-[#44403c] text-center py-2">
                            Say hello to your opponent!
                        </p>
                    ) : (
                        messages.map(msg => (
                            <div
                                key={msg.id}
                                className={`flex flex-col gap-0.5 ${msg.isMe ? 'items-end' : 'items-start'}`}
                            >
                                <span className="text-[10px] text-[#44403c] px-1">{msg.sender}</span>
                                <div
                                    className="px-3 py-1.5 rounded-xl text-xs font-medium max-w-[85%]"
                                    style={{
                                        background: msg.isMe
                                            ? 'rgba(245,158,11,0.15)'
                                            : 'rgba(255,255,255,0.06)',
                                        color: msg.isMe ? '#fbbf24' : '#a8a29e',
                                        border: msg.isMe
                                            ? '1px solid rgba(245,158,11,0.2)'
                                            : '1px solid rgba(255,255,255,0.07)',
                                    }}
                                >
                                    {msg.message}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Quick messages */}
                <div className="flex gap-1.5 flex-wrap">
                    {QUICK_MESSAGES.map(qm => (
                        <button
                            key={qm}
                            onClick={() => onSend(qm)}
                            disabled={disabled}
                            className="text-[10px] font-medium px-2.5 py-1 rounded-lg transition-all duration-200 hover:bg-amber-500/20 disabled:opacity-40"
                            style={{
                                background: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: '#57534e',
                            }}
                        >
                            {qm}
                        </button>
                    ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="Type a message..."
                        disabled={disabled}
                        maxLength={100}
                        className="flex-1 px-3 py-2 rounded-xl text-xs text-[#fef3c7] placeholder-[#292524] outline-none transition-all duration-200 disabled:opacity-40"
                        style={{
                            background: 'rgba(255,255,255,0.03)',
                            border: '1px solid rgba(255,255,255,0.08)',
                        }}
                        onFocus={e => {
                            e.target.style.border = '1px solid rgba(245,158,11,0.4)'
                            e.target.style.boxShadow = '0 0 0 3px rgba(245,158,11,0.07)'
                        }}
                        onBlur={e => {
                            e.target.style.border = '1px solid rgba(255,255,255,0.08)'
                            e.target.style.boxShadow = 'none'
                        }}
                    />
                    <button
                        onClick={handleSend}
                        disabled={disabled || !input.trim()}
                        className="px-3 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{
                            background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                            color: '#0c0c0e',
                        }}
                    >
                        Send
                    </button>
                </div>
            </CardContent>
        </Card>

    )
}

export default ChatPanel