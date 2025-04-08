import { Component, OnInit } from '@angular/core';
import { Depot } from '../../models/depot';
import { DepotService } from '../../services/depot.service';

@Component({
  selector: 'app-depot-list',
  templateUrl: './depot-list.component.html',
  styleUrls: ['./depot-list.component.css']
})
export class DepotListComponent implements OnInit {
  depots: Depot[] = [];
  isLoading = true;
  errorMessage: string | null = null;

  constructor(private depotService: DepotService) { }

  ngOnInit(): void {
    this.loadDepots();
  }

  loadDepots(): void {
    this.depotService.getAllDepots().subscribe({
      next: (depots) => {
        this.depots = depots;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading depots', err);
        this.isLoading = false;
        this.errorMessage = 'Erreur lors du chargement des dépôts, session expirée ou pas de connexion internet';
      }
    });
  }

  deleteDepot(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
      this.depotService.deleteDepot(id).subscribe({
        next: () => {
          this.depots = this.depots.filter(d => d.id !== id);
        },
        error: (err) => {
          console.error('Error deleting depot', err);
        }
      });
    }
  }
}