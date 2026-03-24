import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  
  // url.hostname is just the hostname without port
  let hostname = url.hostname;
  let needsRedirect = false;

  // 1. Remove 'www' from the beginning of the hostname
  if (hostname.toLowerCase().startsWith('www.')) {
    url.hostname = hostname.slice(4); // Remove 'www.'
    needsRedirect = true;
  }

  // 2. Remove trailing slash from pathname
  if (url.pathname !== '/' && url.pathname.endsWith('/')) {
    url.pathname = url.pathname.slice(0, -1);
    needsRedirect = true;
  }

  if (needsRedirect) {
    return NextResponse.redirect(url, 308);
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
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
