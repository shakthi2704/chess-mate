import { auth } from '@/lib/auth'
import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/game', '/profile', '/leaderboard']
const authRoutes = ['/login', '/register', '/signup']

export default async function proxy(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl

  const isLoggedIn = !!session
  const isProtected = protectedRoutes.some(r => pathname.startsWith(r))
  const isAuthRoute = authRoutes.some(r => pathname.startsWith(r))

  if (isProtected && !isLoggedIn) {
    const loginUrl = new URL('/login', req.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/dashboard', req.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}