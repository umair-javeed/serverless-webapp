import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const idToken = request.cookies.get('idToken');
  const accessToken = request.cookies.get('accessToken');

  // Check if user has valid tokens
  const authenticated = idToken && accessToken;

  if (authenticated) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL('/sign-in', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sign-in).*)',
  ],
};