/**
 * NotificationService (placeholder)
 * - Expone toastError y toastInfo para mostrar mensajes al usuario.
 * - Implementación simple por ahora (alert/console).
 * - TODO: Reemplazar por un componente de toasts real (p.ej. snackbar).
 */
import { Injectable } from '@angular/core';

export interface ToastOptions {
  durationMs?: number;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  toastError(message: string, _options?: ToastOptions): void {
    // Evitar revelar PII: mostrar mensaje genérico
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    } else {
      console.error('[ToastError]', message);
    }
  }

  toastInfo(message: string, _options?: ToastOptions): void {
    if (typeof window !== 'undefined' && window.alert) {
      window.alert(message);
    } else {
      console.info('[ToastInfo]', message);
    }
  }
}
