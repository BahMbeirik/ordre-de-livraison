import { Component, OnInit } from '@angular/core';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { AuthService } from './services/auth.service'; // Assurez-vous que le chemin est correct

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'frontend';
  isLoggedIn$: Observable<boolean>;
  private authStatusSubject = new BehaviorSubject<boolean>(false);
  
  constructor(private authService: AuthService) {
    // Initialiser isLoggedIn$ avec le BehaviorSubject
    this.isLoggedIn$ = this.authStatusSubject.asObservable();
  }
  
  ngOnInit(): void {
    // Mettre à jour le statut d'authentification initial
    this.updateAuthStatus();
    
    // Optionnellement, vérifier périodiquement le statut d'authentification
    // ou mettre en place un mécanisme pour le mettre à jour après login/logout
  }
  
  private updateAuthStatus(): void {
    const isAuthenticated = this.authService.isAuthenticated();
    this.authStatusSubject.next(isAuthenticated);
  }
}