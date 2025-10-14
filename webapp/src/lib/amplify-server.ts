// webapp/src/lib/amplify-server.ts
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

  // Optional – only if you actually have an Identity Pool
  const identityPoolId =
    process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID ??
    process.env.COGNITO_IDENTITY_POOL_ID;

  // Derive the exact Cognito type from ResourcesConfig
  type CognitoCfg = NonNullable<ResourcesConfig['Auth']>['Cognito'];

  const cognito: CognitoCfg = identityPoolId
    ? { userPoolId, userPoolClientId, identityPoolId }
    : { userPoolId, userPoolClientId };

  const config: ResourcesConfig = {
    Auth: {
      Cognito: cognito,
    },
  };

  Amplify.configure(config, { ssr: true });
  configured = true;
}
