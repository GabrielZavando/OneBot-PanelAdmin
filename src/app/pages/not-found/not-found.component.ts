import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [],
  template: `
    <div>
      <div>
        <h1>404</h1>
        <h2>Página no encontrada</h2>
        <p>
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>
        <div>
          <button (click)="goHome()">
            Ir al inicio
          </button>
          <button (click)="goBack()">
            Volver atrás
          </button>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class NotFoundComponent {
  constructor(private router: Router) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}