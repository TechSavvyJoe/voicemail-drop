import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware if Supabase is not configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return res
  }

  const { pathname } = req.nextUrl

  // Protected routes that require authentication
  const protectedRoutes = [
    '/customers',
    '/campaigns', 
    '/analytics',
    '/billing',
    '/settings',
    '/scripts',
    '/dashboard'
  ]

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )

  // For now, allow all routes during development
  // In production, you would implement proper auth checks here
  if (isProtectedRoute) {
    // Redirect to auth page if not configured
    const authUrl = req.nextUrl.clone()
    authUrl.pathname = '/auth'
    // Temporarily disable redirect for development
    // return NextResponse.redirect(authUrl)
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}
