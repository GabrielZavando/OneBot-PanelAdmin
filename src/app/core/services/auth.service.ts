/**
 * AuthService - Servicio de Autenticación
 * 
 * Este servicio centraliza toda la integración con Firebase Auth.
 * Ningún componente debe interactuar directamente con Firebase,
 * siempre debe hacerlo a través de este servicio.
 * 
 * Responsabilidades:
 * - Gestionar el estado de autenticación del usuario
 * - Proporcionar métodos para sign in/out
 * - Exponer observable del usuario autenticado
 * - Manejar tokens de autenticación
 * - Transformar datos de Firebase al modelo User local
 */

import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, from, EMPTY } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

// Firebase imports
import { 
  initializeApp, 
  FirebaseApp,
  FirebaseOptions 
} from 'firebase/app';
import {
  getAuth,
  Auth,
  User as FirebaseUser,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getIdToken as firebaseGetIdToken,
  AuthError
} from 'firebase/auth';

// Local imports
import { FIREBASE_CONFIG } from '../config/app-config.tokens';
import { User } from '../models/user.model';

/**
 * Errores personalizados del AuthService
 */
export enum AuthErrorCode {
  INVALID_CREDENTIALS = 'auth/invalid-credential',
  USER_DISABLED = 'auth/user-disabled',
  USER_NOT_FOUND = 'auth/user-not-found',
  WRONG_PASSWORD = 'auth/wrong-password',
  TOO_MANY_REQUESTS = 'auth/too-many-requests',
  NETWORK_ERROR = 'auth/network-request-failed',
  WEAK_PASSWORD = 'auth/weak-password',
  EMAIL_ALREADY_EXISTS = 'auth/email-already-in-use',
  INVALID_EMAIL = 'auth/invalid-email',
  OPERATION_NOT_ALLOWED = 'auth/operation-not-allowed',
  REQUIRES_RECENT_LOGIN = 'auth/requires-recent-login'
}

