import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../services/user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  users: User[] = [];
  errorMessage: string | null = null;
  roles: string[] = ['ADMIN', 'LIVREUR', 'RESPONSABLE', 'COMERCIAL']; // Liste des rôles disponibles
  currentPage: number = 0;
  pageSize: number = 5;
  totalPages: number = 0;
  searchQuery: string = '';

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getPaginatedUsers(this.currentPage, this.pageSize).subscribe({
      next: (data: any) => {
        this.users = data.content; // Les utilisateurs paginés
        this.totalPages = data.totalPages; // Nombre total de pages
      },
      error: err => {
        console.error(err);
        this.errorMessage = 'Erreur lors du chargement des utilisateurs, session termination'; 
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  deleteUser(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter(user => user.id !== id); // Mettre à jour la liste
        },
        error: err => {
          console.error(err);
          this.errorMessage = 'Erreur lors de la suppression de l\'utilisateur';
        }
      });
    }
  }

  updateUserRole(id: number, newRole: string): void {
    this.userService.updateUserRole(id, newRole).subscribe({
      next: (response) => {
        console.log('Réponse du backend :', response); // Affiche la réponse en texte brut
        const user = this.users.find(u => u.id === id);
        if (user) {
          user.role = newRole;
        }
      },
      error: err => {
        console.error('Erreur du backend :', err);
        this.errorMessage = 'Erreur lors de la mise à jour du rôle';
      }
    });
  }

  

  searchUsers(): void {
    if (this.searchQuery.trim()) {
      this.userService.searchUsers(this.searchQuery).subscribe({
        next: data => this.users = data,
        error: err => {
          console.error(err);
          this.errorMessage = 'Erreur lors de la recherche des utilisateurs';
        }
      });
    } else {
      this.loadUsers(); // Recharger tous les utilisateurs si la recherche est vide
    }
  }
}