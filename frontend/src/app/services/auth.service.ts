import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  getUserRole(): string {
    const role = localStorage.getItem(this.roleKey);
    return role ? role : '';
  }

  private apiUrl = 'http://localhost:8080/auth';
  private tokenKey = 'authToken';
  private roleKey = 'userRole';
  private authStatusSubject = new BehaviorSubject<boolean>(this.isTokenPresent());
  
  constructor(private http: HttpClient, private router: Router) {
  }

  private isTokenPresent(): boolean {
    return localStorage.getItem(this.tokenKey) !== null;
  }

  isLoggedIn(): Observable<boolean> {
    return this.authStatusSubject.asObservable();
  }

  login(credentials: { username: string, password: string }): Observable<{ token: string, role: string }> {
    return this.http.post<{ token: string, role: string }>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(response => {
          if (response && response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            localStorage.setItem(this.roleKey, response.role); // حفظ دور المستخدم
            this.authStatusSubject.next(true); // Mettre à jour le statut d'authentification
          }
        })
      );
  }

  register(user: { username: string, password: string, role: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user, {
      responseType: 'text' // Indique que la réponse est en texte brut
    });
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.roleKey); // إزالة دور المستخدم عند تسجيل الخروج
    this.authStatusSubject.next(false); // Mettre à jour le statut d'authentification
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getCurrentUser(): { role: string } | null {
    const role = localStorage.getItem(this.roleKey);
    return role ? { role } : null;
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  getCurrentUserRole(): string | null {
    return localStorage.getItem('userRole'); // Récupérer le rôle depuis le localStorage
  }

  
}