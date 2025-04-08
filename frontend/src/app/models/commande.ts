import { Depot } from './depot';
import { Produit } from './produit';
import { Client } from './client.model';
import { User } from './user.model';

export interface LigneCommande {
  id?: number;
  produit: Produit;
  quantity: number;
  depot: Depot;
  statutProduit: 'EN_PREPARATION' | 'RETIRE' | 'LIVRE';
}

export interface Commande {
  id?: number;
  numeroCommande: string;
  lignesCommande: LigneCommande[];
  client: Client;
  livreur?: User;
  dateCreation: string;
  payee: boolean;
  statutCommande: 'EN_PREPARATION' | 'EN_COURS' | 'LIVREE';
  dateDepart?: string;
  dateLivraison?: string;
  retireSurPlace: boolean;
}

export interface LigneCommandeDto {
  produitId: number;
  quantity: number;
  depotId: number;
}

export interface CreateCommandeDto {
  clientId: number;
  livreurId?: number;
  payee: boolean;
  retireSurPlace: boolean;
  lignesCommande: LigneCommandeDto[];
}