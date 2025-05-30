import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { ROUTES } from '@/lib/constants'

// Define protected routes
const protectedRoutes = [
  '/scan',
  '/profile',
  ROUTES.ADMIN,
  '/settings',
  '/dashboard'
]

// Define admin-only routes
const adminRoutes = [
  ROUTES.ADMIN
]

// Define public routes that authenticated users should be redirected from
const authRoutes = [
  ROUTES.LOGIN,
  '/signup'
]

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Get JWT token from cookies
  const token = request.cookies.get('stamp_jwt')?.value
  
  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is admin-only
  const isAdminRoute = adminRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // Check if the current path is an auth route
  const isAuthRoute = authRoutes.some(route => 
    pathname.startsWith(route)
  )
  
  // If user is not authenticated and trying to access protected route
  if (isProtectedRoute && !token) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }
  
  // If user is authenticated and trying to access auth routes, redirect to home
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url))
  }
  
  // For admin routes, we'll need to check the user role on the client side
  // since we can't decode JWT in middleware without the secret
  // The admin check will be handled in the component level
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|icons|manifest.json).*)',
  ],
} 