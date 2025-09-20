import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Router } from '@angular/router';
import { LoadingService } from '@core/services/loading.service';
import { AuthService } from '@core/services/auth.service';
import { LogoComponent } from '../../components/logo/logo.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { ThemeToggleComponent } from '../../components/theme-toggle/theme-toggle.component';
import { UserAvatarComponent } from '../../components/user-avatar/user-avatar.component';

/**
 * Componente Header del layout principal
 * Responsabilidades:
 * - Mostrar logo y título de la aplicación
 * - Barra de búsqueda opcional
 * - Toggle de tema (dark/light)
 * - Avatar de usuario con menú (Perfil/Salir)
 * - Spinner global para indicar carga de requests
 * - Mantener sticky en la parte superior
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    AsyncPipe,
    LogoComponent,
    SearchBarComponent,
    ThemeToggleComponent,
    UserAvatarComponent
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly loadingService = inject(LoadingService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isLoading$ = this.loadingService.isLoading$;
  readonly currentUser$ = this.authService.currentUser$;

  onLogout(): void {
    this.authService.signOut();
    this.router.navigate(['/login']);
  }
}