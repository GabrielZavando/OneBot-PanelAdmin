import { Component } from '@angular/core';

@Component({
  selector: 'app-analytics-page',
  standalone: true,
  imports: [],
  template: `
    <div class="analytics-page">
      <h1>Analytics</h1>
      <p>Análisis y estadísticas del sistema</p>
      <!-- TODO: Implementar analytics con gráficos y reportes -->
    </div>
  `,
  styles: [`
    .analytics-page {
      padding: 2rem;
    }
  `]
})
export class AnalyticsPageComponent {

}