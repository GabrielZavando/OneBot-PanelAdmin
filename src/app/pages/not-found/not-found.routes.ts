import { Routes } from '@angular/router';

export const notFoundRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];