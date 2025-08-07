import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

export function middleware(request: NextRequest) {
  // Protéger les routes admin
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const authHeader = request.headers.get('authorization') || 
                      request.cookies.get('auth_token')?.value;
    
    // Si pas de token dans les headers, vérifier dans localStorage côté client
    if (!authHeader) {
      // Rediriger vers la page d'accueil pour se connecter
      return NextResponse.redirect(new URL('/', request.url));
    }

    const token = getTokenFromRequest(`Bearer ${authHeader}`);
    
    if (!token) {
      return NextResponse.redirect(new URL('/', request.url));
    }

    const payload = verifyToken(token);
    
    if (!payload || payload.role !== 'admin') {
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*']
};
