import { InjectionToken } from '@angular/core';

/**
 * Tokens de inyección para la configuración de la aplicación
 * 
 * Estos tokens permiten inyectar valores de configuración específicos en servicios
 * sin necesidad de importar directamente el objeto environment.
 * 
 * Ventajas:
 * - Desacoplamiento: Los servicios no dependen directamente del archivo environment
 * - Testabilidad: Fácil mockear valores específicos en tests
 * - Tipado: TypeScript valida los tipos de los valores inyectados
 * - Flexibilidad: Permite sobrescribir valores específicos sin tocar toda la configuración
 */

/**
 * Token para inyectar la URL base de la API
 * Tipo: string
 * Ejemplo de uso: constructor(@Inject(API_BASE_URL) private apiUrl: string)
 */
export const API_BASE_URL = new InjectionToken<string>('api.base.url', {
  providedIn: 'root',
  factory: () => {
    throw new Error('API_BASE_URL debe ser provisto en app.config.ts');
  }
});

/**
 * Token para inyectar la configuración de Firebase
 * Tipo: objeto con propiedades apiKey, authDomain, projectId, etc.
 * Ejemplo de uso: constructor(@Inject(FIREBASE_CONFIG) private firebaseConfig: any)
 */
export const FIREBASE_CONFIG = new InjectionToken<{
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}>('firebase.config', {
  providedIn: 'root',
  factory: () => {
    throw new Error('FIREBASE_CONFIG debe ser provisto en app.config.ts');
  }
});

/**
 * Token para inyectar el flag de producción
 * Tipo: boolean
 * Ejemplo de uso: constructor(@Inject(IS_PRODUCTION) private isProduction: boolean)
 */
export const IS_PRODUCTION = new InjectionToken<boolean>('is.production', {
  providedIn: 'root',
  factory: () => {
    throw new Error('IS_PRODUCTION debe ser provisto en app.config.ts');
  }
});

/* 
 * CÓMO AGREGAR MÁS TOKENS DE CONFIGURACIÓN:
 * 
 * 1. Define el token con su tipo específico:
 *    export const MI_TOKEN = new InjectionToken<MiTipo>('mi.token', {
 *      providedIn: 'root',
 *      factory: () => {
 *        throw new Error('MI_TOKEN debe ser provisto en app.config.ts');
 *      }
 *    });
 * 
 * 2. Agrégalo a los providers en app.config.ts:
 *    {
 *      provide: MI_TOKEN,
 *      useValue: environment.miValor
 *    }
 * 
 * 3. Úsalo en cualquier servicio:
 *    constructor(@Inject(MI_TOKEN) private miValor: MiTipo) {}
 * 
 * Ejemplos de tokens adicionales que podrías necesitar:
 * - ANALYTICS_CONFIG: Para configuración de Google Analytics
 * - SENTRY_DSN: Para configuración de Sentry
 * - STRIPE_PUBLIC_KEY: Para configuración de Stripe
 * - APP_VERSION: Para la versión de la aplicación
 * - FEATURE_FLAGS: Para flags de características
 * - EXTERNAL_API_KEYS: Para claves de APIs externas
 */