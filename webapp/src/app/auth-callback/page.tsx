'use client';

export default function SignInPage() {
  const handleSignIn = () => {
    const clientId = '64b8sr4lmc5icnadks6u9m8jke';
    const cognitoDomain = 'us-east-1tv8uaa8yj';
    const region = 'us-east-1';
    const redirectUri = 'https://serverless-webapp.vercel.app';
    
    const authUrl = `https://${cognitoDomain}.auth.${region}.amazoncognito.com/oauth2/authorize?client_id=${clientId}&response_type=code&scope=email+openid+profile&redirect_uri=${encodeURIComponent(redirectUri)}`;
    
    // Force browser redirect (no fetch, no CORS)
    window.location.href = authUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Todo App</h2>
        <p className="mt-2 text-center text-sm text-gray-600">Sign in to manage your tasks</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="flex flex-col items-center">
            <p className="mb-6 text-center text-sm text-gray-600">
              Please sign in with your Cognito account to continue
            </p>

            <button
              onClick={handleSignIn}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in with Cognito
            </button>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>© {new Date().getFullYear()} Todo App. All rights reserved.</p>
      </footer>
    </div>
  );
}