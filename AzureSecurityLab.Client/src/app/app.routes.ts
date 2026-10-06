import { Routes } from '@angular/router';

import { MsalGuard } from '@azure/msal-angular';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: 'profile',

    canActivate: [MsalGuard],

    loadComponent: () =>
      import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },

  {
    path: 'admin',

    canActivate: [MsalGuard],

    loadComponent: () => import('./features/admin/admin.component').then((m) => m.AdminComponent),
  },

  {
    path: 'login-failed',

    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },

  {
    path: '**',

    redirectTo: '',
  },
];
