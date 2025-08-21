import { Injectable } from '@angular/core';
import { Auth, onAuthStateChanged, signOut } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserSession {
  uid: string;
  email: string | null;
  displayName: string | null;
  idToken: string;
  loginTime: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<UserSession | null>(null);
  public currentUser$: Observable<UserSession | null> = this.currentUserSubject.asObservable();

  constructor(private auth: Auth, private router: Router) {
    // Verificar si hay una sesión almacenada al iniciar la app
    this.checkStoredSession();
    
    // Escuchar cambios en el estado de autenticación de Firebase
    onAuthStateChanged(this.auth, (user) => {
      if (!user) {
        this.clearSession();
      }
    });
  }

  private checkStoredSession(): void {
    const storedSession = localStorage.getItem('userSession');
    if (storedSession) {
      try {
        const session: UserSession = JSON.parse(storedSession);
        this.currentUserSubject.next(session);
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('userSession');
      }
    }
  }

  setUserSession(session: UserSession): void {
    localStorage.setItem('userSession', JSON.stringify(session));
    this.currentUserSubject.next(session);
  }

  getCurrentUser(): UserSession | null {
    return this.currentUserSubject.value;
  }

  isLoggedIn(): boolean {
    return this.currentUserSubject.value !== null;
  }

  async logout(): Promise<void> {
    try {
      await signOut(this.auth);
      this.clearSession();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error during logout:', error);
    }
  }

  private clearSession(): void {
    localStorage.removeItem('userSession');
    this.currentUserSubject.next(null);
  }

  // Método para refrescar el token si es necesario
  getStoredToken(): string | null {
    const session = this.getCurrentUser();
    return session ? session.idToken : null;
  }
}
