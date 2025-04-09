import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { Commande, LigneCommande } from 'src/app/models/commande';
import { AuthService } from 'src/app/services/auth.service';
import { CommandeService } from 'src/app/services/commande.service';

@Component({
  selector: 'app-commande',
  templateUrl: './commande.component.html',
  styleUrls: ['./commande.component.css']
})
export class CommandeComponent implements OnInit {
  commandes: Commande[] = [];
  filteredCommandes: Commande[] = [];
  currentUserRole: string = '';
  searchTerm: string = '';
  statusFilter: string = 'all';
  selectedLigne: LigneCommande | null = null;
  errorMessage: string | null = null;

  constructor(
    private commandeService: CommandeService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCommandes();
    this.currentUserRole = this.authService.getUserRole();
  }

  loadCommandes(): void {
    const role = this.authService.getUserRole();
  
    const fetchCommandes$ =
      role === 'RESPONSABLE'
        ? this.commandeService.getCommandesForResponsable()
        : role === 'LIVREUR'
          ? this.commandeService.getCommandesForLivreur()
          : this.commandeService.getAllCommandes();
  
    fetchCommandes$.subscribe({
      next: (commandes) => {
        this.commandes = commandes;
        this.filteredCommandes = [...commandes];

        // 👇 تحقق من commandes غير مدفوعة فقط إذا كان LIVREUR
        if (role === 'LIVREUR') {
          const nonPayees = commandes.filter(cmd => !cmd.payee);
          if (nonPayees.length > 0) {
            nonPayees.forEach(cmd => {
              this.showNotification(`Commande '${cmd.numeroCommande}' non payée !`);
            });
          }
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des commandes', err);
        this.errorMessage = 'Erreur lors du chargement des commandes, session expirée ou pas de connexion internet';
      }
    });
  }
  
  
  

  selectLigne(ligne: LigneCommande): void {
    this.selectedLigne = ligne;
  }

  updateProduitStatus(newStatus: 'EN_PREPARATION' | 'RETIRE' | 'LIVRE'): void {
    if (!this.selectedLigne || !['RESPONSABLE', 'LIVREUR'].includes(this.currentUserRole))  {
      console.error('No line selected or unauthorized');
      return;
    }
    
    this.commandeService.updateStatutProduit(
      this.selectedLigne.id!,
      this.selectedLigne.id!,
      newStatus
    )
    .subscribe({
      next: () => {
        this.loadCommandes();
        this.selectedLigne = null;
      },
      error: (err: any) => console.error('Update failed:', err)
    });
  }

  // updateCommandeStatus(commandeId: number, newStatus: 'EN_PREPARATION' | 'EN_COURS' | 'LIVREE'): void {
  //   this.commandeService.updateStatutCommande(commandeId, newStatus).subscribe({
  //     next: () => this.loadCommandes(),
  //     error: (err) => console.error('Update failed:', err)
  //   });
  // }

  applyFilters(): void {
    this.filteredCommandes = this.commandes.filter(commande => {
      // Filtre par recherche
      const matchesSearch = 
        commande.numeroCommande.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        commande.client.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        commande.lignesCommande.some(l => l.produit.name.toLowerCase().includes(this.searchTerm.toLowerCase()));
      
      // Filtre par statut
      const matchesStatus = 
        this.statusFilter === 'all' || 
        commande.statutCommande === this.statusFilter.toUpperCase() ||
        commande.lignesCommande.some(l => l.statutProduit === this.statusFilter.toUpperCase());
      
      return matchesSearch && matchesStatus;
    });
  }

  deleteCommande(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      this.commandeService.deleteCommande(id).subscribe({
        next: () => {
          this.commandes = this.commandes.filter(c => c.id !== id);
          this.filteredCommandes = this.filteredCommandes.filter(c => c.id !== id);
        },
        error: (err) => console.error('Erreur lors de la suppression', err)
      });
    }
  }

  viewDetail(commandeId: number): void {
    this.router.navigate(['/commandes', commandeId]);
  }

  canEdit(): boolean {
    return ['ADMIN', 'COMERCIAL'].includes(this.currentUserRole);
  }

  isResponsable(): boolean {
    return ['ADMIN', 'RESPONSABLE'].includes(this.currentUserRole);
  }

  isLivreur(): boolean {
    return [ 'LIVREUR'].includes(this.currentUserRole);
  }
  isResponsableSeul(): boolean {
    return ['RESPONSABLE', 'LIVREUR'].includes(this.currentUserRole);
  }

  getStatusColor(status: string): string {
    switch(status) {
      case 'EN_PREPARATION': return 'bg-gray-200 text-gray-800';
      case 'RETIRE': return 'bg-yellow-100 text-yellow-800';
      case 'LIVRE': case 'LIVREE': return 'bg-green-100 text-green-800';
      case 'EN_COURS': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  }

  showNotification(message: string) {
    window.alert(message); // تنبيه بسيط
  }
  
}