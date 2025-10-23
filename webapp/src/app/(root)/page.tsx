import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { getSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import CreateTodoForm from './components/CreateTodoForm';
import TodoItem from './components/TodoItem';

export const dynamic = 'force-dynamic';

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  const params = await searchParams;
  const code = params.code;

  // Handle OAuth callback
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
      }
    } catch (error) {
      console.error('Auth error:', error);
    }
  }

  // Get user session and todos
  let session;
  try {
    session = await getSession();
  } catch (error) {
    redirect('/sign-in');
  }

  const todos = await prisma.todo.findMany({
    where: { userId: session.userId },
    orderBy: { createdAt: 'desc' },
  });

  const pendingTodos = todos.filter((todo) => !todo.completed);
  const completedTodos = todos.filter((todo) => todo.completed);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-indigo-600 text-white py-4 px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Todo App</h1>
        
          href="/sign-out"
          className="px-4 py-2 bg-white text-indigo-600 rounded hover:bg-gray-100"
        >
          Sign Out
        </a>
      </div>

      <div className="max-w-4xl mx-auto p-8">
        <CreateTodoForm />

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">
            Pending Tasks ({pendingTodos.length})
          </h2>
          <div className="space-y-2">
            {pendingTodos.map((todo) => (
              <TodoItem key={todo.id} todo={todo} />
            ))}
          </div>
        </div>

        {completedTodos.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">
              Completed Tasks ({completedTodos.length})
            </h2>
            <div className="space-y-2">
              {completedTodos.map((todo) => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}