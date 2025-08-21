import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Analítica</h2><p>Gráficos y métricas de uso.</p>`
})
export class Analytics {}
