import { Provider } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ENVIRONMENT_CONFIG, IS_PRODUCTION, API_BASE_URL } from './injection-tokens';

/**
 * Proveedores para la configuración de entorno
 * Estos proveedores permiten inyectar la configuración de entorno en cualquier servicio o componente
 */
export const ENVIRONMENT_PROVIDERS: Provider[] = [
  {
    provide: ENVIRONMENT_CONFIG,
    useValue: environment
  },
  {
    provide: IS_PRODUCTION,
    useValue: environment.production
  },
  {
    provide: API_BASE_URL,
    useValue: environment.apiBaseUrl
  }
];

/**
 * Factory function para crear una configuración personalizada
 * Útil para testing o configuraciones específicas
 */
export function createEnvironmentProviders(config: any): Provider[] {
  return [
    {
      provide: ENVIRONMENT_CONFIG,
      useValue: config
    },
    {
      provide: IS_PRODUCTION,
      useValue: config.production
    },
    {
      provide: API_BASE_URL,
      useValue: config.apiBaseUrl
    }
  ];
}