import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Resumen</h2><p>Bienvenido al panel de administración.</p>`
})
export class Home {}
