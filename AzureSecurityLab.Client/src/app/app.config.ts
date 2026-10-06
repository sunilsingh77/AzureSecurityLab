import {
  ApplicationConfig,
  APP_INITIALIZER
} from '@angular/core';

import {
  provideRouter
} from '@angular/router';

import {
  provideHttpClient,
  withInterceptorsFromDi
} from '@angular/common/http';

import {
  HTTP_INTERCEPTORS
} from '@angular/common/http';

import {
  MSAL_GUARD_CONFIG,
  MSAL_INSTANCE,
  MSAL_INTERCEPTOR_CONFIG,
  MsalBroadcastService,
  MsalGuard,
  MsalInterceptor,
  MsalService
} from '@azure/msal-angular';

import {
  routes
} from './app.routes';

import {
  msalInstance,
  msalGuardConfig,
  msalInterceptorConfig
} from './core/auth/auth-config';

import {
  MsalInitializationService
} from './core/auth/msal-initialization.service';


export function initializeMsal(
  initializer:
    MsalInitializationService
) {

  return () =>
    initializer.initialize();
}


export const appConfig:
  ApplicationConfig = {

  providers: [

    provideRouter(routes),

    provideHttpClient(
      withInterceptorsFromDi()
    ),

    {
      provide: APP_INITIALIZER,

      useFactory:
        initializeMsal,

      deps: [
        MsalInitializationService
      ],

      multi: true
    },

    {
      provide: MSAL_INSTANCE,

      useValue:
        msalInstance
    },

    {
      provide: MSAL_GUARD_CONFIG,

      useValue:
        msalGuardConfig
    },

    {
      provide: MSAL_INTERCEPTOR_CONFIG,

      useValue:
        msalInterceptorConfig
    },

    {
      provide: HTTP_INTERCEPTORS,

      useClass:
        MsalInterceptor,

      multi: true
    },

    MsalService,

    MsalGuard,

    MsalBroadcastService,

    MsalInitializationService
  ]
};