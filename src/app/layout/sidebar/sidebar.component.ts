import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MENU_CONFIG, MenuItem } from '../menu.config';
import { AuthService } from '@core/services/auth.service';
import { Observable, map } from 'rxjs';

/**
 * Componente Sidebar del layout principal
 * Responsabilidades:
 * - Renderizar menú dinámico desde configuración
 * - Soporte para roles y control de acceso
 * - Estado activo de navegación
 * - Comportamiento responsive (colapsable en mobile)
 * - Accesibilidad con navegación por teclado
 */
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);

  menuItems$: Observable<MenuItem[]> = new Observable<MenuItem[]>();
  isCollapsed = false;

  ngOnInit(): void {
    // Filtrar ítems del menú según roles del usuario
    this.menuItems$ = this.authService.currentUser$.pipe(
      map(user => {
        if (!user) return [];
        return MENU_CONFIG.filter((item: MenuItem) =>
          !item.roles || item.roles.includes(user.role || '')
        );
      })
    );
  }

  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  onItemClick(): void {
    // Cerrar sidebar en mobile tras navegación
    if (window.innerWidth < 768) {
      this.isCollapsed = true;
    }
  }
}