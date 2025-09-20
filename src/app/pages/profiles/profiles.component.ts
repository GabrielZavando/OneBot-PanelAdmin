import { Component } from '@angular/core';

@Component({
  selector: 'app-profiles-page',
  standalone: true,
  imports: [],
  template: `
    <div class="profiles-page">
      <h1>Perfiles</h1>
      <p>Gestión de perfiles de usuario</p>
      <!-- TODO: Implementar gestión de perfiles -->
    </div>
  `,
  styles: [`
    .profiles-page {
      padding: 2rem;
    }
  `]
})
export class ProfilesPageComponent {

}