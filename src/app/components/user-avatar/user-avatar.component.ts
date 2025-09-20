import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { AuthService } from '@core/services/auth.service';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faUser, faCog, faSignOutAlt, faChevronDown } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente UserAvatar con menú desplegable
 * Muestra avatar del usuario y menú con opciones de perfil y logout
 */
@Component({
  selector: 'app-user-avatar',
  standalone: true,
  imports: [AsyncPipe, FaIconComponent],
  template: `
    @if (currentUser$ | async; as user) {
      <button
        type="button"
        (click)="toggleMenu()"
        aria-label="Menú de usuario"
      >
        <fa-icon [icon]="faUser"></fa-icon>
      </button>

      @if (isMenuOpen) {
        <div role="menu">
          <div>
            <div>{{ user.email }}</div>
            <div>{{ user.role || 'Usuario' }}</div>
          </div>
          <hr>
          <button type="button" role="menuitem">
            <fa-icon [icon]="faCog"></fa-icon>
            Perfil
          </button>
          <button type="button" role="menuitem" (click)="onLogout()">
            <fa-icon [icon]="faSignOutAlt"></fa-icon>
            Salir
          </button>
        </div>
      }
    }
  `,
  styles: []
})
export class UserAvatarComponent {
  private readonly authService = inject(AuthService);

  // Iconos de FontAwesome
  faUser = faUser;
  faCog = faCog;
  faSignOutAlt = faSignOutAlt;
  faChevronDown = faChevronDown;

  currentUser$ = this.authService.currentUser$;
  isMenuOpen = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  getInitial(email?: string): string {
    return email ? email.charAt(0).toUpperCase() : 'U';
  }

  onLogout(): void {
    this.authService.signOut();
  }
}