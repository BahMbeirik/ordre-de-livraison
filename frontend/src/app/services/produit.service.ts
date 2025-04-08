import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Produit } from '../models/produit';

@Injectable({
  providedIn: 'root'
})
export class ProduitService {
  private apiUrl = 'http://localhost:8080/api/produits';

  constructor(private http: HttpClient) { }

  getAllProduits(): Observable<Produit[]> {
    return this.http.get<Produit[]>(this.apiUrl);
  }

  getProduit(id: number): Observable<Produit> {
    return this.http.get<Produit>(`${this.apiUrl}/${id}`);
  }

  createProduit(produit: Produit): Observable<Produit> {
    const produitToSend = {
      name: produit.name,
      prix: produit.prix,
      quantity: produit.quantity,
      depot: { id: produit.depot?.id }  // simplifie l'objet envoyé
    };
    return this.http.post<Produit>(this.apiUrl, produitToSend);
  }
  

  updateProduit(id: number, produit: Produit): Observable<Produit> {
    return this.http.put<Produit>(`${this.apiUrl}/${id}`, produit);
  }

  deleteProduit(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getProduitsByDepotId(depotId: number): Observable<Produit[]> {
    return this.http.get<Produit[]>(`${this.apiUrl}/depot/${depotId}`);
  }
}