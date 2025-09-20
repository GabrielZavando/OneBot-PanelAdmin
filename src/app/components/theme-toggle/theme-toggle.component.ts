import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente ThemeToggle para cambiar entre modo claro y oscuro
 */
@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <button
      type="button"
      (click)="toggleTheme()"
      aria-label="Cambiar tema"
    >
      <fa-icon [icon]="isDark ? faSun : faMoon"></fa-icon>
    </button>
  `,
  styles: []
})
export class ThemeToggleComponent {
  // Iconos de FontAwesome
  faSun = faSun;
  faMoon = faMoon;

  isDark = false;

  toggleTheme(): void {
    this.isDark = !this.isDark;
    document.documentElement.classList.toggle('dark', this.isDark);
  }
}