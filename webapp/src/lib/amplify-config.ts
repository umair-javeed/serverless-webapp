import type { ResourcesConfig } from 'aws-amplify';

const getUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'https://serverless-webapp.vercel.app';
};

export const amplifyConfig: ResourcesConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'us-east-1_tv8uaa8YJ',
      userPoolClientId: '64b8sr4lmc5icnadks6u9m8jke',
      loginWith: {
        oauth: {
          domain: 'us-east-1tv8uaa8yj.auth.us-east-1.amazoncognito.com',
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [`${getUrl()}/`],
          redirectSignOut: [`${getUrl()}/sign-in`],
          responseType: 'code' as const,
        },
      },
    },
  },
};