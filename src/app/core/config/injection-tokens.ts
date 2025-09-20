import { InjectionToken } from '@angular/core';
import { EnvironmentConfig } from '../../../environments/environment.interface';

/**
 * Token de inyección para la configuración de entorno
 * Permite inyectar la configuración de entorno como dependencia
 */
export const ENVIRONMENT_CONFIG = new InjectionToken<EnvironmentConfig>('environment.config');

/**
 * Token de inyección para indicar si estamos en producción
 */
export const IS_PRODUCTION = new InjectionToken<boolean>('is.production');

/**
 * Token de inyección para la URL base de la API
 */
export const API_BASE_URL = new InjectionToken<string>('api.base.url');