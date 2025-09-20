import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faRobot } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente Logo de la aplicación
 * Muestra el logo de OneBot con enlace al dashboard
 */
@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <a href="/home" aria-label="Ir al dashboard">
      <div>
        <fa-icon [icon]="faRobot"></fa-icon>
        <span>OneBot</span>
      </div>
    </a>
  `,
  styles: []
})
export class LogoComponent {
  // Iconos de FontAwesome
  faRobot = faRobot;
}