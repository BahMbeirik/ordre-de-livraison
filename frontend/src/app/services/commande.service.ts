// commande.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Commande, LigneCommande, CreateCommandeDto } from '../models/commande';
import { Depot } from '../models/depot';
import { User } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class CommandeService {
  private apiUrl = 'http://localhost:8080/api/commandes';

  constructor(private http: HttpClient) {}

  getAllCommandes(): Observable<Commande[]> {
    return this.http.get<Commande[]>(this.apiUrl);
  }

  getCommande(id: number): Observable<Commande> {
    return this.http.get<Commande>(`${this.apiUrl}/${id}`);
  }

  createCommande(commande: CreateCommandeDto): Observable<Commande> {
    return this.http.post<Commande>(this.apiUrl, commande);
  }

  updateCommande(id: number, commande: CreateCommandeDto): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, commande);
  }
  

  deleteCommande(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  // updateStatutCommande(id: number, statut: 'EN_PREPARATION' | 'EN_COURS' | 'LIVREE'): Observable<Commande> {
  //   return this.http.put<Commande>(`${this.apiUrl}/${id}/statut-commande`, {}, {
  //     params: { statut }
  //   });
  // }
  

  updateStatutProduit(commandeId: number, ligneCommandeId: number, statut: 'EN_PREPARATION' | 'RETIRE' | 'LIVRE'): Observable<LigneCommande> {
    return this.http.put<LigneCommande>(`${this.apiUrl}/${commandeId}/lignes/${ligneCommandeId}/statut-produit`, {}, {
      params: { statut }
    });
  }
  
  

  updateLigneCommande(commandeId: number, ligneId: number, ligne: { quantity?: number, depotId?: number }): Observable<LigneCommande> {
    return this.http.put<LigneCommande>(`${this.apiUrl}/${commandeId}/lignes/${ligneId}`, ligne);
  }

  getDepotByProduit(produitId: number): Observable<Depot> {
    return this.http.get<Depot>(`${this.apiUrl}/produit/${produitId}/depot`);
  }
  

  getAvailableLivreurs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/livreurs`);
  }
}