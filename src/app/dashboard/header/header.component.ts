import { Component, EventEmitter, Output, Injector, runInInjectionContext } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Auth } from '@angular/fire/auth';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  @Output() toggleSidebar = new EventEmitter<void>();

  constructor(private auth: Auth, private authService: AuthService, private injector: Injector) {}

  onToggleSidebar() {
    this.toggleSidebar.emit();
  }

  async logout() {
    await runInInjectionContext(this.injector, async () => {
      await this.authService.logout();
    });
  }

  get currentUser() {
    return this.authService.getCurrentUser();
  }
}
