package com.ordre.livresion.models;

import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.*;

@Entity
@Table(name = "lignes_commande")
public class LigneCommande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "commande_id")
    @JsonBackReference
    private Commande commande;


    @ManyToOne
    @JoinColumn(name = "produit_id", nullable = false)
    private Produit produit;

    @Column(nullable = false)
    private int quantity;

    @ManyToOne
    @JoinColumn(name = "depot_id", nullable = false)
    private Depot depot;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_produit", nullable = false)
    private StatutProduit statutProduit = StatutProduit.EN_PREPARATION;
    
  // getters and setters
    public Long getId() {
      return id;
    }

    public void setId(Long id) {
      this.id = id;
    }

    public Commande getCommande() {
      return commande;
    }

    public void setCommande(Commande commande) {
      this.commande = commande;
    }

    public Produit getProduit() {
      return produit;
    }

    public void setProduit(Produit produit) {
      this.produit = produit;
    }

    public int getQuantity() {
      return quantity;
    }

    public void setQuantity(int quantity) {
      this.quantity = quantity;
    }

    public Depot getDepot() {
      return depot;
    }

    public void setDepot(Depot depot) {
      this.depot = depot;
    }

    public StatutProduit getStatutProduit() {
      return statutProduit;
    }

    public void setStatutProduit(StatutProduit statutProduit) {
      this.statutProduit = statutProduit;
    }

  

    
}