import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/settings/settings.component').then(m => m.SettingsPageComponent)
  }
  // TODO: Añadir sub-rutas para diferentes secciones de configuración
];