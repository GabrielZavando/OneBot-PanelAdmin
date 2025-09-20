import { Routes } from '@angular/router';

export const botsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('@pages/bots/bots-list/bots-list.component').then(m => m.BotsListComponent)
  },
  {
    path: 'create',
    loadComponent: () => import('@pages/bots/bot-create/bot-create.component').then(m => m.BotCreateComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('@pages/bots/bot-detail/bot-detail.component').then(m => m.BotDetailComponent)
  },
  {
    path: ':id/edit',
    loadComponent: () => import('@pages/bots/bot-edit/bot-edit.component').then(m => m.BotEditComponent)
  }
];