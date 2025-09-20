import { ApplicationConfig, provideBrowserGlobalErrorListeners, inject } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { authInterceptor, loadingInterceptor, errorInterceptor } from '@core/interceptors';
import { AuthService } from '@core/services/auth.service';
import { API_BASE_URL, FIREBASE_CONFIG, IS_PRODUCTION } from '@core/config';

import { routes } from './app.routes';

// FontAwesome imports
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { configureFontAwesome, fontAwesomeConfig } from './shared/fontawesome.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(withInterceptors([
      // Orden importa: auth → loading → error
      authInterceptor,
      loadingInterceptor,
      errorInterceptor,
    ])),
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),

    // FontAwesome configuration
    fontAwesomeConfig,
    {
      provide: 'FONTAWESOME_CONFIG',
      useFactory: () => {
        const library = inject(FaIconLibrary);
        configureFontAwesome(library);
        return library;
      }
    },

    // Configuración de tokens para inyección de dependencias
    // Estos providers permiten inyectar valores específicos de configuración
    // en cualquier servicio usando @Inject(TOKEN_NAME)
    {
      provide: API_BASE_URL,
      useValue: environment.apiBaseUrl
    },
    {
      provide: FIREBASE_CONFIG,
      useValue: environment.firebase
    },
    {
      provide: IS_PRODUCTION,
      useValue: environment.production
    }
  ]
};
