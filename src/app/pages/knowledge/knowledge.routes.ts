import { Routes } from '@angular/router';

export const knowledgeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/knowledge/knowledge.component').then(m => m.KnowledgePageComponent)
  }
  // TODO: Añadir sub-rutas para gestión de fuentes, categorías, etc.
];