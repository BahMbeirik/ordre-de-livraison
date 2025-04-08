import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Commande } from '../models/commande';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8080/api/commandes';
  private _notifications = new BehaviorSubject<Commande[]>([]);
  private _unreadCount = new BehaviorSubject<number>(0);

  // Expose observables
  notifications$ = this._notifications.asObservable();
  unreadCount$ = this._unreadCount.asObservable();

  constructor(private http: HttpClient) {
    this.setupPolling();
  }

  private setupPolling(): void {
    // Vérifie les nouvelles commandes toutes les 5 minutes (300000 ms)
    this.checkNewCommands();
    setInterval(() => this.checkNewCommands(), 300000);
  }

  checkNewCommands(): void {
    this.http.get<Commande[]>(`${this.apiUrl}?statut=EN_COURS`).pipe(
      tap(commandes => {
        const currentNotifications = this._notifications.value;
        const newCommands = commandes.filter(c => 
          !currentNotifications.some(n => n.id === c.id)
        );
        
        if (newCommands.length > 0) {
          this._notifications.next([...currentNotifications, ...newCommands]);
          this.incrementUnreadCount(newCommands.length);
          this.playNotificationSound();
        }
      })
    ).subscribe();
  }

  getNotifications(): Commande[] {
    return this._notifications.value;
  }

  markAsRead(commandeId: number): void {
    const updated = this._notifications.value.filter(c => c.id !== commandeId);
    this._notifications.next(updated);
    this.updateUnreadCount();
  }

  markAllAsRead(): void {
    this._notifications.next([]);
    this._unreadCount.next(0);
  }

  private incrementUnreadCount(count: number): void {
    this._unreadCount.next(this._unreadCount.value + count);
  }

  private updateUnreadCount(): void {
    this._unreadCount.next(this._notifications.value.length);
  }

  private playNotificationSound(): void {
    const audio = new Audio();
    audio.src = 'assets/sounds/notification.mp3'; // Ajoutez ce fichier dans vos assets
    audio.load();
    audio.play().catch(e => console.warn('Could not play notification sound', e));
  }

  // Pour les notifications push (optionnel)
  requestPushPermission(): void {
    if ('Notification' in window) {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          console.log('Notification permission granted');
        }
      });
    }
  }

  showPushNotification(title: string, options?: NotificationOptions): void {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, options);
    }
  }
}