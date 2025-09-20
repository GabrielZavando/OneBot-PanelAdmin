import { Component, ViewEncapsulation } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { MainComponent } from '../main/main.component';

/**
 * Componente LayoutShell - Ensamblador del layout principal
 * Responsabilidades:
 * - Combinar Header, Sidebar y Main en un layout coherente
 * - Proporcionar estructura base para páginas protegidas
 * - Gestionar layout responsive con CSS Grid
 */
@Component({
  selector: 'app-layout-shell',
  standalone: true,
  imports: [HeaderComponent, SidebarComponent, MainComponent],
  templateUrl: './layout-shell.component.html',
  styleUrl: './layout-shell.component.scss',
  encapsulation: ViewEncapsulation.Emulated
})
export class LayoutShellComponent {}