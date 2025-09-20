/**
 * LoadingInterceptor (Angular 20, funcional)
 * - Solo actúa sobre URLs que comienzan con environment.apiBaseUrl.
 * - Incrementa el contador de LoadingService al iniciar request y decrementa SIEMPRE en finalize().
 * - Excluye de conteo: requests con header 'X-Skip-Loader: true' y heurística para reportProgress/observe events.
 * - Nota: La UI puede aplicar un debounce visual (150–250ms) para evitar parpadeos.
 */
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent } from '@angular/common/http';
import { inject } from '@angular/core';
import { environment } from '@environments/environment';
import { LoadingService } from '@core/services/loading.service';
import { finalize, Observable } from 'rxjs';

export const loadingInterceptor: HttpInterceptorFn = (request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const loadingService = inject(LoadingService);

  // Solo requests a la API
  if (!request.url.startsWith(environment.apiBaseUrl)) {
    return next(request);
  }

  // Excluir por header explícito
  const skipHeader = request.headers.get('X-Skip-Loader');
  if (skipHeader && skipHeader.toLowerCase() === 'true') {
    return next(request);
  }

  // Heurística: si la request es para upload/download con reportProgress u observe: 'events', no contar
  const isProgressRequest = request.reportProgress === true || (request.responseType === 'blob');
  if (isProgressRequest) {
    return next(request);
  }

  loadingService.increment();
  return next(request).pipe(
    finalize(() => loadingService.decrement())
  );
};