/**
 * Servicio de Autenticación
 * 
 * Centraliza toda la lógica de autenticación con Firebase
 * y proporciona una interfaz limpia para el resto de la aplicación.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly firebaseApp: FirebaseApp;
  private readonly auth: Auth;
  private readonly currentUserSubject = new BehaviorSubject<User | null>(null);

  /**
   * Observable que emite el perfil del usuario autenticado
   * Se actualiza automáticamente cuando cambia el estado de autenticación
   */
  public readonly currentUser$: Observable<User | null> = this.currentUserSubject.asObservable();

  constructor(
    @Inject(FIREBASE_CONFIG) private firebaseConfig: FirebaseOptions
  ) {
    // Inicializar Firebase App
    this.firebaseApp = initializeApp(this.firebaseConfig);
    this.auth = getAuth(this.firebaseApp);

    // Configurar listener para cambios de estado de autenticación
    this.setupAuthStateListener();
  }

  /**
   * Configura el listener para cambios en el estado de autenticación
   * Actualiza currentUser$ automáticamente cuando el usuario se autentica/desautentica
   * 
   * @private
   */
  private setupAuthStateListener(): void {
    onAuthStateChanged(this.auth, (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        // Usuario autenticado - convertir a nuestro modelo User
        this.mapFirebaseUserToUser(firebaseUser)
          .then(user => {
            this.currentUserSubject.next(user);
          })
          .catch(error => {
            console.error('Error mapeando usuario de Firebase:', error);
            this.currentUserSubject.next(null);
          });
      } else {
        // Usuario no autenticado
        this.currentUserSubject.next(null);
      }
    });
  }

  /**
   * Autentica un usuario con email y contraseña
   * 
   * @param email - Email del usuario
   * @param password - Contraseña del usuario
   * @returns Promise que resuelve con el perfil del usuario autenticado
   * @throws Error con código específico si la autenticación falla
   */
  public async signIn(email: string, password: string): Promise<User> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
      const user = await this.mapFirebaseUserToUser(userCredential.user);
      
      // El currentUser$ se actualizará automáticamente por onAuthStateChanged
      return user;
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Cierra la sesión del usuario actual
   * 
   * @returns Promise que se resuelve cuando se cierra la sesión
   * @throws Error si hay problemas al cerrar sesión
   */
  public async signOut(): Promise<void> {
    try {
      await firebaseSignOut(this.auth);
      // El currentUser$ se actualizará automáticamente por onAuthStateChanged
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Obtiene el token de ID del usuario autenticado
   * 
   * @param forceRefresh - Si true, fuerza la renovación del token
   * @returns Promise que resuelve con el token de ID
   * @throws Error si no hay usuario autenticado o hay problemas de red
   */
  public async getIdToken(forceRefresh: boolean = false): Promise<string> {
    try {
      const currentUser = this.auth.currentUser;
      
      if (!currentUser) {
        throw new Error('No hay usuario autenticado');
      }

      return await firebaseGetIdToken(currentUser, forceRefresh);
    } catch (error) {
      throw this.handleAuthError(error as AuthError);
    }
  }

  /**
   * Obtiene un token de acceso válido para peticiones API
   * Alias de getIdToken para compatibilidad con interceptors
   * 
   * @param forceRefresh - Si true, fuerza la renovación del token
   * @returns Observable que emite el token de acceso
   */
  public getValidAccessToken(forceRefresh: boolean = false): Observable<string> {
    return from(this.getIdToken(forceRefresh));
  }

  /**
   * Cierra la sesión del usuario actual
   * Alias de signOut para compatibilidad con interceptors
   * 
   * @returns Observable que se completa cuando se cierra la sesión
   */
  public logout(): Observable<void> {
    return from(this.signOut());
  }

  /**
   * Obtiene el usuario actual de forma síncrona
   * 
   * @returns El usuario actual o null si no está autenticado
   */
  public getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verifica si hay un usuario autenticado
   * 
   * @returns true si hay un usuario autenticado
   */
  public isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }

  /**
   * Convierte un FirebaseUser a nuestro modelo User local
   * 
   * @param firebaseUser - Usuario de Firebase
   * @returns Promise que resuelve con el usuario mapeado
   * @private
   */
  private async mapFirebaseUserToUser(firebaseUser: FirebaseUser): Promise<User> {
    try {
      // Obtener custom claims para el rol
      const idTokenResult = await firebaseUser.getIdTokenResult();
      const customClaims = idTokenResult.claims;
      
      const now = new Date();
      
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
        role: (customClaims['role'] as string) || 'user', // Rol desde custom claims
        createdAt: firebaseUser.metadata.creationTime ? 
          new Date(firebaseUser.metadata.creationTime) : now,
        updatedAt: firebaseUser.metadata.lastSignInTime ? 
          new Date(firebaseUser.metadata.lastSignInTime) : now
      };
    } catch (error) {
      console.error('Error obteniendo custom claims:', error);
      
      // Fallback sin custom claims
      const now = new Date();
      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email || '',
        displayName: firebaseUser.displayName || '',
        emailVerified: firebaseUser.emailVerified,
        photoURL: firebaseUser.photoURL,
        role: 'user', // Rol por defecto
        createdAt: firebaseUser.metadata.creationTime ? 
          new Date(firebaseUser.metadata.creationTime) : now,
        updatedAt: firebaseUser.metadata.lastSignInTime ? 
          new Date(firebaseUser.metadata.lastSignInTime) : now
      };
    }
  }

  /**
   * Maneja errores de Firebase Auth y los convierte a errores más descriptivos
   * 
   * @param error - Error de Firebase Auth
   * @returns Error con mensaje descriptivo
   * @private
   */
  private handleAuthError(error: AuthError): Error {
    let message: string;
    
    switch (error.code) {
      case AuthErrorCode.INVALID_CREDENTIALS:
        message = 'Credenciales inválidas. Verifica tu email y contraseña.';
        break;
      case AuthErrorCode.USER_DISABLED:
        message = 'Esta cuenta ha sido deshabilitada.';
        break;
      case AuthErrorCode.USER_NOT_FOUND:
        message = 'No existe una cuenta con este email.';
        break;
      case AuthErrorCode.WRONG_PASSWORD:
        message = 'Contraseña incorrecta.';
        break;
      case AuthErrorCode.TOO_MANY_REQUESTS:
        message = 'Demasiados intentos fallidos. Intenta más tarde.';
        break;
      case AuthErrorCode.NETWORK_ERROR:
        message = 'Error de conexión. Verifica tu internet.';
        break;
      case AuthErrorCode.WEAK_PASSWORD:
        message = 'La contraseña es muy débil.';
        break;
      case AuthErrorCode.EMAIL_ALREADY_EXISTS:
        message = 'Ya existe una cuenta con este email.';
        break;
      case AuthErrorCode.INVALID_EMAIL:
        message = 'El formato del email es inválido.';
        break;
      case AuthErrorCode.OPERATION_NOT_ALLOWED:
        message = 'Operación no permitida.';
        break;
      case AuthErrorCode.REQUIRES_RECENT_LOGIN:
        message = 'Esta operación requiere una autenticación reciente.';
        break;
      default:
        message = `Error de autenticación: ${error.message}`;
    }

    const customError = new Error(message);
    (customError as any).code = error.code;
    return customError;
  }
}