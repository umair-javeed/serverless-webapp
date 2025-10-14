// Temporary stub to unblock the build/deploy.
// Replace with real Amplify auth handlers later.

import { NextResponse } from 'next/server';

export const GET = async () => {
  return NextResponse.json({ ok: true, route: 'auth stub GET' });
};

export const POST = async (req: Request) => {
  try {
    const body = await req.json().catch(() => ({}));
    return NextResponse.json({ ok: true, route: 'auth stub POST', body });
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
};
