/**
 * ApiClientService
 * - Servicio central de HTTP para OneBot-API.
 * - Envuelve HttpClient con inyección de API_BASE_URL.
 * - Construye URLs y params dinámicamente.
 * - Respeta interceptores (auth/loading/error).
 * - Uso:
 *   - query: { page: 1, tags: ['a', 'b'] } → ?page=1&tags=a&tags=b
 *   - headers: { 'Custom': 'value' } fusionados sin sobrescribir Content-Type
 *   - skipLoader: true → añade header X-Skip-Loader: true
 *   - observeEvents: true → reportProgress + observe: 'events' para uploads/descargas
 */
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '@core/config';
import { ApiOptions } from '@core/models/api.model';

@Injectable({ providedIn: 'root' })
export class ApiClientService {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) private baseUrl: string
  ) {}

  get<T>(path: string, options?: ApiOptions): Observable<T> {
    return this.request<T>('GET', path, undefined, options);
  }

  post<T, B = unknown>(path: string, body?: B, options?: ApiOptions): Observable<T> {
    return this.request<T>('POST', path, body, options);
  }

  put<T, B = unknown>(path: string, body?: B, options?: ApiOptions): Observable<T> {
    return this.request<T>('PUT', path, body, options);
  }

  patch<T, B = unknown>(path: string, body?: B, options?: ApiOptions): Observable<T> {
    return this.request<T>('PATCH', path, body, options);
  }

  delete<T>(path: string, options?: ApiOptions): Observable<T> {
    return this.request<T>('DELETE', path, undefined, options);
  }

  private request<T>(method: string, path: string, body?: any, options?: ApiOptions): Observable<any> {
    const url = this.buildUrl(path);
    const params = this.toHttpParams(options?.query);
    const headers = this.buildHeaders(options);

    const httpOptions: any = {
      headers,
      params,
      responseType: options?.responseType || 'json',
      reportProgress: options?.observeEvents || false,
    };

    if (options?.observeEvents) {
      httpOptions.observe = 'events';
    }

    return this.http.request<T>(method, url, { ...httpOptions, body });
  }

  private buildUrl(path: string): string {
    return `${this.baseUrl}/${path}`.replace(/\/+/g, '/');
  }

  private toHttpParams(query?: Record<string, any>): HttpParams {
    let params = new HttpParams();
    if (!query) return params;

    Object.entries(query).forEach(([key, value]) => {
      if (value === undefined || value === null) return;
      if (Array.isArray(value)) {
        value.forEach(v => params = params.append(key, String(v)));
      } else {
        params = params.set(key, String(value));
      }
    });
    return params;
  }

  private buildHeaders(options?: ApiOptions): HttpHeaders {
    let headers = new HttpHeaders();
    if (options?.headers) {
      Object.entries(options.headers).forEach(([key, value]) => {
        headers = headers.set(key, String(value));
      });
    }
    if (options?.skipLoader) {
      headers = headers.set('X-Skip-Loader', 'true');
    }
    return headers;
  }
}

// TODO: Tests
// - buildUrl: concatena correctamente sin dobles /
// - toHttpParams: omite undefined/null, serializa arrays
// - request: configura reportProgress/observe para observeEvents
// - headers: fusiona y añade X-Skip-Loader si skipLoader

// TODO: Integrar AbortController para cancelación si necesario