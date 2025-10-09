// webapp/src/lib/amplify-server.ts
import { Amplify } from 'aws-amplify';

let configured = false;

export function configureAmplifyServer() {
  if (configured) return;

  const region = process.env.AWS_REGION;
  const userPoolId = process.env.COGNITO_USER_POOL_ID;
  const userPoolClientId = process.env.COGNITO_USER_POOL_CLIENT_ID;

  if (!region || !userPoolId || !userPoolClientId) {
    // Throwing here makes the error message crystal clear in the build logs
    throw new Error(
      `Missing Cognito config. Got region=${region}, userPoolId=${userPoolId}, userPoolClientId=${userPoolClientId}. ` +
      `Make sure AWS_REGION, COGNITO_USER_POOL_ID, and COGNITO_USER_POOL_CLIENT_ID are set in Amplify Hosting.`
    );
  }

  Amplify.configure(
    {
      Auth: {
        Cognito: {
          region,
          userPoolId,
          userPoolClientId,
        },
      },
      ssr: true,
    },
    { ssr: true }
  );

  configured = true;
}
