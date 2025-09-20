import { Component } from '@angular/core';

@Component({
  selector: 'app-bot-edit',
  standalone: true,
  imports: [],
  template: `
    <div class="bot-edit">
      <h1>Editar Bot</h1>
      <p>Formulario para editar el bot</p>
      <!-- TODO: Implementar formulario de edición de bot -->
    </div>
  `,
  styles: [`
    .bot-edit {
      padding: 2rem;
    }
  `]
})
export class BotEditComponent {

}