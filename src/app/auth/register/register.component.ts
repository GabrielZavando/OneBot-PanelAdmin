
import { Component, Injector, runInInjectionContext } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { updateProfile, getIdToken } from 'firebase/auth';
import { environment } from '../../../environments/environment';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class Register {
  form: FormGroup;
  error: string | null = null;
  success: boolean = false;
  private isSubmitting = false;

  constructor(private fb: FormBuilder, private auth: Auth, private injector: Injector) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  async register() {
    if (this.isSubmitting || this.form.invalid) return;
    this.isSubmitting = true;
    this.error = null;
    this.success = false;
    const { name, email, password } = this.form.value;

    try {
      // Ejecutar llamadas a Firebase dentro del contexto de inyección de Angular
      await runInInjectionContext(this.injector, async () => {
        const cred = await createUserWithEmailAndPassword(this.auth, email, password);

        if (cred.user) {
          try {
            await updateProfile(cred.user, { displayName: name });
          } catch (uErr: any) {
            console.warn('updateProfile failed', uErr);
          }

          // obtener idToken y enviarlo al backend
          const idToken = await getIdToken(cred.user);

          const payload = {
            uid: cred.user.uid,
            email: cred.user.email,
            displayName: name
          };

          const url = `${environment.apiBaseUrl.replace(/\/$/, '')}/auth/register`;
          const res = await fetch(url, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${idToken}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
          });

          if (!res.ok) {
            const text = await res.text();
            throw new Error(`Backend error: ${res.status} ${text}`);
          }
        }
      });

      this.success = true;
      this.form.reset();
    } catch (err: any) {
      this.error = err.message || String(err);
      console.error('Register error:', err);
    } finally {
      this.isSubmitting = false;
    }
  }

  // getters para evitar llamadas directas a form.get(...) en plantilla
  get name() {
    return this.form.get('name');
  }

  get email() {
    return this.form.get('email');
  }

  get password() {
    return this.form.get('password');
  }
}
