package com.ordre.livresion.DTO;

public class LigneCommandeDto {
  private Long produitId;
  
  private int quantity;
  
  private Long depotId;

  // Getters et setters
  public Long getProduitId() {
      return produitId;
  }

  public void setProduitId(Long produitId) {
      this.produitId = produitId;
  }

  public int getQuantity() {
      return quantity;
  }

  public void setQuantity(int quantity) {
      this.quantity = quantity;
  }

  public Long getDepotId() {
      return depotId;
  }

  public void setDepotId(Long depotId) {
      this.depotId = depotId;
  }
}
