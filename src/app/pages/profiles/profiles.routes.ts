import { Routes } from '@angular/router';

export const profilesRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/profiles/profiles.component').then(m => m.ProfilesPageComponent)
  }
  // TODO: Añadir sub-rutas para diferentes tipos de perfiles si es necesario
];