import { Component, OnInit } from '@angular/core';
import { Produit } from '../../models/produit';
import { ProduitService } from '../../services/produit.service';
import { Router } from '@angular/router';
import { Depot } from 'src/app/models/depot';
import { DepotService } from 'src/app/services/depot.service';

@Component({
  selector: 'app-produit-add',
  templateUrl: './produit-add.component.html',
  styleUrls: ['./produit-add.component.css']
})
export class ProduitAddComponent implements OnInit {
  produit: Produit = {
    name: '',
    quantity: 0,
    depot: {} as Depot
  };
  depots: Depot[] = [];

  constructor(
    private produitService: ProduitService,
    private router: Router,
    private depotService: DepotService
  ) { }

  ngOnInit(): void {
    this.loadDepots();
  }

  loadDepots(): void {
    this.depotService.getAllDepots().subscribe({
      next: (depots) => this.depots = depots,
      error: (err) => console.error('Error loading depots', err)
    });
  }

  saveProduit(): void {
    this.produitService.createProduit(this.produit).subscribe(
      () => this.router.navigate(['/produits']),
      error => console.error('Error creating produit', error)
    );
  }
}