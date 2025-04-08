import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(private authService: AuthService, 
              private router: Router,
              private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.authService.isLoggedIn().subscribe({
      next: isLoggedIn => {
        if (isLoggedIn) {
          const user = this.authService.getCurrentUser();
          if (user) {
            this.redirectToHome(user.role);
          }
        }
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: response => {
          console.log('Login réussi, token : ', response.token);
          const user = this.authService.getCurrentUser();
          if (user) {
            this.redirectToHome(user.role);
          }
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Identifiants invalides';
        }
      });
    }
  }

  private redirectToHome(role: string) {
    switch (role) {
      case 'ADMIN':
        this.router.navigate(['/users']).then(() => {
          window.location.reload();
        });
        break;
      case 'LIVREUR':
        this.router.navigate(['/commandes']).then(() => {
          window.location.reload();
        });
        break;
      case 'RESPONSABLE':
        this.router.navigate(['/produits']).then(() => {
          window.location.reload();
        });
        break;
      case 'COMERCIAL':
        this.router.navigate(['/depots']).then(() => {
          window.location.reload();
        });
        break;
      default:
        this.router.navigate(['/welcome']).then(() => {
          window.location.reload();
        });
        break;
    }
  }
}