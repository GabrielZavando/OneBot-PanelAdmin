import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-knowledge',
  standalone: true,
  imports: [CommonModule],
  template: `<h2>Knowledge Base</h2><p>Sube archivos y gestiona colecciones.</p>`
})
export class Knowledge {}
