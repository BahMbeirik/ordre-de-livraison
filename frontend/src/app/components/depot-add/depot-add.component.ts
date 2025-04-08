import { Component, OnInit } from '@angular/core';
import { Depot } from '../../models/depot';
import { Produit } from '../../models/produit';
import { DepotService } from '../../services/depot.service';
import { ProduitService } from '../../services/produit.service';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user.model';

@Component({
  selector: 'app-depot-add',
  templateUrl: './depot-add.component.html',
  styleUrls: ['./depot-add.component.css']
})
export class DepotAddComponent implements OnInit {
  depot: Depot = {
    name: '',
    chef: {} as User
  };

  produits: Produit[] = [];
  chefs: User[] = [];
  isLoading = false;

  constructor(
    private depotService: DepotService,
    private produitService: ProduitService,
    private userService: UserService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProduits();
    this.loadChefs();
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (produits) => this.produits = produits,
      error: (err) => console.error('Error loading produits', err)
    });
  }

  loadChefs(): void {
    this.userService.getChefs().subscribe({
      next: (chefs) => {
        console.log('Chefs loaded:', chefs);
        this.chefs = chefs.map(chef => ({
          id: chef.id || 0,  // provide default value if undefined
          username: chef.username,
          password: chef.password,
          role: chef.role as 'admin' | 'livreur' | 'responsable' | 'comercial'  // type assertion
        }));
      },
      error: (err) => console.error('Error loading chefs', err)
    });
  }

  onSubmit(): void {
    this.isLoading = true;
    this.depotService.createDepot(this.depot).subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/depots']);
      },
      error: (err) => {
        console.error('Error creating depot', err);
        this.isLoading = false;
        // Show user-friendly error message
      }
    });
  }
}
