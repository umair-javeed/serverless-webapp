import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function AuthCallbackPage({
  searchParams,
}: {
  searchParams: { code?: string };
}) {
  const code = searchParams.code;

  if (!code) {
    console.log('No code provided');
    redirect('/sign-in?error=no_code');
  }

  console.log('Received code:', code);

  // For now, just redirect to home to test
  // TODO: Implement proper token exchange and user creation
  redirect('/?debug=auth_success');
}