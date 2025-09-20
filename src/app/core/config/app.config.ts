/**
 * Configuración adicional de la aplicación
 * Valores que no dependen del entorno
 */
export const AppConfig = {
  /**
   * Configuración de autenticación
   */
  auth: {
    tokenRefreshThreshold: 5 * 60 * 1000, // 5 minutos en ms
    maxRetryAttempts: 3,
    retryDelay: 1000, // 1 segundo
  },

  /**
   * Configuración de la aplicación
   */
  app: {
    name: 'OneBot Admin',
    version: '1.0.0',
    defaultPageSize: 10,
    maxPageSize: 100,
  },

  /**
   * Configuración de UI
   */
  ui: {
    debounceTime: 300, // Para búsquedas
    animationDuration: 200,
    toastDuration: 5000,
  },

  /**
   * Configuración de validación
   */
  validation: {
    minPasswordLength: 8,
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedDocumentTypes: ['application/pdf', 'text/plain', 'application/msword'],
  },

  /**
   * Configuración de cacheo
   */
  cache: {
    defaultTtl: 5 * 60 * 1000, // 5 minutos
    userProfileTtl: 30 * 60 * 1000, // 30 minutos
    staticDataTtl: 60 * 60 * 1000, // 1 hora
  }
} as const;