import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Public routes that don't require authentication
const publicRoutes = ['/login', '/register', '/', '/about', '/contact'];

// Role-based route prefixes
const roleRoutes: Record<string, string[]> = {
  learner: ['/learner'],
  tutor: ['/tutor'],
  manager: ['/manager'],
  admin: ['/admin'],
  writer: ['/writer'],
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Allow public routes
  if (publicRoutes.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Check if route requires authentication
  const requiresAuth = Object.values(roleRoutes).some(routes => 
    routes.some(route => pathname.startsWith(route))
  );

  if (requiresAuth) {
    // Get tokens from cookies (set by client-side)
    const accessToken = request.cookies.get('accessToken')?.value;
    
    if (!accessToken) {
      // Redirect to login if no token
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

