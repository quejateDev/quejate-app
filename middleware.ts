import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyToken } from '@/lib/utils'

// Define which paths require admin authentication
const ADMIN_PATHS = ['/admin']

// Define which paths require authentication
const PROTECTED_PATHS = ['/dashboard']

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  // Redirect /dashboard to /dashboard/pqrs
  if (request.nextUrl.pathname === '/admin') {
    return NextResponse.redirect(new URL('/admin/pqr', request.url))
  }

  // If no token and trying to access protected route, redirect to login
  if (!token && PROTECTED_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('from', request.nextUrl.pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If there's a token, verify it
  if (token) {
    try {
      const decoded = await verifyToken(token)
      
      if (!decoded) {
        console.log('Token is invalid', token)
        const response = NextResponse.redirect(new URL('/login', request.url))
        response.cookies.delete('token')
        return response
      }
      
      // Check if user is trying to access admin routes
      if (ADMIN_PATHS.some(path => request.nextUrl.pathname.startsWith(path))) {
        // If not admin, redirect to dashboard
        if (decoded.role !== 'ADMIN') {
          return NextResponse.redirect(new URL('/dashboard', request.url))
        }
      }

      // Add user info to headers for use in server components
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', decoded.id)
      requestHeaders.set('x-user-role', decoded.role)

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    } catch (error) {
      console.error('Token verification error:', error)
      // If token is invalid, clear it and redirect to login
      const response = NextResponse.redirect(new URL('/login', request.url))
      response.cookies.delete('token')
      return response
    }
  }

  return NextResponse.next()
}

// Configure paths that trigger the middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ]
} 