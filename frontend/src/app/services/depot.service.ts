import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';
import { Depot } from '../models/depot';

@Injectable({
  providedIn: 'root'
})
export class DepotService {
  private apiUrl = 'http://localhost:8080/api/depots';

  constructor(private http: HttpClient) { }

  getAllDepots(): Observable<Depot[]> {
    return this.http.get<Depot[]>(this.apiUrl);
  }

  getDepotsByProduitId(produitId: number): Observable<Depot[]> {
    return this.http.get<Depot[]>(`${this.apiUrl}/produit/${produitId}`);
  }

  getDepot(id: number): Observable<Depot> {
    return this.http.get<Depot>(`${this.apiUrl}/${id}`);
  }

  createDepot(depot: Depot): Observable<Depot> {
    const depotToSend = {
      name: depot.name,
      chef: { id: depot.chef.id }
    };
    return this.http.post<Depot>(this.apiUrl, depotToSend).pipe(
      catchError(error => {
        console.error('Error creating depot:', error);
        throw error;
      })
    );
  }
  
  updateDepot(id: number, depot: Depot): Observable<Depot> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json'
    });
    
    // Create a clean payload without circular references
    const payload = {
        id: depot.id,
        name: depot.name,
        chef: { id: depot.chef.id }
    };
    
    return this.http.put<Depot>(
        `${this.apiUrl}/${id}`,
        payload,
        { headers }
    ).pipe(
        catchError(error => {
            console.error('Error updating depot:', error);
            throw error;
        })
    );
}

  

  deleteDepot(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}