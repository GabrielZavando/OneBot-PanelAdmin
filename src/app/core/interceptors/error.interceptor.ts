/**
 * ErrorInterceptor (Angular 20, funcional)
 * - Maneja errores de respuestas contra environment.apiBaseUrl.
 * - 401/403: redirige a /login?returnUrl y no muestra toast.
 * - 0: muestra mensaje de desconexión.
 * - 5xx: mensaje genérico de servidor.
 * - 4xx (excluyendo 401/403): mensajes derivados del payload si existen.
 * - Re-lanza el error para manejo en capas superiores.
 */
import { HttpInterceptorFn, HttpErrorResponse, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@environments/environment';
import { NotificationService } from '@core/services/notification.service';
import { catchError, throwError, Observable } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<any> => {
  const router = inject(Router);
  const notifier = inject(NotificationService);

  // Solo manejar respuestas de la API
  if (!request.url.startsWith(environment.apiBaseUrl)) {
    return next(request);
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (!environment.production) {
        console.error('[ErrorInterceptor] HTTP Error:', error);
      }

      // 401/403: redirigir a login sin mostrar toast
      if (error.status === 401 || error.status === 403) {
        const atLogin = router.url?.startsWith('/login');
        if (!atLogin) {
          const returnUrl = encodeURIComponent(router.url || '/');
          router.navigate(['/login'], { queryParams: { returnUrl } });
        }
        return throwError(() => error);
      }

      // Network error
      if (error.status === 0) {
        notifier.toastError('No hay conexión con el servidor. Intenta nuevamente.');
        return throwError(() => error);
      }

      // 5xx
      if (error.status >= 500) {
        notifier.toastError('Error en el servidor. Estamos trabajando en ello.');
        return throwError(() => error);
      }

      // 4xx (excluye 401/403)
      if (error.status >= 400 && error.status < 500) {
        const payload = (error.error || {}) as any;
        let message = payload?.message as string | undefined;
        if (!message && Array.isArray(payload?.errors) && payload.errors.length) {
          message = payload.errors.join(', ');
        }
        notifier.toastError(message || 'Solicitud inválida. Revisa los datos e inténtalo otra vez.');
        return throwError(() => error);
      }

      return throwError(() => error);
    })
  );
};
