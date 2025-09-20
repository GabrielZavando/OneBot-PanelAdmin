/**
 * LoginPage Component
 *
 * Página de autenticación que permite a los usuarios iniciar sesión
 * en la aplicación utilizando email y contraseña.
 *
 * Características:
 * - Formulario reactivo con validaciones
 * - Integración con AuthService
 * - Manejo de errores de autenticación con NotificationService
 * - Redirección automática tras login exitoso
 * - Interfaz responsive y accesible
 * - Redirección si ya hay sesión activa
 */

import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { LoadingService } from '../../core/services/loading.service';
import { User } from '../../core/models/user.model';
import { environment } from '../../../environments/environment';

// FontAwesome imports
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faExclamationTriangle, faEnvelope, faEye, faEyeSlash, faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * Estado del formulario de login
 */
interface LoginState {
  isLoading: boolean;
  error: string | null;
  showPassword: boolean;
}

/**
 * Constantes para mensajes de error
 */
const ERROR_MESSAGES = {
  REQUIRED_EMAIL: 'El email es requerido',
  INVALID_EMAIL: 'Formato de email inválido',
  EMAIL_TOO_LONG: 'Email demasiado largo',
  REQUIRED_PASSWORD: 'La contraseña es requerida',
  PASSWORD_TOO_SHORT: 'La contraseña debe tener al menos 6 caracteres',
  PASSWORD_TOO_LONG: 'La contraseña es demasiado larga',
  INVALID_CREDENTIALS: 'Credenciales inválidas. Verifica tu email y contraseña.',
  USER_NOT_FOUND: 'Usuario no encontrado. Verifica tu email.',
  WRONG_PASSWORD: 'Contraseña incorrecta.',
  NETWORK_ERROR: 'Error de conexión. Verifica tu conexión a internet.',
  UNKNOWN_ERROR: 'Error desconocido. Inténtalo de nuevo.'
} as const;

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    FaIconComponent
  ],
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit, OnDestroy {
  // Iconos de FontAwesome
  faExclamationTriangle = faExclamationTriangle;
  faEnvelope = faEnvelope;
  faEye = faEye;
  faEyeSlash = faEyeSlash;
  faTimes = faTimes;
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly formBuilder = inject(FormBuilder);
  private readonly notificationService = inject(NotificationService);
  private readonly loadingService = inject(LoadingService);
  private userSubscription?: Subscription;

  /**
   * Formulario reactivo para el login
   */
  public readonly loginForm: FormGroup = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.email,
        Validators.maxLength(254)
      ]
    ],
    password: [
      '',
      [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(128)
      ]
    ]
  });

  /**
   * Estado actual del componente
   */
  public state: LoginState = {
    isLoading: false,
    error: null,
    showPassword: false
  };

  ngOnInit(): void {
    // Suscribirse a currentUser$ para redirección si ya hay sesión
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.redirectAfterLogin();
      }
    });
  }

  ngOnDestroy(): void {
    this.userSubscription?.unsubscribe();
  }

  /**
   * Maneja el envío del formulario de login
   */
  public async onSubmit(): Promise<void> {
    // Validar formulario
    if (this.loginForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    // Extraer credenciales
    const { email, password } = this.loginForm.value;

    // Iniciar proceso de autenticación
    this.state.isLoading = true;
    this.state.error = null;

    // Deshabilitar formulario durante la carga
    this.loginForm.disable();

    // Activar loader global
    this.loadingService.increment();

    try {
      // Intentar autenticación
      const user: User = await this.authService.signIn(email, password);

      // Login exitoso - redirigir
      if (!environment.production) {
        console.log('Login exitoso:', user.displayName || user.email);
      }
      this.redirectAfterLogin();

    } catch (error: any) {
      // Manejar error de autenticación
      const errorMessage = this.mapFirebaseError(error.code);
      this.notificationService.toastError(errorMessage);
      this.state.error = errorMessage;

      if (!environment.production) {
        console.error('Error en login:', error);
      }

    } finally {
      this.state.isLoading = false;
      // Rehabilitar formulario
      this.loginForm.enable();
      // Desactivar loader global
      this.loadingService.decrement();
    }
  }

  /**
   * Alterna la visibilidad de la contraseña
   */
  public togglePasswordVisibility(): void {
    if (!this.state.isLoading) {
      this.state.showPassword = !this.state.showPassword;
    }
  }

  /**
   * Limpia el error actual
   */
  public clearError(): void {
    this.state.error = null;
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   */
  public getFieldError(fieldName: string): string | null {
    const field = this.loginForm.get(fieldName);

    if (!field || !field.touched || !field.errors) {
      return null;
    }

    // Errores de email
    if (fieldName === 'email') {
      if (field.errors['required']) return ERROR_MESSAGES.REQUIRED_EMAIL;
      if (field.errors['email']) return ERROR_MESSAGES.INVALID_EMAIL;
      if (field.errors['maxlength']) return ERROR_MESSAGES.EMAIL_TOO_LONG;
    }

    // Errores de contraseña
    if (fieldName === 'password') {
      if (field.errors['required']) return ERROR_MESSAGES.REQUIRED_PASSWORD;
      if (field.errors['minlength']) return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
      if (field.errors['maxlength']) return ERROR_MESSAGES.PASSWORD_TOO_LONG;
    }

    return null;
  }

  /**
   * Verifica si un campo tiene errores
   */
  public hasFieldError(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(field && field.touched && field.errors);
  }

  /**
   * Verifica si el formulario es válido
   */
  public get isFormValid(): boolean {
    return this.loginForm.valid;
  }

  /**
   * Marca todos los campos del formulario como touched
   * para mostrar errores de validación
   */
  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const field = this.loginForm.get(key);
      if (field) {
        field.markAsTouched();
      }
    });
  }

  /**
   * Maneja el evento de tecla presionada
   * Permite enviar el formulario con Enter
   */
  public onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && this.isFormValid && !this.state.isLoading) {
      this.onSubmit();
    }
  }

  /**
   * Redirige después del login exitoso
   */
  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    this.router.navigateByUrl(returnUrl);
  }

  /**
   * Mapea errores de Firebase a mensajes claros
   */
  private mapFirebaseError(errorCode?: string): string {
    switch (errorCode) {
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
        return ERROR_MESSAGES.INVALID_CREDENTIALS;
      case 'auth/user-not-found':
        return ERROR_MESSAGES.USER_NOT_FOUND;
      case 'auth/wrong-password':
        return ERROR_MESSAGES.WRONG_PASSWORD;
      case 'auth/network-request-failed':
        return ERROR_MESSAGES.NETWORK_ERROR;
      default:
        return ERROR_MESSAGES.UNKNOWN_ERROR;
    }
  }

  /**
   * Maneja el enlace "¿Olvidaste tu contraseña?"
   */
  public onForgotPassword(event: Event): void {
    event.preventDefault();
    // TODO: Implementar funcionalidad de recuperación de contraseña
    this.notificationService.toastInfo('Funcionalidad de recuperación de contraseña próximamente disponible.');
  }

  /**
   * Maneja el enlace "Crear cuenta"
   */
  public onSignUp(event: Event): void {
    event.preventDefault();
    // TODO: Implementar navegación a página de registro
    this.notificationService.toastInfo('Funcionalidad de registro próximamente disponible.');
  }
}