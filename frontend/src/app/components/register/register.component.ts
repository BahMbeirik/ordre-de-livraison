import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html'
})
export class RegisterComponent {

  registerForm: FormGroup;
  errorMessage: string | null = null;
  successMessage: string | null = null;

  constructor(private authService: AuthService, 
              private router: Router,
              private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      role: [{ value: 'LIVREUR', disabled: true }, Validators.required] // Désactiver le champ ici
    });
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.registerForm.get('role')?.enable();
      const user = this.registerForm.value;
      this.registerForm.get('role')?.disable();
  
      this.authService.register(user).subscribe({
        next: (response) => {
          console.log('Réponse du backend :', response); // Affiche la réponse en texte brut
          this.successMessage = 'Inscription réussie !';
          setTimeout(() => this.router.navigate(['/login']), 2000);
        },
        error: (err) => {
          console.error('Erreur lors de l’inscription :', err);
          this.errorMessage = 'Erreur lors de l’inscription';
        }
      });
    }
  }
}