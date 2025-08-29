
import { Routes } from '@angular/router';
import { Register } from './auth/register/register.component';
import { Login } from './auth/login/login.component';
import { Dashboard } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./auth/components/redirector/redirector.component').then(m => m.Redirector)
	},
	{
		path: 'register',
		component: Register
	},
	{
		path: 'login',
		component: Login
	},
	{
		path: 'dashboard',
		component: Dashboard,
		canActivate: [authGuard],
		children: [
			{ path: '', redirectTo: 'home', pathMatch: 'full' },
			{ path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.Home) },
			{ path: 'chatbots', loadComponent: () => import('./pages/chatbots/chatbots.component').then(m => m.Chatbots) },
			{ path: 'knowledge', loadComponent: () => import('./pages/knowledge/knowledge.component').then(m => m.Knowledge) },
			{ path: 'analytics', loadComponent: () => import('./pages/analytics/analytics.component').then(m => m.Analytics) },
			{ path: 'settings', loadComponent: () => import('./pages/settings/settings.component').then(m => m.Settings) }
		]
	}
];
