import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { Depot } from 'src/app/models/depot';
import { DepotService } from 'src/app/services/depot.service';

@Component({
  selector: 'app-produit-edit',
  templateUrl: './produit-edit.component.html',
  styleUrls: ['./produit-edit.component.css']
})
export class ProduitEditComponent implements OnInit {
  produit: Produit = {
    name: '',
    quantity: 0,
    depot: {} as Depot
  };
  depots: Depot[] = [];

  isLoading = false;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private produitService: ProduitService,
    private depotService: DepotService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadProduit(id);
      this.loadDepots();
    }
  }
  loadDepots(): void {
    this.depotService.getAllDepots().subscribe({
      next: (depots) => this.depots = depots,
      error: (err) => console.error('Error loading depots', err)
    });
  }

  loadProduit(id: number): void {
    this.isLoading = true;
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

  onSubmit(): void {
    this.isLoading = true;
    if (this.isEditing) {
      this.produitService.updateProduit(this.produit.id!, this.produit).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          console.error('Error updating produit', err);
          this.isLoading = false;
        }
      });
    } else {
      this.produitService.createProduit(this.produit).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/produits']);
        },
        error: (err) => {
          console.error('Error creating produit', err);
          this.isLoading = false;
        }
      });
    }
  }
}