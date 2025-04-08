package com.ordre.livresion.models;
import jakarta.persistence.*;

@Entity
@Table(name = "produits")
public class Produit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private int quantity;

    @Column(nullable = true)
    private double prix;

    @ManyToOne
    @JoinColumn(name = "depot_id")
    private Depot depot;

    // Constructeurs, getters et setters
    public Produit() {}

    public Produit(String name, double prix, int quantity) {
        this.name = name;
        this.prix = prix;
        this.quantity = quantity;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public double getPrix() { return prix; }
    public void setPrix(double prix) { this.prix = prix; }
    public Depot getDepot() { return depot; }
    public void setDepot(Depot depot) { this.depot = depot; }
    public int getQuantity() { return quantity; }
    public void setQuantity(int quantity) { this.quantity = quantity; }
}