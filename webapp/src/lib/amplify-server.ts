import { Amplify, type ResourcesConfig } from 'aws-amplify';

let configured = false;

export function configureAmplifyServer() {
  if (configured) return;

  const userPoolId =
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID ??
    process.env.COGNITO_USER_POOL_ID!;

  const userPoolClientId =
    process.env.NEXT_PUBLIC_COGNITO_USER_POOL_CLIENT_ID ??
    process.env.COGNITO_USER_POOL_CLIENT_ID!;

  const identityPoolId = process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ??
                         process.env.COGNITO_IDENTITY_POOL_ID;

  const cognito =
    identityPoolId
      ? { userPoolId, userPoolClientId, identityPoolId }
      : { userPoolId, userPoolClientId };

  const config: ResourcesConfig = {
    Auth: { Cognito: cognito as any },
  };

  Amplify.configure(config, { ssr: true });
  configured = true;
}
