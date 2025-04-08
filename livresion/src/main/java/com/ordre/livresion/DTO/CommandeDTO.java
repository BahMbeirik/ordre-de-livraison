package com.ordre.livresion.DTO;

import com.ordre.livresion.models.*;
import java.util.List;

public class CommandeDTO {
  private Commande commande;
  private List<LigneCommandeDto> ligneCommandes;

  // getters and setters
  public Commande getCommande() {
    return commande;
  }
  public void setCommande(Commande commande) {
    this.commande = commande;
  }
  public List<LigneCommandeDto> getLigneCommandes() {
    return ligneCommandes;
  }
  public void setLigneCommandes(List<LigneCommandeDto> ligneCommandes) {
    this.ligneCommandes = ligneCommandes;
  }
}
