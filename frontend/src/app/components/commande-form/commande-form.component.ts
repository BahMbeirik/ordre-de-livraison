// commande-form.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommandeService } from '../../services/commande.service';
import { ProduitService } from '../../services/produit.service';
import { ClientService } from '../../services/client.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Produit } from '../../models/produit';
import { Client } from '../../models/client.model';
import { User } from '../../services/user.service';
import { Depot } from '../../models/depot';
import { LigneCommandeDto, CreateCommandeDto } from '../../models/commande';

@Component({
  selector: 'app-commande-form',
  templateUrl: './commande-form.component.html',
  styleUrls: ['./commande-form.component.css']
})
export class CommandeFormComponent implements OnInit {
  commandeForm: FormGroup;
  produits: Produit[] = [];
  clients: Client[] = [];
  depots: Depot[] = [];
  livreurs: User[] = [];
  isEditMode = false;
  currentCommandeId: number | null = null;
  lignesCommande: LigneCommandeDto[] = [];

  constructor(
    private fb: FormBuilder,
    private commandeService: CommandeService,
    private produitService: ProduitService,
    private clientService: ClientService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.commandeForm = this.fb.group({
      clientId: [null, Validators.required],
      livreurId: [null],
      payee: [false],
      retireSurPlace: [false],
      produitId: [null],
      quantity: [1, [ Validators.min(1)]],
      depotId: [null ]
    });
    
  }

  ngOnInit(): void {
    this.loadProduits();
    this.loadClients();
    this.loadLivreurs();

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isEditMode = true;
        this.currentCommandeId = +id;
        this.loadCommande(+id);
      }
    });

    this.commandeForm.get('produitId')?.valueChanges.subscribe(produitId => {
      if (produitId) {
        this.commandeService.getDepotByProduit(produitId).subscribe(depot => {
          this.depots = [depot]; // Met dans un tableau car ton select attend une liste
          this.commandeForm.get('depotId')?.setValue(depot.id);
        });
      }
    });
    

    this.commandeForm.get('retireSurPlace')?.valueChanges.subscribe(retire => {
      const livreurControl = this.commandeForm.get('livreurId');
      if (retire) {
        livreurControl?.disable();
        livreurControl?.setValue(null);
      } else {
        livreurControl?.enable();
      }
    });
  }

  addLigneCommande(): void {
    if (this.commandeForm.get('produitId')?.valid && 
        this.commandeForm.get('quantity')?.valid && 
        this.commandeForm.get('depotId')?.valid) {
      
          const ligne: LigneCommandeDto = {
            produitId: Number(this.commandeForm.get('produitId')?.value),
            quantity: Number(this.commandeForm.get('quantity')?.value),
            depotId: Number(this.commandeForm.get('depotId')?.value)
          };
          
      
      this.lignesCommande.push(ligne);
      
      // Reset line form
      this.commandeForm.get('produitId')?.reset();
      this.commandeForm.get('quantity')?.setValue(1);
      this.commandeForm.get('depotId')?.reset();
    }
  }

  removeLigne(index: number): void {
    this.lignesCommande.splice(index, 1);
  }

  onSubmit(): void {
    if (this.commandeForm.valid && this.lignesCommande.length > 0) {
      const commandeData: CreateCommandeDto = {
        clientId: this.commandeForm.get('clientId')?.value,
        livreurId: this.commandeForm.get('livreurId')?.value,
        payee: this.commandeForm.get('payee')?.value,
        retireSurPlace: this.commandeForm.get('retireSurPlace')?.value,
        lignesCommande: this.lignesCommande
      };
      
      if (this.isEditMode && this.currentCommandeId) {
        this.commandeService.updateCommande(this.currentCommandeId, commandeData).subscribe({
          next: () => this.router.navigate(['/commandes']),
          error: (err) => console.error('Erreur lors de la mise à jour', err)
        });
      } else {
        this.commandeService.createCommande(commandeData).subscribe({
          next: () => this.router.navigate(['/commandes']),
          error: (err) => console.error('Erreur lors de la création', err)
        });
      }
    }
  }

  loadCommande(id: number): void {
    this.commandeService.getCommande(id).subscribe(commande => {
      this.commandeForm.patchValue({
        clientId: commande.client.id,
        livreurId: commande.livreur?.id,
        payee: commande.payee,
        retireSurPlace: commande.retireSurPlace
      });
      
      
    });
  }

  loadProduits(): void {
    this.produitService.getAllProduits().subscribe(produits => {
      this.produits = produits;
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe(clients => {
      this.clients = clients;
    });
  }

  loadLivreurs(): void {
    this.commandeService.getAvailableLivreurs().subscribe(livreurs => {
      this.livreurs = livreurs;
    });
  }

  getProduitName(produitId: number): string {
    return this.produits.find(p => p.id === produitId)?.name || 'Produit inconnu';
  }

  getDepotName(depotId: number): string {
    return this.depots.find(d => d.id === depotId)?.name || 'Dépôt inconnu';
  }
}