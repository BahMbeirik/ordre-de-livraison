import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

@Injectable()
export class JsonCleanInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        if (event instanceof HttpResponse && event.url?.includes('/api/commandes')) {
          return this.cleanCommandesResponse(event);
        }
        return event;
      })
    );
  }

  private cleanCommandesResponse(response: HttpResponse<any>): HttpResponse<any> {
    try {
      let body = response.body;
      
      if (Array.isArray(body)) {
        body = body.map(commande => this.cleanCommande(commande));
      } else if (body) {
        body = this.cleanCommande(body);
      }
      
      return response.clone({ body });
    } catch (e) {
      console.error('Error cleaning response', e);
      return response;
    }
  }

  private cleanCommande(commande: any): any {
    return {
      ...commande,
      lignesCommande: this.cleanLignesCommande(commande.lignesCommande)
    };
  }

  private cleanLignesCommande(lignes: any[]): any[] {
    if (!lignes) return [];
    return lignes.map(ligne => ({
      id: ligne.id,
      produit: ligne.produit,
      quantity: ligne.quantity,
      depot: ligne.depot,
      statutProduit: ligne.statutProduit
    }));
  }
}