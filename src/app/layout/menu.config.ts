// Archivo de configuración del menú lateral
// Define las entradas del menú con soporte para roles y secciones anidadas

export interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  roles?: string[]; // Roles que pueden ver este ítem (si vacío, visible para todos)
  children?: MenuItem[]; // Para secciones anidadas
}

export const MENU_CONFIG: MenuItem[] = [
  {
    path: '/home',
    label: 'Dashboard',
    icon: 'dashboard'
  },
  {
    path: '/bots',
    label: 'Bots',
    icon: 'smart_toy'
  },
  {
    path: '/profiles',
    label: 'Perfiles',
    icon: 'account_circle'
  },
  {
    path: '/knowledge',
    label: 'Knowledge',
    icon: 'library_books'
  },
  {
    path: '/analytics',
    label: 'Analytics',
    icon: 'analytics'
  },
  {
    path: '/settings',
    label: 'Configuración',
    icon: 'settings'
  }
];