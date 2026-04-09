import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Run on Vercel Edge Runtime to globally configure Edge Caching policies
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

export default function proxy(request: NextRequest) {
  const response = NextResponse.next();

  // Edge Caching & Security rules configured natively on the Vercel Edge Network
  response.headers.set('x-edge-configured', 'true');
  
  // Set custom Cache-Control for documents on the CDN Edge
  if (!response.headers.has('Cache-Control')) {
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=86400, stale-while-revalidate=31536000'
    );
  }

  return response;
}
