import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../models/produit';
import { Depot } from '../../models/depot';
import { ProduitService } from '../../services/produit.service';
import { DepotService } from '../../services/depot.service';

@Component({
  selector: 'app-produit-details',
  templateUrl: './produit-details.component.html',
  styleUrls: ['./produit-details.component.css']
})
export class ProduitDetailsComponent implements OnInit {
  produit: Produit | null = null;
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService
  ) { }

  ngOnInit(): void {
    const id = +this.route.snapshot.params['id'];
    this.loadProduit(id);
  }

  loadProduit(id: number): void {
    this.produitService.getProduit(id).subscribe({
      next: (produit) => {
        this.produit = produit;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Error loading produit', err);
        this.isLoading = false;
      }
    });
  }

  deleteProduit(): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      this.produitService.deleteProduit(this.produit!.id!).subscribe({
        next: () => {
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          console.error('Error deleting produit', err);
        }
      });
    }
  }
}