#!/usr/bin/env node

/**
 * Script para generar el archivo environment.prod.ts con variables de entorno
 * Uso: node scripts/generate-env.js
 * 
 * Variables de entorno requeridas:
 * - FIREBASE_API_KEY
 * - FIREBASE_AUTH_DOMAIN
 * - FIREBASE_PROJECT_ID
 * - FIREBASE_STORAGE_BUCKET
 * - FIREBASE_MESSAGING_SENDER_ID
 * - FIREBASE_APP_ID
 * - API_BASE_URL
 */

const fs = require('fs');
const path = require('path');

// Función para validar que todas las variables requeridas estén presentes
function validateEnvironmentVariables() {
  const requiredVars = [
    'FIREBASE_API_KEY',
    'FIREBASE_AUTH_DOMAIN', 
    'FIREBASE_PROJECT_ID',
    'FIREBASE_STORAGE_BUCKET',
    'FIREBASE_MESSAGING_SENDER_ID',
    'FIREBASE_APP_ID',
    'API_BASE_URL'
  ];

  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Error: Las siguientes variables de entorno son requeridas pero no están definidas:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPor favor define todas las variables antes de ejecutar este script.');
    process.exit(1);
  }

  console.log('✅ Todas las variables de entorno requeridas están presentes');
}

// Función para generar el contenido del archivo environment.prod.ts
function generateEnvironmentContent() {
  return `import { EnvironmentConfig } from './environment.interface';

/**
 * Configuración de entorno para producción
 * Generado automáticamente por scripts/generate-env.js
 * ⚠️ No modificar manualmente - será sobrescrito en cada build
 */
export const environment: EnvironmentConfig = {
  production: true,
  firebase: {
    apiKey: "${process.env.FIREBASE_API_KEY}",
    authDomain: "${process.env.FIREBASE_AUTH_DOMAIN}",
    projectId: "${process.env.FIREBASE_PROJECT_ID}",
    storageBucket: "${process.env.FIREBASE_STORAGE_BUCKET}",
    messagingSenderId: "${process.env.FIREBASE_MESSAGING_SENDER_ID}",
    appId: "${process.env.FIREBASE_APP_ID}"
  },
  apiBaseUrl: "${process.env.API_BASE_URL}"
};
`;
}

// Función principal
function main() {
  console.log('🔧 Generando archivo environment.prod.ts...');

  // Validar variables de entorno
  validateEnvironmentVariables();

  // Generar contenido del archivo
  const content = generateEnvironmentContent();

  // Escribir archivo
  const envPath = path.join(__dirname, '../src/environments/environment.prod.ts');
  
  try {
    fs.writeFileSync(envPath, content, 'utf8');
    console.log('✅ Archivo environment.prod.ts generado exitosamente');
    console.log(`📍 Ubicación: ${envPath}`);
  } catch (error) {
    console.error('❌ Error al escribir el archivo environment.prod.ts:', error.message);
    process.exit(1);
  }
}

// Ejecutar solo si este archivo es el principal
if (require.main === module) {
  main();
}

module.exports = { generateEnvironmentContent, validateEnvironmentVariables };