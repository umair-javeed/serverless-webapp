// webapp/src/app/api/auth/[slug]/route.ts
import { createAuthRouteHandlers } from '@aws-amplify/nextjs/auth';
import { configureAmplifyServer } from '@/lib/amplify-server';

// Ensure Amplify is configured on the server before the route runs
configureAmplifyServer();

export const { GET, POST } = createAuthRouteHandlers({
  // any options you already had here
});
