import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Componente Main del layout principal
 * Responsabilidades:
 * - Contenedor principal para el contenido de las páginas
 * - Área para breadcrumbs opcionales
 * - Router outlet para renderizar páginas
 * - Layout responsivo con scroll solo en contenido
 */
@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent {
  // Placeholder para breadcrumbs - puede ser implementado más tarde
  breadcrumbs: string[] = [];
}