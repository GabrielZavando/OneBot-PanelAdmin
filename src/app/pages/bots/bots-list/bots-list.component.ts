import { Component } from '@angular/core';

@Component({
  selector: 'app-bots-list',
  standalone: true,
  imports: [],
  template: `
    <div class="bots-list">
      <h1>Lista de Bots</h1>
      <p>Gestión de bots del sistema</p>
      <!-- TODO: Implementar lista de bots con tabla y acciones -->
    </div>
  `,
  styles: [`
    .bots-list {
      padding: 2rem;
    }
  `]
})
export class BotsListComponent {

}