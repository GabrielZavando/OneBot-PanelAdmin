/**
 * AuthGuard - Guard de Autenticación
 * 
 * Guard funcional que valida si existe una sesión activa del usuario.
 * Este guard solo se encarga de la AUTENTICACIÓN (si hay sesión),
 * NO de la AUTORIZACIÓN (roles/permisos). Para validación de roles
 * se debe usar el RoleGuard que se implementará posteriormente.
 * 
 * Funcionamiento:
 * - Verifica si hay un usuario autenticado consultando AuthService.currentUser$
 * - Si hay usuario: permite la navegación (return true)
 * - Si no hay usuario: redirige a /login con returnUrl y bloquea navegación
 * 
 * Características:
 * - Usa formato funcional CanActivateFn (Angular 20+)
 * - Lee un único valor del observable (no deja suscripciones vivas)
 * - Maneja estados de inicialización esperando la primera emisión
 * - Conserva returnUrl para volver tras login exitoso
 * 
 * @example
 * // En las rutas:
 * {
 *   path: 'dashboard',
 *   component: DashboardComponent,
 *   canActivate: [AuthGuard]
 * }
 */

import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Observable, map, take, filter } from 'rxjs';

import { AuthService } from '../services/auth.service';
import { User } from '../models/user.model';

/**
 * Guard funcional para validar autenticación de usuarios
 * 
 * @param route - Snapshot de la ruta actual
 * @param state - Estado actual del router
 * @returns Observable que emite true si está autenticado, o UrlTree para redirección
 */
export const AuthGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean | UrlTree> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  console.log('🛡️ AuthGuard: Validando acceso a:', state.url);

  return authService.currentUser$.pipe(
    // Filtrar emisiones nulas durante la inicialización
    // Solo proceder cuando tengamos una respuesta definitiva
    filter((user: User | null) => {
      // Si es null después de la inicialización, proceder
      // Si es un User object, proceder
      // Esto evita procesar valores intermedios durante el setup
      return user !== undefined;
    }),
    
    // Tomar solo el primer valor válido para evitar suscripciones vivas
    take(1),
    
    // Mapear el resultado a boolean o UrlTree
    map((user: User | null): boolean | UrlTree => {
      const isAuthenticated = user !== null;
      
      console.log('🛡️ AuthGuard: Estado de autenticación:', {
        isAuthenticated,
        currentUrl: state.url,
        userUid: user?.uid || 'N/A'
      });

      if (isAuthenticated) {
        // Usuario autenticado: permitir navegación
        console.log('✅ AuthGuard: Acceso permitido para usuario:', user.displayName || user.email);
        return true;
      } else {
        // Usuario no autenticado: redirigir a login con returnUrl
        const returnUrl = state.url;
        console.log('❌ AuthGuard: Usuario no autenticado, redirigiendo a login con returnUrl:', returnUrl);
        
        // Crear UrlTree para redirección con query parameters
        const loginUrlTree = router.createUrlTree(['/login'], {
          queryParams: { returnUrl }
        });
        
        return loginUrlTree;
      }
    })
  );
};

/**
 * Alias del AuthGuard para compatibilidad con nomenclatura de clase
 * 
 * @deprecated Use AuthGuard directamente
 */
export const authGuard = AuthGuard;

/**
 * Helper function para verificar autenticación de forma síncrona
 * 
 * NOTA: Esta función debe usarse con cuidado ya que puede retornar
 * false durante la inicialización. Preferir usar el guard en las rutas.
 * 
 * @param authService - Instancia del AuthService
 * @returns true si hay usuario autenticado, false en caso contrario
 */
export function isUserAuthenticated(authService: AuthService): boolean {
  const currentUser = authService.getCurrentUser();
  return currentUser !== null;
}

/**
 * Helper function para obtener la URL de redirección tras login
 * 
 * @param route - ActivatedRoute o query params
 * @returns URL de retorno o ruta por defecto
 */
export function getReturnUrl(queryParams: any): string {
  const returnUrl = queryParams['returnUrl'];
  
  // Validar que la returnUrl sea segura (no externa)
  if (returnUrl && typeof returnUrl === 'string' && returnUrl.startsWith('/')) {
    return returnUrl;
  }
  
  // Ruta por defecto tras login
  return '/dashboard';
}

/* TODO: Implementar tests unitarios
 * 
 * Tests a implementar:
 * 
 * describe('AuthGuard', () => {
 *   it('should allow access when user is authenticated', () => {
 *     // Mock authService.currentUser$ emitting a User
 *     // Expect guard to return true
 *   });
 * 
 *   it('should redirect to login when user is not authenticated', () => {
 *     // Mock authService.currentUser$ emitting null
 *     // Expect guard to return UrlTree to /login with returnUrl
 *   });
 * 
 *   it('should preserve returnUrl in query params', () => {
 *     // Test that current route URL is passed as returnUrl
 *   });
 * 
 *   it('should handle initialization state correctly', () => {
 *     // Test behavior during service initialization
 *   });
 * });
 * 
 * describe('Helper Functions', () => {
 *   it('should validate return URLs correctly', () => {
 *     // Test getReturnUrl with various inputs
 *   });
 * });
 */
