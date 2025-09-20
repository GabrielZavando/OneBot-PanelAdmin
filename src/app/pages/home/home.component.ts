import { Component } from '@angular/core';

@Component({
  selector: 'app-home-page',
  standalone: true,
  imports: [],
  template: `
    <div class="home-page">
      <h1>Dashboard</h1>
      <p>Bienvenido al panel de administración de OneBot</p>
      <!-- TODO: Implementar dashboard con estadísticas y widgets -->
    </div>
  `,
  styles: [`
    .home-page {
      padding: 2rem;
    }
  `]
})
export class HomePageComponent {

}