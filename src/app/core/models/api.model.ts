export interface ApiOptions {
  query?: Record<string, any>;
  headers?: Record<string, string>;
  skipLoader?: boolean;
  observeEvents?: boolean;
  responseType?: 'json' | 'blob' | 'text';
}

export interface ApiResponse<T> {
  data: T;
  meta?: any;
}