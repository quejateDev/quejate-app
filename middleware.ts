import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getCookie } from '@/lib/utils'

export async function middleware(request: NextRequest) {
  // const authStorage = await getCookie('auth-storage')
  // const authParsed = authStorage ? JSON.parse(authStorage) : null

  // const token = authParsed?.state?.token

  if (request.nextUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
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