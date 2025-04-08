package com.ordre.livresion.DTO;
import java.util.List;

public class CreateCommandeDto {

  private Long clientId;
  
  private Long livreurId;
  
  private boolean payee;
  
  private boolean retireSurPlace;
  
  private List<LigneCommandeDto> lignesCommande;

  // Getters et setters
  public Long getClientId() {
      return clientId;
  }

  public void setClientId(Long clientId) {
      this.clientId = clientId;
  }

  public Long getLivreurId() {
      return livreurId;
  }

  public void setLivreurId(Long livreurId) {
      this.livreurId = livreurId;
  }

  public boolean isPayee() {
      return payee;
  }

  public void setPayee(boolean payee) {
      this.payee = payee;
  }

  public boolean isRetireSurPlace() {
      return retireSurPlace;
  }

  public void setRetireSurPlace(boolean retireSurPlace) {
      this.retireSurPlace = retireSurPlace;
  }

  public List<LigneCommandeDto> getLignesCommande() {
      return lignesCommande;
  }

  public void setLignesCommande(List<LigneCommandeDto> lignesCommande) {
      this.lignesCommande = lignesCommande;
  }
}
