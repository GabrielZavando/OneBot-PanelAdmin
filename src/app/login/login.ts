
import { Component, Injector, runInInjectionContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import { getIdToken } from 'firebase/auth';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  form: FormGroup;
  error: string | null = null;
  success: boolean = false;

  constructor(
    private fb: FormBuilder, 
    private auth: Auth, 
    private router: Router,
    private authService: AuthService,
    private injector: Injector
  ) {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async login() {
    this.error = null;
    this.success = false;
    const { email, password } = this.form.value;
    
    try {
      // Ejecutar llamadas a Firebase dentro del contexto de inyección de Angular
      await runInInjectionContext(this.injector, async () => {
        const userCredential = await signInWithEmailAndPassword(this.auth, email, password);
        const user = userCredential.user;
        
        // Obtener el ID token para almacenar en localStorage
        const idToken = await getIdToken(user);
        
        // Crear objeto de sesión
        const sessionData = {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          idToken: idToken,
          loginTime: new Date().toISOString()
        };
        
        // Usar el servicio de autenticación para almacenar la sesión
        this.authService.setUserSession(sessionData);
        
        this.success = true;
        this.form.reset();
        
        // Navegar inmediatamente al dashboard
        this.router.navigate(['/dashboard']);
      });
      
    } catch (err: any) {
      this.error = err.message;
    }
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
