import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';

import { LoginComponent } from './login.component';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

// Mock del AuthService
class MockAuthService {
  signIn = jasmine.createSpy('signIn');
  currentUser$ = of(null);
}

// Mock del Router
class MockRouter {
  navigate = jasmine.createSpy('navigate').and.returnValue(Promise.resolve(true));
}

// Mock User para tests
const mockUser: User = {
  uid: 'test-uid',
  email: 'test@example.com',
  displayName: 'Test User',
  emailVerified: true,
  photoURL: null,
  role: 'user',
  createdAt: new Date(),
  updatedAt: new Date()
};

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let mockAuthService: MockAuthService;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    mockAuthService = new MockAuthService();
    mockRouter = new MockRouter();

    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form and default state', () => {
    expect(component.loginForm.get('email')?.value).toBe('');
    expect(component.loginForm.get('password')?.value).toBe('');
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBeNull();
    expect(component.state.showPassword).toBe(false);
  });

  it('should validate email field correctly', () => {
    const emailControl = component.loginForm.get('email');
    
    // Email requerido
    emailControl?.setValue('');
    emailControl?.markAsTouched();
    expect(component.getFieldError('email')).toBe('El email es requerido');
    
    // Email inválido
    emailControl?.setValue('invalid-email');
    expect(component.getFieldError('email')).toBe('Formato de email inválido');
    
    // Email válido
    emailControl?.setValue('test@example.com');
    expect(component.getFieldError('email')).toBeNull();
  });

  it('should validate password field correctly', () => {
    const passwordControl = component.loginForm.get('password');
    
    // Password requerido
    passwordControl?.setValue('');
    passwordControl?.markAsTouched();
    expect(component.getFieldError('password')).toBe('La contraseña es requerida');
    
    // Password muy corto
    passwordControl?.setValue('123');
    expect(component.getFieldError('password')).toBe('La contraseña debe tener al menos 6 caracteres');
    
    // Password válido
    passwordControl?.setValue('password123');
    expect(component.getFieldError('password')).toBeNull();
  });

  it('should toggle password visibility', () => {
    expect(component.state.showPassword).toBe(false);
    
    component.togglePasswordVisibility();
    expect(component.state.showPassword).toBe(true);
    
    component.togglePasswordVisibility();
    expect(component.state.showPassword).toBe(false);
  });

  it('should clear error when clearError is called', () => {
    component.state.error = 'Test error';
    component.clearError();
    expect(component.state.error).toBeNull();
  });

  it('should not submit if form is invalid', async () => {
    // Formulario vacío es inválido
    await component.onSubmit();
    
    expect(mockAuthService.signIn).not.toHaveBeenCalled();
    expect(component.loginForm.get('email')?.touched).toBe(true);
    expect(component.loginForm.get('password')?.touched).toBe(true);
  });

  it('should submit successfully with valid credentials', async () => {
    // Configurar formulario válido
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Mock successful sign in
    mockAuthService.signIn.and.returnValue(Promise.resolve(mockUser));
    
    await component.onSubmit();
    
    expect(mockAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'password123');
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/dashboard']);
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBeNull();
  });

  it('should handle sign in error', async () => {
    // Configurar formulario válido
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'wrongpassword'
    });
    
    // Mock failed sign in
    const errorMessage = 'Credenciales inválidas';
    mockAuthService.signIn.and.returnValue(Promise.reject(new Error(errorMessage)));
    
    await component.onSubmit();
    
    expect(mockAuthService.signIn).toHaveBeenCalledWith('test@example.com', 'wrongpassword');
    expect(mockRouter.navigate).not.toHaveBeenCalled();
    expect(component.state.isLoading).toBe(false);
    expect(component.state.error).toBe(errorMessage);
  });

  it('should handle keyboard events correctly', () => {
    spyOn(component, 'onSubmit');
    
    // Formulario válido
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    
    // Presionar Enter
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(enterEvent);
    
    expect(component.onSubmit).toHaveBeenCalled();
  });

  it('should not submit on Enter if form is invalid', () => {
    spyOn(component, 'onSubmit');
    
    // Formulario inválido
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(enterEvent);
    
    expect(component.onSubmit).not.toHaveBeenCalled();
  });

  it('should not submit on Enter if loading', () => {
    spyOn(component, 'onSubmit');
    
    // Formulario válido pero cargando
    component.loginForm.patchValue({
      email: 'test@example.com',
      password: 'password123'
    });
    component.state.isLoading = true;
    
    const enterEvent = new KeyboardEvent('keydown', { key: 'Enter' });
    component.onKeyDown(enterEvent);
    
    expect(component.onSubmit).not.toHaveBeenCalled();
  });
});