import { EnvironmentConfig } from './environment.interface';

/**
 * Configuración de entorno para desarrollo
 * Estos valores son para pruebas locales y desarrollo
 */
export const environment: EnvironmentConfig = {
  production: false,
  firebase: {
    // Configuración Firebase para desarrollo
    apiKey: "AIzaSyBCAhxBCoc1_OXfpsddBmbfx-EZpM4rwek",
    authDomain: "onebot-dev.firebaseapp.com",
    projectId: "onebot-dev",
    storageBucket: "onebot-dev.appspot.com",
    messagingSenderId: "371109272552",
    appId: "1:371109272552:web:f5ccdfca754e3b144ca25d"
  },
  apiBaseUrl: 'http://localhost:3000/api/v1'
};
