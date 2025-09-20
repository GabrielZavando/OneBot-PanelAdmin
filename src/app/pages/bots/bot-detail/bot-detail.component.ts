import { Component } from '@angular/core';

@Component({
  selector: 'app-bot-detail',
  standalone: true,
  imports: [],
  template: `
    <div class="bot-detail">
      <h1>Detalle del Bot</h1>
      <p>Información detallada del bot</p>
      <!-- TODO: Implementar vista de detalle del bot -->
    </div>
  `,
  styles: [`
    .bot-detail {
      padding: 2rem;
    }
  `]
})
export class BotDetailComponent {

}