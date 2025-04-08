package com.ordre.livresion.models;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;


@Entity
@Table(name = "depots")
public class Depot {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @OneToMany(mappedBy = "depot", cascade = CascadeType.ALL)
    @JsonIgnore 
    private List<Produit> produits;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chef_id")
    private User chef;

    // Constructeurs, getters et setters
    public Depot() {}

    public Depot(String name, User chef) {
        this.name = name;
        this.chef = chef;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<Produit> getProduits() { return produits; }
    public void setProduits(List<Produit> produits) { this.produits = produits; }
    public User getChef() { return chef; }
    public void setChef(User chef) { this.chef = chef; }
}