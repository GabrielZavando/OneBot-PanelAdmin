import { Component } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  standalone: true,
  imports: [],
  template: `
    <div class="settings-page">
      <h1>Configuración</h1>
      <p>Configuración del sistema y usuario</p>
      <!-- TODO: Implementar configuración de usuario, sistema, etc. -->
    </div>
  `,
  styles: [`
    .settings-page {
      padding: 2rem;
    }
  `]
})
export class SettingsPageComponent {

}