import { Routes } from '@angular/router';

export const loginRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./login-page.component').then(m => m.LoginPageComponent)
  }
];