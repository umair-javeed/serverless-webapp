import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  if (code) {
    try {
      const tokenUrl = 'https://us-east-1tv8uaa8yj.auth.us-east-1.amazoncognito.com/oauth2/token';
      const clientId = '64b8sr4lmc5icnadks6u9m8jke';
      const clientSecret = '1mlpgj0m8q5e6afao50k7o2483icqiodn345agjv32p2sv6hmaf6';
      const redirectUri = 'https://serverless-webapp.vercel.app';

      const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');

      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${auth}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          code: code,
          redirect_uri: redirectUri,
        }),
      });

      if (response.ok) {
        const tokens = await response.json();
        const cookieStore = await cookies();
        
        cookieStore.set('idToken', tokens.id_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 3600,
        });
        
        cookieStore.set('accessToken', tokens.access_token, {
          httpOnly: true,
          secure: true,
          sameSite: 'lax',
          maxAge: 3600,
        });

        redirect('/');
      } else {
        console.error('Token exchange failed:', await response.text());
        redirect('/sign-in?error=token_exchange_failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      redirect('/sign-in?error=auth_failed');
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Todo App</h1>
        <p className="mb-4">Welcome! You are signed in.</p>
        <a href="/sign-out" className="text-blue-600 hover:underline">
          Sign out
        </a>
      </div>
    </div>
  );
}