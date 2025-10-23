import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET() {
  const cookieStore = await cookies();
  cookieStore.delete('idToken');
  cookieStore.delete('accessToken');
  redirect('/sign-in');
}