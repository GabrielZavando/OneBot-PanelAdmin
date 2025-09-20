/**
 * AuthInterceptor (Angular 20, formato funcional):
 * - Solo aplica sobre environment.apiBaseUrl.
 * - Añade Authorization: Bearer <token> si no existe y no es endpoint público.
 * - Redirige a /login?returnUrl=<url actual> en caso de error 401/403.
 * - Usa HttpInterceptorFn y DI funcional (inject()).
 */
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { environment } from '@environments/environment';
import { Router } from '@angular/router';
import { from, Observable, of, EMPTY, catchError, switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const publicEndpoints = ['/auth/login', '/auth/refresh'];

  // Solo agregar autorización a peticiones a nuestro API
  if (request.url.startsWith(environment.apiBaseUrl)) {
    // Excluir endpoints públicos
    const isPublicEndpoint = publicEndpoints.some(endpoint => request.url.includes(endpoint));
    if (isPublicEndpoint) {
      return next(request).pipe(
        catchError((error: any) => handleAuthError(error, router, request))
      );
    }

    // No duplicar header Authorization
    if (request.headers.has('Authorization')) {
      return next(request).pipe(
        catchError((error: any) => handleAuthError(error, router, request))
      );
    }

    // Obtener token actual (getIdToken() puede devolver Promise o Observable)
    // Si es Promise, convertir a Observable con from()
  const tokenObservable = from(authService.getIdToken() as any) as Observable<string | null>;

    return tokenObservable.pipe(
      switchMap((token: string | null) => {
        if (!token) {
          // Sin token, continuar sin modificar
          return next(request);
        }
        // Debug solo en desarrollo
        if (!environment.production) {
          console.debug('DEBUG AuthInterceptor:', {
            url: request.url,
            method: request.method,
            hasToken: !!token,
            tokenPreview: token ? token.substring(0, 50) + '...' : 'NO_TOKEN'
          });
        }
        const authRequest = request.clone({
          headers: request.headers.set('Authorization', `Bearer ${token}`)
        });
        return next(authRequest);
      }),
      catchError((error: any) => handleAuthError(error, router, request))
    );
  }
  // Para todas las demás peticiones, continuar sin modificar
  return next(request);
};

function handleAuthError(error: any, router: Router, request: HttpRequest<any>): Observable<never> {
  if (error instanceof HttpErrorResponse && (error.status === 401 || error.status === 403)) {
    // Redirigir a login con returnUrl
    const returnUrl = encodeURIComponent(router.url);
    router.navigate(['/login'], { queryParams: { returnUrl } });
    // Completar el observable sin propagar error
    return EMPTY as unknown as Observable<never>;
  }
  throw error;
}
