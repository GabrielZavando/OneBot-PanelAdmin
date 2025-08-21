import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-redirector',
  standalone: true,
  template: ''
})
export class Redirector {
  constructor(private router: Router, private auth: Auth, private authService: AuthService) {
    // Verificar si hay sesión vigente usando el AuthService
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard']);
    } else {
      this.router.navigate(['/register']);
    }
  }
}
