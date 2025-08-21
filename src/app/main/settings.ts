import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Configuración</h2><p>Ajustes de la plataforma.</p>`
})
export class Settings {}
