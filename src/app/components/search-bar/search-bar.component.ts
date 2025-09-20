import { Component } from '@angular/core';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

/**
 * Componente SearchBar para búsqueda global
 * Barra de búsqueda opcional en el header
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FaIconComponent],
  template: `
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        aria-label="Buscar en la aplicación"
      >
      <fa-icon [icon]="faSearch"></fa-icon>
    </div>
  `,
  styles: []
})
export class SearchBarComponent {
  // Iconos de FontAwesome
  faSearch = faSearch;
}