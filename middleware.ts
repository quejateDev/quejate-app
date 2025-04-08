import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookie, verifyToken } from '@/lib/utils'

// Define which paths require admin authentication
const ADMIN_PATHS = ['/admin']

export async function middleware(request: NextRequest) {
  const authStorage = await getCookie('auth-storage')
  const authParsed = authStorage ? JSON.parse(authStorage) : null

  const token = authParsed?.state?.token

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect /dashboard to /dashboard/pqrs
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/pqr', request.url))
  }

  // If no token and trying to access protected route, redirect to login
  // if (!token && PROTECTED_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
  //   const loginUrl = new URL('/login', request.url)
  //   loginUrl.searchParams.set('from', request.nextUrl.pathname)
  //   return NextResponse.redirect(loginUrl)
  // }

  // Define which paths require dashboard access
  const DASHBOARD_PATHS = ['/dashboard'];

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  const decoded = await verifyToken(token)

  const isAdmin = decoded?.role === 'ADMIN' || decoded?.role === 'SUPER_ADMIN'
  
  if (ADMIN_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (!token) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!decoded) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    if (!isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  if (DASHBOARD_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    if (isAdmin) {
      return NextResponse.redirect(new URL('/admin/pqr', request.url))
    }
  }

  return NextResponse.next();
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    '/',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ]
} 