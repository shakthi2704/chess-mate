'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { signOut } from 'next-auth/react'


// TODO: replace with real user data from Supabase
const user = {
    username: 'GrandKnight',
    avatarUrl: '',
    elo: 1247,
}

const NAV_LINKS = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: '/leaderboard', label: 'Leaderboard', icon: '🏆' },
    { href: '/profile', label: 'Profile', icon: '👤' },
]

function DashboardNav() {

    const pathname = usePathname()

    const handleSignOut = async () => {
        await signOut({ callbackUrl: '/' })
        console.log('sign out')
    }
    return (
        <nav
            className="sticky top-0 z-50 px-6 py-3"
            style={{
                background: 'rgba(12,12,14,0.92)',
                backdropFilter: 'blur(14px)',
                borderBottom: '1px solid rgba(245,158,11,0.1)',
            }}
        >
            <div className="max-w-6xl mx-auto flex items-center justify-between">
                {/* Logo */}
                <Link href="/dashboard" className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-lg font-bold"
                        style={{ background: 'linear-gradient(135deg,#f59e0b,#d97706)', color: '#0c0c0e' }}
                    >
                        ♟
                    </div>
                    <span className="text-[#fef3c7] font-bold text-lg tracking-tight">ChessMate</span>
                </Link>

                {/* Nav links */}
                <div className="hidden md:flex items-center gap-1">
                    {NAV_LINKS.map(link => {
                        const isActive = pathname === link.href
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                                style={{
                                    background: isActive ? 'rgba(245,158,11,0.12)' : 'transparent',
                                    color: isActive ? '#fbbf24' : '#57534e',
                                    border: isActive ? '1px solid rgba(245,158,11,0.2)' : '1px solid transparent',
                                }}
                            >
                                <span className="text-base">{link.icon}</span>
                                {link.label}
                            </Link>
                        )
                    })}
                </div>

                {/* Right — ELO + avatar + signout */}
                <div className="flex items-center gap-4">
                    {/* ELO pill */}
                    <div
                        className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg"
                        style={{
                            background: 'rgba(245,158,11,0.08)',
                            border: '1px solid rgba(245,158,11,0.15)',
                        }}
                    >
                        <span className="text-xs text-[#57534e]">ELO</span>
                        <span className="text-sm font-bold text-[#fbbf24]">
                            {user.elo.toLocaleString()}
                        </span>
                    </div>

                    {/* Avatar dropdown */}
                    <div className="flex items-center gap-3">
                        <Link href="/profile">
                            <Avatar className="w-8 h-8 rounded-full cursor-pointer ring-2 ring-transparent hover:ring-amber-500/40 transition-all">
                                <AvatarImage src={user.avatarUrl} alt={user.username} />
                                <AvatarFallback
                                    className="text-xs font-bold rounded-full"
                                    style={{ background: '#1c1000', color: '#fbbf24' }}
                                >
                                    {user.username.slice(0, 2).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                        </Link>

                        {/* Sign out */}
                        <button
                            onClick={handleSignOut}
                            className="hidden sm:flex items-center gap-1.5 text-xs text-[#44403c] hover:text-[#f87171] transition-colors duration-200"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile bottom nav */}
            <div
                className="md:hidden fixed bottom-0 left-0 right-0 flex items-center justify-around px-4 py-3 z-50"
                style={{
                    background: 'rgba(12,12,14,0.96)',
                    borderTop: '1px solid rgba(245,158,11,0.1)',
                    backdropFilter: 'blur(14px)',
                }}
            >
                {NAV_LINKS.map(link => {
                    const isActive = pathname === link.href
                    return (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-all"
                            style={{ color: isActive ? '#fbbf24' : '#44403c' }}
                        >
                            <span className="text-xl">{link.icon}</span>
                            <span className="text-[10px] font-medium">{link.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    )
}

export default DashboardNav