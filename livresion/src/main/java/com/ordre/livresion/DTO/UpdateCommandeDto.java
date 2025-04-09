package com.ordre.livresion.DTO;

import java.util.List;

import com.ordre.livresion.models.StatutCommande;

public class UpdateCommandeDto {

  private Boolean payee;
  private Boolean retireSurPlace;
  private Long livreurId;
  private StatutCommande statutCommande;

  // Getters et setters
  

  public Long getLivreurId() {
    return livreurId;
  }
  public void setLivreurId(Long livreurId) {
    this.livreurId = livreurId;
  }
  public Boolean getPayee() {
    return payee;
  }
  public void setPayee(Boolean payee) {
    this.payee = payee;
  }
  public Boolean getRetireSurPlace() {
    return retireSurPlace;
  }
  public void setRetireSurPlace(Boolean retireSurPlace) {
    this.retireSurPlace = retireSurPlace;
  }
  public StatutCommande getStatutCommande() {
    return statutCommande;
  }
  public void setStatutCommande(StatutCommande statutCommande) {
    this.statutCommande = statutCommande;
  }
  
}

