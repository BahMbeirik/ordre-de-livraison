import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface User {
  id?: number;
  username: string;
  password?: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/users';

  constructor(private http: HttpClient) { }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.apiUrl);
  }

  getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/username/${username}`);
  }

  // Récupérer les chefs de dépôt
  getChefs(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/chefs`);
  }

  addUser(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  updateUserRole(id: number, newRole: string): Observable<any> {
    const body = { role: newRole };
    return this.http.put(`${this.apiUrl}/${id}/role`, body, {
      headers: { 'Content-Type': 'application/json' },
      responseType: 'text' // Indique que la réponse est en texte brut
    });
  }

  getPaginatedUsers(page: number, size: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/paginated?page=${page}&size=${size}`);
  }

  searchUsers(query: string): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/search?query=${query}`);
  }
  
}