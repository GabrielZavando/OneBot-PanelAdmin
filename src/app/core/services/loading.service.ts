/**
 * LoadingService
 * - Lleva conteo de requests HTTP activas.
 * - Exposición:
 *    - activeRequests$: número de solicitudes activas.
 *    - isLoading$: boolean derivado de activeRequests$ > 0.
 * - Métodos: increment() / decrement() con límites (no baja de 0).
 * - Uso: Consumido por loading.interceptor y por la UI (Header) para mostrar un spinner global.
 */
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private activeRequestsSubject = new BehaviorSubject<number>(0);
  readonly activeRequests$: Observable<number> = this.activeRequestsSubject.asObservable();
  readonly isLoading$: Observable<boolean> = this.activeRequests$.pipe(
    map((count) => count > 0),
    distinctUntilChanged()
  );

  increment(): void {
    const next = this.activeRequestsSubject.value + 1;
    this.activeRequestsSubject.next(next);
  }

  decrement(): void {
    const current = this.activeRequestsSubject.value;
    const next = current > 0 ? current - 1 : 0;
    this.activeRequestsSubject.next(next);
  }
}
