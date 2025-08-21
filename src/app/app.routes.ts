
import { Routes } from '@angular/router';
import { Register } from './register/register';
import { Login } from './login/login';
import { Dashboard } from './dashboard/dashboard';
import { authGuard } from './guards/auth.guard';

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
			{ path: 'home', loadComponent: () => import('./home/home').then(m => m.Home) },
			{ path: 'chatbots', loadComponent: () => import('./chatbots/chatbots').then(m => m.Chatbots) },
			{ path: 'knowledge', loadComponent: () => import('./knowledge/knowledge').then(m => m.Knowledge) },
			{ path: 'analytics', loadComponent: () => import('./analytics/analytics').then(m => m.Analytics) },
			{ path: 'settings', loadComponent: () => import('./settings/settings').then(m => m.Settings) }
		]
	}
];
