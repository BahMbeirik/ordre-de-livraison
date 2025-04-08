import { Component, OnInit } from '@angular/core';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';

@Component({
  selector: 'app-produit-list',
  templateUrl: './produit-list.component.html',
  styleUrls: ['./produit-list.component.css']
})
export class ProduitListComponent implements OnInit {
  produits: Produit[] = [];
  errorMessage: string | null = null;

  constructor(private produitService: ProduitService) { }

  ngOnInit(): void {
    this.loadProduits();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe(
      {
        next: (produits) => {
          this.produits = produits;
        },
        error: (err) => {
          console.error('Error loading produits', err);
          this.errorMessage = 'Erreur lors du chargement des produits, session expirée ou pas de connexion internet';
        }
      }
    
    );
  }

  deleteProduit(id: number): void {
    if (confirm('Are you sure you want to delete this produit?')) {
      this.produitService.deleteProduit(id).subscribe(
        () => this.produits = this.produits.filter(p => p.id !== id),
        error => console.error('Error deleting produit', error)
      );
    }
  }
}