import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Depot } from '../../models/depot';
import { Produit } from '../../models/produit';
import { User } from '../../models/user.model';
import { DepotService } from '../../services/depot.service';
import { ProduitService } from '../../services/produit.service';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-depot-edit',
  templateUrl: './depot-edit.component.html',
  styleUrls: ['./depot-edit.component.css']
})
export class DepotEditComponent implements OnInit {
  depot: Depot = {
    name: '',
    chef: {} as User
  };
  
  produits: Produit[] = [];
  chefs: User[] = [];
  isLoading = false;
  isEditing = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private depotService: DepotService,
    private produitService: ProduitService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditing = true;
      this.loadDepot(id);
    }
    this.loadProduits();
    this.loadChefs();
  }

  loadDepot(id: number): void {
    this.isLoading = true;
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

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe({
      next: (produits) => this.produits = produits,
      error: (err) => console.error('Error loading produits', err)
    });
  }

  loadChefs(): void {
    this.userService.getChefs().subscribe({
      next: (chefs) => {
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
    
    if (this.isEditing) {
        this.depotService.updateDepot(this.depot.id!, this.depot).subscribe({
            next: () => {
                this.isLoading = false;
                this.router.navigate(['/depots']);
            },
            error: (err) => {
                console.error('Full error:', err);
                if (err.status === 415) {
                    alert('Server cannot process the request format. Please contact support.');
                }
                this.isLoading = false;
            }
        });
    } else {
        // ... existing create logic ...
    }
}
}