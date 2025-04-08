package com.ordre.livresion.models;

import java.time.LocalDateTime;


import jakarta.persistence.*;
import java.util.*;

import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
@Table(name = "commandes")
public class Commande {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numero_commande", unique = true, nullable = false)
    private String numeroCommande;

    @OneToMany(mappedBy = "commande", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<LigneCommande> lignesCommande = new ArrayList<>();


    @ManyToOne
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @ManyToOne
    @JoinColumn(name = "livreur_id")
    private User livreur;

    @Column(name = "date_creation", nullable = false)
    private LocalDateTime dateCreation = LocalDateTime.now();

    @Column(name = "payee", nullable = false)
    private boolean payee = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "statut_commande", nullable = false)
    private StatutCommande statutCommande = StatutCommande.EN_PREPARATION;

    @Column(name = "date_depart")
    private LocalDateTime dateDepart;

    @Column(name = "date_livraison")
    private LocalDateTime dateLivraison;

    @Column(name = "retire_sur_place", nullable = false)
    private boolean retireSurPlace = false;
    

    // Méthode pour ajouter une ligne de commande
    public void addLigneCommande(Produit produit, int quantity, Depot depot) {
        LigneCommande ligne = new LigneCommande();
        ligne.setCommande(this);
        ligne.setProduit(produit);
        ligne.setQuantity(quantity);
        ligne.setDepot(depot);
        this.lignesCommande.add(ligne);
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getNumeroCommande() {
        return numeroCommande;
    }
    public void setNumeroCommande(String numeroCommande) {
        this.numeroCommande = numeroCommande;
    }
    
    
    public Client getClient() {
        return client;
    }
    public void setClient(Client client) {
        this.client = client;
    }
    
    public User getLivreur() {
        return livreur;
    }
    public void setLivreur(User livreur) {
        this.livreur = livreur;
    }
    public LocalDateTime getDateCreation() {
        return dateCreation;
    }
    public void setDateCreation(LocalDateTime dateCreation) {
        this.dateCreation = dateCreation;
    }
    public boolean isPayee() {
        return payee;
    }
    public void setPayee(boolean payee) {
        this.payee = payee;
    }
    public StatutCommande getStatutCommande() {
        return statutCommande;
    }
    public void setStatutCommande(StatutCommande statutCommande) {
        this.statutCommande = statutCommande;
    }
    public LocalDateTime getDateDepart() {
        return dateDepart;
    }
    public void setDateDepart(LocalDateTime dateDepart) {
        this.dateDepart = dateDepart;
    }
    public LocalDateTime getDateLivraison() {
        return dateLivraison;
    }
    public void setDateLivraison(LocalDateTime dateLivraison) {
        this.dateLivraison = dateLivraison;
    }
    public boolean isRetireSurPlace() {
        return retireSurPlace;
    }
    public void setRetireSurPlace(boolean retireSurPlace) {
        this.retireSurPlace = retireSurPlace;
    }

    public List<LigneCommande> getLignesCommande() {
      return lignesCommande;
    }

    public void setLignesCommande(List<LigneCommande> lignesCommande) {
      this.lignesCommande = lignesCommande;
    }

    
    
}


