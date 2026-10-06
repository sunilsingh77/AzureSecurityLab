import {
  BrowserCacheLocation,
  InteractionType,
  IPublicClientApplication,
  LogLevel,
  PublicClientApplication,
} from '@azure/msal-browser';

import { MsalGuardConfiguration, MsalInterceptorConfiguration } from '@azure/msal-angular';

import { environment } from '../../../environments/environment';

export const msalInstance: IPublicClientApplication = new PublicClientApplication({
  auth: {
    clientId: environment.azureAd.clientId,
    authority: environment.azureAd.authority,
    redirectUri: environment.azureAd.redirectUri,
    postLogoutRedirectUri: environment.azureAd.postLogoutRedirectUri,
    //navigateToLoginRequestUrl: true
  },

  cache: {
    cacheLocation: BrowserCacheLocation.SessionStorage,
  },

  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) {
          return;
        }

        console.log(`[MSAL ${LogLevel[level]}] ${message}`);
      },

      piiLoggingEnabled: false,
    },
  },
});

export const msalGuardConfig: MsalGuardConfiguration = {
  interactionType: InteractionType.Redirect,

  authRequest: {
    scopes: ['openid', 'profile', 'email'],
  },

  loginFailedRoute: '/login-failed',
};

export const msalInterceptorConfig:
  MsalInterceptorConfiguration = {
  interactionType: InteractionType.Redirect,

  protectedResourceMap:
    new Map<string, string[]>([
      [
        `${environment.api.baseUrl}/security/*`,
        [
          environment.apiScopes.accessAsUser
        ]
      ]
    ]),

  strictMatching: true
};