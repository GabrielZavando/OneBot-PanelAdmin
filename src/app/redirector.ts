import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-redirector',
  standalone: true,
  template: ''
})
export class Redirector {
  constructor(private router: Router, private auth: Auth) {
    // Verificar si hay sesión vigente en localStorage (Firebase Auth)
    const user = localStorage.getItem('firebase:authUser:' + this.auth.app.options.projectId + ':');
    if (user) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
