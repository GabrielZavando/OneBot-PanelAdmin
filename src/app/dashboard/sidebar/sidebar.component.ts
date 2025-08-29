import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css'
})
export class Sidebar {
  @Input() open: boolean = true;
  currentRoute: string = '';

  constructor(private router: Router) {
    // Escuchar cambios de ruta
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentRoute = event.url;
    });
    
    // Establecer la ruta inicial
    this.currentRoute = this.router.url;
  }

  isChatbotsPage(): boolean {
    return this.currentRoute.includes('/dashboard/chatbots');
  }

  createChatbot(): void {
    // Navegar a la página de chatbots y abrir el formulario
    this.router.navigate(['/dashboard/chatbots']).then(() => {
      // Emitir evento personalizado para abrir el formulario
      window.dispatchEvent(new CustomEvent('openChatbotForm'));
    });
  }
}
