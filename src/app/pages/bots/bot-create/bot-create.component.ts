import { Component } from '@angular/core';

@Component({
  selector: 'app-bot-create',
  standalone: true,
  imports: [],
  template: `
    <div class="bot-create">
      <h1>Crear Bot</h1>
      <p>Formulario para crear un nuevo bot</p>
      <!-- TODO: Implementar formulario de creación de bot -->
    </div>
  `,
  styles: [`
    .bot-create {
      padding: 2rem;
    }
  `]
})
export class BotCreateComponent {

}