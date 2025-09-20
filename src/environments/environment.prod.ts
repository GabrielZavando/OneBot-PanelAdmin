import { EnvironmentConfig } from './environment.interface';

/**
 * Configuración de entorno para producción
 * ⚠️ IMPORTANTE: Estos valores deben ser reemplazados por CI/CD durante el build
 * NUNCA commitear credenciales reales de producción al repositorio
 */
export const environment: EnvironmentConfig = {
  production: true,
  firebase: {
    // Configuración Firebase para producción
    // Estos valores serán reemplazados por el pipeline de CI/CD usando scripts/generate-env.js
    apiKey: "PROD_FIREBASE_API_KEY",
    authDomain: "onebot-prod.firebaseapp.com", 
    projectId: "onebot-prod",
    storageBucket: "onebot-prod.appspot.com",
    messagingSenderId: "PROD_MESSAGING_SENDER_ID",
    appId: "PROD_FIREBASE_APP_ID"
  },
  apiBaseUrl: 'https://api.onebot.app/api/v1'
};
