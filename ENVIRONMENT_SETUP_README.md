# Sistema de Configuración de Entornos

Este proyecto utiliza un sistema robusto de configuración de entornos para manejar diferentes configuraciones entre desarrollo y producción.

## Estructura de Archivos

```
src/
├── environments/
│   ├── environment.interface.ts     # Interfaz TypeScript para la configuración
│   ├── environment.ts              # Configuración para desarrollo
│   └── environment.prod.ts         # Configuración para producción
└── app/
    └── core/
        ├── services/
        │   └── environment.service.ts  # Servicio para acceder a la configuración
        └── config/
            ├── app.config.ts           # Configuración adicional de la app
            ├── injection-tokens.ts     # Tokens de inyección
            ├── environment.providers.ts # Proveedores para DI
            └── index.ts               # Exports principales
```

## Configuración de Entornos

### Desarrollo (`environment.ts`)
- `production: false`
- Configuración Firebase para desarrollo
- API local: `http://localhost:3000/api/v1`

### Producción (`environment.prod.ts`)
- `production: true`
- Configuración Firebase para producción
- API de producción: `https://api.onebot.app/api/v1`

## Uso del EnvironmentService

### Inyección en Servicios

```typescript
import { Injectable } from '@angular/core';
import { EnvironmentService } from '@core/services';

@Injectable()
export class MiServicio {
  constructor(private environmentService: EnvironmentService) {}

  private apiUrl = this.environmentService.apiBaseUrl;

  ejemplo() {
    // Verificar si estamos en producción
    if (this.environmentService.isProduction) {
      // Lógica para producción
    }

    // Construir URL de API
    const url = this.environmentService.buildApiUrl('users');
    
    // Obtener configuración Firebase
    const firebaseConfig = this.environmentService.firebaseConfig;
  }
}
```

### Inyección con Tokens

```typescript
import { Injectable, Inject } from '@angular/core';
import { API_BASE_URL, IS_PRODUCTION } from '@core/config';

@Injectable()
export class OtroServicio {
  constructor(
    @Inject(API_BASE_URL) private apiUrl: string,
    @Inject(IS_PRODUCTION) private isProduction: boolean
  ) {}
}
```

## Build y Despliegue

### Desarrollo
```bash
ng serve
# Usa automáticamente environment.ts
```

### Producción
```bash
ng build --configuration=production
# Reemplaza environment.ts con environment.prod.ts automáticamente
```

## Variables de Entorno para CI/CD

Para producción, usa el script `scripts/generate-env.js` que lee variables de entorno:

### Variables Requeridas
- `FIREBASE_API_KEY`
- `FIREBASE_AUTH_DOMAIN`
- `FIREBASE_PROJECT_ID`
- `FIREBASE_STORAGE_BUCKET`
- `FIREBASE_MESSAGING_SENDER_ID`
- `FIREBASE_APP_ID`
- `API_BASE_URL`

### Uso en CI/CD
```bash
# Establecer variables de entorno
export FIREBASE_API_KEY="tu-api-key"
export FIREBASE_AUTH_DOMAIN="tu-proyecto.firebaseapp.com"
# ... otras variables

# Generar archivo de producción
node scripts/generate-env.js

# Build de producción
ng build --configuration=production
```

## Ejemplo de Pipeline (GitHub Actions)

```yaml
name: Build and Deploy
on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Generate production environment
        run: node scripts/generate-env.js
        env:
          FIREBASE_API_KEY: ${{ secrets.FIREBASE_API_KEY }}
          FIREBASE_AUTH_DOMAIN: ${{ secrets.FIREBASE_AUTH_DOMAIN }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID }}
          FIREBASE_STORAGE_BUCKET: ${{ secrets.FIREBASE_STORAGE_BUCKET }}
          FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.FIREBASE_MESSAGING_SENDER_ID }}
          FIREBASE_APP_ID: ${{ secrets.FIREBASE_APP_ID }}
          API_BASE_URL: ${{ secrets.API_BASE_URL }}
          
      - name: Build application
        run: ng build --configuration=production
```

## Seguridad

⚠️ **IMPORTANTE:**
- Nunca comitees credenciales reales al repositorio
- Usa variables de entorno en CI/CD para valores sensibles
- El archivo `environment.prod.ts` debe ser generado automáticamente
- Agrega `environment.prod.ts` al `.gitignore` si es necesario

## Métodos Útiles del EnvironmentService

| Método | Descripción | Retorno |
|--------|-------------|---------|
| `isProduction` | Indica si está en producción | `boolean` |
| `isDevelopment` | Indica si está en desarrollo | `boolean` |
| `firebaseConfig` | Configuración Firebase | `FirebaseConfig` |
| `apiBaseUrl` | URL base de la API | `string` |
| `buildApiUrl(endpoint)` | Construye URL completa | `string` |
| `isFirebaseConfigured()` | Verifica configuración Firebase | `boolean` |
| `getDebugInfo()` | Info de debug (solo desarrollo) | `object` |