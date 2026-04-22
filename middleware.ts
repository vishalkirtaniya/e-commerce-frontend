import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_ADMIN_PATHS = ['/admin/login']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Only apply to /admin routes
  if (!pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  // Allow public admin paths through
  if (PUBLIC_ADMIN_PATHS.some((path) => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  const token = request.cookies.get('admin_token')?.value

  if (!token) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}