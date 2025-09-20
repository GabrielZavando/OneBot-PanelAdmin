
import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { LayoutShellComponent } from '@layout/layout-shell/layout-shell.component';

export const routes: Routes = [
  // ===== RUTAS PÚBLICAS (Sin protección) =====

  // Login - Página de autenticación
  {
    path: 'login',
    loadChildren: () => import('@pages/login/login.routes').then(m => m.loginRoutes)
  },

  // Not Found - Página de error 404
  {
    path: 'not-found',
    loadChildren: () => import('@pages/not-found/not-found.routes').then(m => m.notFoundRoutes)
  },

  // ===== RUTAS PROTEGIDAS (Requieren autenticación) =====

  // Todas las rutas principales requieren autenticación
  {
    path: '',
    component: LayoutShellComponent,
    canActivate: [authGuard],
    children: [
      // Redirect raíz a home
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      // Home/Dashboard
      {
        path: 'home',
        loadChildren: () => import('@pages/home/home.routes').then(m => m.homeRoutes)
      },

      // Bots con sub-rutas
      {
        path: 'bots',
        loadChildren: () => import('@pages/bots/bots.routes').then(m => m.botsRoutes)
      },

      // Profiles
      {
        path: 'profiles',
        loadChildren: () => import('@pages/profiles/profiles.routes').then(m => m.profilesRoutes)
      },

      // Knowledge
      {
        path: 'knowledge',
        loadChildren: () => import('@pages/knowledge/knowledge.routes').then(m => m.knowledgeRoutes)
      },

      // Analytics
      {
        path: 'analytics',
        loadChildren: () => import('@pages/analytics/analytics.routes').then(m => m.analyticsRoutes)
      },

      // Settings
      {
        path: 'settings',
        loadChildren: () => import('@pages/settings/settings.routes').then(m => m.settingsRoutes)
      }
    ]
  },

  // ===== WILDCARD - Página no encontrada =====
  {
    path: '**',
    redirectTo: '/not-found'
  }
];

/*
 * ESTRUCTURA DE RUTAS - OneBot Admin Panel
 *
 * ===== RUTAS PÚBLICAS =====
 * - /login: Página de autenticación (sin protección)
 * - /not-found: Página 404 (sin protección)
 *
 * ===== RUTAS PROTEGIDAS =====
 * - Todas las demás rutas requieren AuthGuard
 * - / (raíz): MainComponent con layout principal
 *   ├── /home: Dashboard principal
 *   ├── /bots: Gestión de bots (con sub-rutas)
 *   ├── /profiles: Gestión de perfiles
 *   ├── /knowledge: Base de conocimiento
 *   ├── /analytics: Estadísticas y reportes
 *   └── /settings: Configuración del sistema
 *
 * ===== SEGURIDAD =====
 * - AuthGuard protege todas las rutas principales
 * - RoleGuard puede aplicarse en rutas específicas según roles
 * - Solo /login y /not-found están sin protección
 *
 * ===== OPTIMIZACIÓN =====
 * - Todas las cargas usan lazy loading (loadComponent/loadChildren)
 * - Chunks separados por feature para mejor performance
 */
