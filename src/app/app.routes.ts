
import { Routes } from '@angular/router';
import { Register } from './auth/register/register.component';
import { Login } from './auth/login/login.component';
import { Dashboard } from './dashboard/dashboard.component';
import { authGuard } from './auth/guards/auth.guard';

export const routes: Routes = [
	{
		path: '',
		loadComponent: () => import('./redirector').then(m => m.Redirector)
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
			{ path: 'home', loadComponent: () => import('./dashboard/pages/home.component').then(m => m.Home) },
			{ path: 'chatbots', loadComponent: () => import('./dashboard/pages/chatbots.component').then(m => m.Chatbots) },
			{ path: 'knowledge', loadComponent: () => import('./dashboard/pages/knowledge.component').then(m => m.Knowledge) },
			{ path: 'analytics', loadComponent: () => import('./dashboard/pages/analytics.component').then(m => m.Analytics) },
			{ path: 'settings', loadComponent: () => import('./dashboard/pages/settings.component').then(m => m.Settings) }
		]
	}
];
