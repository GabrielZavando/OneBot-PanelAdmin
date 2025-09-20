import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/home/home.component').then(m => m.HomePageComponent)
  }
  // TODO: Añadir sub-rutas para diferentes secciones del dashboard
];