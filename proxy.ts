import { NextRequest, NextResponse } from 'next/server'

const protectedRoutes = ['/dashboard', '/game', '/profile', '/leaderboard']
const authRoutes = ['/login', '/register', '/signup']

export default function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl

  // let landing page through always
  if (pathname === '/') return NextResponse.next()

  // check session by looking for NextAuth session cookie directly
  const sessionToken =
    req.cookies.get('authjs.session-token')?.value ||
    req.cookies.get('next-auth.session-token')?.value

  const isLoggedIn = !!sessionToken
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
  matcher: [
    '/',
    '/((?!api|_next/static|_next/image|favicon.ico).+)',
  ],
}