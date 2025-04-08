import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Depot } from '../../models/depot';
import { DepotService } from '../../services/depot.service';

@Component({
  selector: 'app-depot-details',
  templateUrl: './depot-details.component.html',
  styleUrls: ['./depot-details.component.css']
})
export class DepotDetailsComponent implements OnInit {
  depot: Depot | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private depotService: DepotService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.loadDepot(id);
  }

  loadDepot(id: number): void {
    this.depotService.getDepot(id).subscribe({
      next: (depot) => {
        this.depot = depot;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading depot', err);
        this.isLoading = false;
      }
    });
  }

  deleteDepot(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce dépôt ?')) {
      this.depotService.deleteDepot(this.depot!.id!).subscribe({
        next: () => {
          this.router.navigate(['/depots']);
        },
        error: (err) => {
          console.error('Error deleting depot', err);
        }
      });
    }
  }
}