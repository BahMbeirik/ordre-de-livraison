import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models/client.model';
import { AuthService } from './../../services/auth.service';

@Component({
  selector: 'app-client-list',
  templateUrl: './client-list.component.html',
  styleUrls: ['./client-list.component.css']
})
export class ClientListComponent implements OnInit {
  clients: Client[] = [];
  currentUserRole: string = '';
  errorMessage: string | null = null;
  constructor(private clientService: ClientService,private authService:AuthService) { }

  ngOnInit(): void {
    this.loadClients();
    this.currentUserRole = this.authService.getUserRole();
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(
      {
        next: (clients) => {
          this.clients = clients;
        },
        error: (error) => {
          console.error('Error fetching clients', error);
          this.errorMessage = 'Erreur lors du chargement des clients, session terminée';
        }
      }
      
    );
  }

  deleteClient(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService.deleteClient(id).subscribe(
        () => this.loadClients(),
        error => console.error('Error deleting client', error)
      );
    }
  }
  isLivreur(): boolean {
    return ['LIVREUR'].includes(this.currentUserRole);
  }
}