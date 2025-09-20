import { Component } from '@angular/core';

@Component({
  selector: 'app-knowledge-page',
  standalone: true,
  imports: [],
  template: `
    <div class="knowledge-page">
      <h1>Base de Conocimiento</h1>
      <p>Gestión de fuentes y conocimiento del sistema</p>
      <!-- TODO: Implementar gestión de fuentes de conocimiento -->
    </div>
  `,
  styles: [`
    .knowledge-page {
      padding: 2rem;
    }
  `]
})
export class KnowledgePageComponent {

}