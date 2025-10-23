import type { ResourcesConfig } from 'aws-amplify';

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_USER_POOL_ID || 'us-east-1_tv8uaa8YJ',
      userPoolClientId: process.env.NEXT_PUBLIC_USER_POOL_CLIENT_ID || '64b8sr4lmc5icnadks6u9m8jke',
      loginWith: {
        oauth: {
          domain: process.env.NEXT_PUBLIC_COGNITO_DOMAIN 
            ? `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}.auth.${process.env.NEXT_PUBLIC_AWS_REGION}.amazoncognito.com`
            : 'us-east-1tv8uaa8yj.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [
            typeof window !== 'undefined' ? window.location.origin + '/' : 'https://serverless-webapp.vercel.app/'
          ],
          redirectSignOut: [
            typeof window !== 'undefined' ? window.location.origin + '/sign-in' : 'https://serverless-webapp.vercel.app/sign-in'
          ],
          responseType: 'code' as const,
        },
      },
    },
  },
};